<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PublishedMenuTest extends TestCase
{
    private const URL = 'https://inventory.example/api/v1/menu';

    protected function setUp(): void
    {
        parent::setUp();
        config(['menu.api_url' => self::URL, 'menu.cache_store' => 'array', 'menu.check_interval' => 60]);
    }

    private function payload(bool $active = true, string $label = 'Coffee'): array
    {
        $data = ['active' => $active, 'frames' => $active ? [[
            'number' => '01', 'label' => $label, 'note' => 'Every day.', 'availability' => 'ALL DAY',
            'row' => 1, 'groups' => [['items' => [['name' => 'Latte', 'price' => '$5.50']]]],
        ]] : []];

        return ['version' => hash('sha256', json_encode($data, JSON_THROW_ON_ERROR)), 'data' => $data];
    }

    public function test_homepage_embeds_the_menu_and_reuses_it_without_api_calls(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $payload = $this->payload();
        Http::fake([self::URL => Http::response($payload)]);

        $this->get('/')->assertOk()->assertViewHas('menu', $payload['data'])->assertSee('id="published-menu"', false);
        $this->get('/')->assertViewHas('menu', $payload['data']);
        Http::assertSentCount(1);
    }

    public function test_revalidation_sends_the_version_and_preserves_unchanged_data(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $payload = $this->payload();
        Http::fake([self::URL => Http::sequence()->push($payload)->push('', 304)]);
        $this->get('/');
        $this->travel(61)->seconds();

        $this->get('/')->assertViewHas('menu', $payload['data']);
        Http::assertSent(fn ($request): bool => $request->hasHeader('If-None-Match', '"'.$payload['version'].'"'));
        Http::assertSentCount(2);
    }

    public function test_live_updates_and_deactivation_replace_the_cache(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $updated = $this->payload(label: 'Seasonal');
        $inactive = $this->payload(false);
        Http::fake([self::URL => Http::sequence()->push($this->payload())->push($updated)->push($inactive)]);
        $this->get('/');
        $this->travel(61)->seconds();
        $this->get('/')->assertViewHas('menu', $updated['data']);
        $this->travel(61)->seconds();
        $this->get('/')->assertViewHas('menu', ['active' => false, 'frames' => []]);
        Http::assertSentCount(3);
    }

    public function test_an_outage_or_malformed_response_preserves_the_last_good_menu(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $payload = $this->payload();
        Http::fake([self::URL => Http::sequence()->push($payload)->pushStatus(503)->push(['data' => 'invalid'])->pushFailedConnection()]);
        $this->get('/');
        foreach (range(1, 3) as $attempt) {
            $this->travel(2)->days();
            $this->get('/')->assertOk()->assertViewHas('menu', $payload['data']);
            $this->get('/')->assertViewHas('menu', $payload['data']);
        }
        Http::assertSentCount(4);
    }

    public function test_a_first_load_outage_hides_the_menu_without_serving_old_static_prices(): void
    {
        Http::preventStrayRequests();
        Http::fake([self::URL => Http::response([], 500)]);
        $this->get('/')->assertOk()->assertViewHas('menu', ['active' => false, 'frames' => []]);
        Http::assertSentCount(1);
    }

    public function test_unconfigured_api_keeps_the_local_preview(): void
    {
        config(['menu.api_url' => null]);
        Http::preventStrayRequests();
        Http::fake([self::URL => Http::response([])]);
        $this->get('/')->assertOk()->assertViewHas('menu', null);
        Http::assertNothingSent();
    }

    public function test_api_content_is_safely_encoded_in_the_document(): void
    {
        Http::preventStrayRequests();
        $payload = $this->payload(label: '</script><script>alert(1)</script>');
        Http::fake([self::URL => Http::response($payload)]);
        $this->get('/')->assertViewHas('menu', $payload['data'])->assertDontSee('</script><script>alert(1)</script>', false);
        Http::assertSentCount(1);
    }

    public function test_incorrect_content_versions_do_not_overwrite_the_cache(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $payload = $this->payload();
        $invalid = $this->payload(label: 'Changed');
        $invalid['version'] = str_repeat('0', 64);
        Http::fake([self::URL => Http::sequence()->push($payload)->push($invalid)]);
        $this->get('/');
        $this->travel(61)->seconds();
        $this->get('/')->assertViewHas('menu', $payload['data']);
        Http::assertSentCount(2);
    }

    public function test_concurrent_refreshes_serve_the_cached_menu_without_another_api_call(): void
    {
        $this->freezeTime();
        Http::preventStrayRequests();
        $payload = $this->payload();
        Http::fake([self::URL => Http::response($payload)]);
        $this->get('/');
        $this->travel(61)->seconds();
        $lock = Cache::store('array')->lock('published-menu:v1:'.hash('sha256', self::URL).':refresh', 10);
        $this->assertTrue($lock->get());
        try {
            $this->get('/')->assertViewHas('menu', $payload['data']);
            Http::assertSentCount(1);
            $this->assertTrue($lock->isOwnedByCurrentProcess());
        } finally {
            $lock->release();
        }
    }
}
