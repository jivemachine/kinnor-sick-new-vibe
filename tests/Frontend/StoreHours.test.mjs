import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { compileScript, parse } from '@vue/compiler-sfc';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { summarizeStoreHours } from '../../resources/js/utils/storeHours.ts';

async function component(name) {
  const source = readFileSync(new URL(`../../resources/js/components/${name}.vue`, import.meta.url), 'utf8');
  const { descriptor } = parse(source);
  const compiled = compileScript(descriptor, { id: `hours-${name}`, inlineTemplate: true });
  const code = stripTypeScriptTypes(compiled.content)
    .replaceAll(/from ["']vue["']/g, `from ${JSON.stringify(import.meta.resolve('vue'))}`)
    .replace('"../content/kinnor"', JSON.stringify(new URL('../../resources/js/content/kinnor.ts', import.meta.url).href))
    .replace('"../utils/storeHours"', JSON.stringify(new URL('../../resources/js/utils/storeHours.ts', import.meta.url).href));
  return (await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)).default;
}

const VisitSection = await component('VisitSection');
const HeroSection = await component('HeroSection');
const week = () => ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => [day, '7AM — 6PM']);
const render = (component, hours) => renderToString(createSSRApp(component).provide('publishedStoreHours', hours === null ? null : { timezone: 'America/Chicago', hours }));

test('the welcome message follows uniform, varied and closed-day hours', async () => {
  const hours = week();
  assert.deepEqual(summarizeStoreHours(hours), { heading: 'OPEN EVERY DAY', detail: '7AM — 6PM. See you in the room.' });
  hours[0][1] = '9AM — 2PM';
  assert.deepEqual(summarizeStoreHours(hours), { heading: 'OPEN EVERY DAY', detail: 'See our weekly hours below.' });
  hours[6][1] = 'CLOSED';
  const hero = await render(HeroSection, hours);
  assert.match(hero, /PLAN YOUR VISIT/);
  assert.doesNotMatch(hero, /OPEN EVERY DAY|7AM — 6PM/);
  assert.match(await render(VisitSection, hours), /9AM — 2PM/);
  assert.match(await render(VisitSection, hours), /CLOSED/);
});

test('displays a full week and overnight hours in Central Time', async () => {
  const hours = week();
  hours[4][1] = '6:30PM — 2AM (+1 day)';
  const html = await render(VisitSection, hours);
  for (const [day] of hours) assert.match(html, new RegExp(day));
  assert.match(html, /6:30PM — 2AM \(\+1 day\)/);
  assert.match(html, /Central Time/);
});

test('does not invent opening hours during a first-load outage or full closure', async () => {
  const visit = await render(VisitSection, []);
  assert.match(visit, /Hours are temporarily unavailable/);
  assert.doesNotMatch(visit, /7AM/);
  assert.match(await render(HeroSection, []), /COME SAY HI/);
  const closed = week().map(([day]) => [day, 'CLOSED']);
  assert.match(await render(HeroSection, closed), /CURRENTLY CLOSED/);
  assert.doesNotMatch(await render(HeroSection, closed), /OPEN EVERY DAY/);
});

test('preserves the unconfigured preview and escapes published text', async () => {
  assert.match(await render(HeroSection, null), /OPEN EVERY DAY/);
  assert.match(await render(VisitSection, null), /7AM — 6PM/);
  const hours = week();
  hours[0][1] = '<script>alert(1)</script>';
  const html = await render(VisitSection, hours);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
