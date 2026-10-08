import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { compileScript, parse } from '@vue/compiler-sfc';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

const source = readFileSync(new URL('../../resources/js/components/MenuSection.vue', import.meta.url), 'utf8');
const { descriptor } = parse(source);
const compiled = compileScript(descriptor, { id: 'menu-test', inlineTemplate: true });
const code = stripTypeScriptTypes(compiled.content)
  .replaceAll(/from ["']vue["']/g, `from ${JSON.stringify(import.meta.resolve('vue'))}`)
  .replace('"../content/kinnor"', JSON.stringify(new URL('../../resources/js/content/kinnor.ts', import.meta.url).href));
const { default: MenuSection } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

function frames(count) {
  return Array.from({ length: count }, (_, index) => ({
    number: String(index + 1).padStart(2, '0'), label: `CARD ${index + 1}`, note: 'Your daily ritual.',
    availability: 'ALL DAY', row: Math.floor(index / 3) + 1,
    groups: [{ label: 'Espresso', items: [{ name: 'Latte', price: '$5.50', description: 'Espresso and milk.', detail: 'Hot or iced.' }] }],
    footer: 'Made with care.',
  }));
}

async function render(menu) {
  return renderToString(createSSRApp(MenuSection).provide('publishedMenu', menu));
}

for (const count of [1, 3, 9]) {
  test(`renders ${count} cards in intentional rows`, async () => {
    const html = await render({ active: true, frames: frames(count) });
    assert.equal((html.match(/<article/g) ?? []).length, count);
    assert.equal((html.match(/class="menu-frames /g) ?? []).length, Math.ceil(count / 3));
    assert.match(html, new RegExp(`menu-frames--${Math.min(count, 3)}`));
    assert.match(html, /Espresso and milk/);
    assert.match(html, /Hot or iced/);
    assert.match(html, /Made with care/);
  });
}

test('respects assigned rows and splits overflowing rows after three cards', async () => {
  const cards = frames(5).map((frame, index) => ({ ...frame, row: index === 0 ? 9 : 2 }));
  const html = await render({ active: true, frames: cards });
  assert.equal((html.match(/class="menu-frames /g) ?? []).length, 3);
  assert.ok(html.indexOf('CARD 2') < html.indexOf('CARD 1'));
});

test('never restores static content for inactive or empty published menus', async () => {
  assert.doesNotMatch(await render({ active: false, frames: frames(3) }), /<section/);
  assert.doesNotMatch(await render({ active: true, frames: [] }), /<section/);
  assert.equal(((await render(null)).match(/<article/g) ?? []).length, 5);
});

test('escapes user input and caps unexpected excess cards', async () => {
  const cards = frames(10);
  cards[0].groups[0].items[0].name = '<script>alert(1)</script>';
  const html = await render({ active: true, frames: cards });
  assert.equal((html.match(/<article/g) ?? []).length, 9);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

// Optional local visual fixture; never loaded by the application.
if (process.env.MENU_LAYOUT_PREVIEW) {
  const sections = await Promise.all([1, 3, 9].map(async count => `<h1>${count} menu cards</h1>${await render({ active: true, frames: frames(count) })}`));
  writeFileSync(process.env.MENU_LAYOUT_PREVIEW, `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{--cream:#f5f0e5;--ink:#13232e;--lime:#d5ed65;--pink:#efbdce;--blue:#2e4759;--orange:#e66b31;--line:2px solid var(--ink)}*{box-sizing:border-box}body{margin:0;color:var(--ink);font-family:sans-serif}${descriptor.styles[0].content}</style></head><body>${sections.join('')}</body></html>`);
}
