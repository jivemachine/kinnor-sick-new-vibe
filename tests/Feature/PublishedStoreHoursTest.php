<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PublishedStoreHoursTest extends TestCase
{
    private const URL = 'https://inventory.example/api/v1/store-hours';

    protected function setUp(): void
    {
        parent::setUp();
        config(['menu.api_url' => null, 'store-hours.api_url' => self::URL, 'store-hours.cache_store' => 'array', 'store-hours.check_interval' => 3600]);
        Http::preventStrayRequests();
        $this->freezeTime();
    }

    private function payload(string $monday = '7AM — 6PM'): array
    {
        $data = ['timezone' => 'America/Chicago', 'hours' => array_map(fn (string $day): array => [$day, $day === 'MON' ? $monday : '7AM — 6PM'], ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])];

        return ['data' => $data, 'version' => hash('sha256', json_encode($data, JSON_THROW_ON_ERROR))];
    }

    public function test_homepage_reuses_hours_for_an_hour_and_revalidates_with_the_version(): void
    {
        $payload = $this->payload();
        Http::fake([self::URL => Http::sequence()->push($payload)->push('', 304)]);
        $this->get('/')->assertOk()->assertViewHas('storeHours', $payload['data'])->assertSee('id="published-store-hours"', false);
        $this->travel(3599)->seconds();
        $this->get('/')->assertViewHas('storeHours', $payload['data']);
        Http::assertSentCount(1);
        $this->travel(2)->seconds();
        $this->get('/')->assertViewHas('storeHours', $payload['data']);
        Http::assertSent(fn ($request): bool => $request->hasHeader('If-None-Match', '"'.$payload['version'].'"'));
        Http::assertSentCount(2);
    }

    public function test_published_closed_days_replace_the_cache_after_the_interval(): void
    {
        $updated = $this->payload('CLOSED');
        Http::fake([self::URL => Http::sequence()->push($this->payload())->push($updated)]);
        $this->get('/');
        $this->travel(3601)->seconds();
        $this->get('/')->assertViewHas('storeHours', $updated['data']);
        Http::assertSentCount(2);
    }

    public function test_invalid_or_unavailable_responses_preserve_last_good_hours_and_retry_soon(): void
    {
        $payload = $this->payload();
        $badVersion = $this->payload('CLOSED');
        $badVersion['version'] = str_repeat('0', 64);
        Http::fake([self::URL => Http::sequence()->push($payload)->pushStatus(503)->push($badVersion)->push(['data' => []])->push($this->payload('CLOSED'))]);
        $this->get('/');
        $this->travel(3601)->seconds();
        foreach (range(1, 3) as $attempt) {
            $this->get('/')->assertOk()->assertViewHas('storeHours', $payload['data']);
            $this->get('/')->assertViewHas('storeHours', $payload['data']);
            Http::assertSentCount(1 + $attempt);
            $this->travel(61)->seconds();
        }
        $this->get('/')->assertViewHas('storeHours', $this->payload('CLOSED')['data']);
        Http::assertSentCount(5);
    }

    public function test_cold_failure_does_not_publish_static_hours_and_recovers_after_a_minute(): void
    {
        Http::fake([self::URL => Http::sequence()->pushFailedConnection()->push($this->payload())]);
        $this->get('/')->assertOk()->assertViewHas('storeHours', ['timezone' => 'America/Chicago', 'hours' => []]);
        $this->get('/')->assertViewHas('storeHours', ['timezone' => 'America/Chicago', 'hours' => []]);
        Http::assertSentCount(1);
        $this->travel(61)->seconds();
        $this->get('/')->assertViewHas('storeHours', $this->payload()['data']);
        Http::assertSentCount(2);
    }

    public function test_concurrent_requests_keep_using_the_saved_hours(): void
    {
        $payload = $this->payload();
        Http::fake([self::URL => Http::response($payload)]);
        $this->get('/');
        $this->travel(3601)->seconds();
        $lock = Cache::store('array')->lock('published-store-hours:v1:'.hash('sha256', self::URL).':refresh', 10);
        $this->assertTrue($lock->get());
        try {
            $this->get('/')->assertViewHas('storeHours', $payload['data']);
            Http::assertSentCount(1);
            $this->assertTrue($lock->isOwnedByCurrentProcess());
        } finally {
            $lock->release();
        }
    }

    public function test_unconfigured_api_keeps_preview_hours(): void
    {
        config(['store-hours.api_url' => null]);
        Http::fake();
        $this->get('/')->assertViewHas('storeHours', null);
        Http::assertNothingSent();
    }

    public function test_hours_are_encoded_safely_in_the_page(): void
    {
        $payload = $this->payload('</script><script>alert(1)</script>');
        Http::fake([self::URL => Http::response($payload)]);
        $this->get('/')->assertViewHas('storeHours', $payload['data'])->assertDontSee('</script><script>alert(1)</script>', false);
    }
}
