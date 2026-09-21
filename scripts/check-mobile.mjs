import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error' && !message.text().includes('Failed to load resource')) errors.push(message.text()); });
let payload;
let reject = false;
let requests = 0;
// Intercept all lead requests: this check never sends an email or stores a lead.
await page.route('**/api/lead', async route => {
  requests++;
  payload = route.request().postDataJSON();
  await route.fulfill({ status: reject ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ ok: !reject }) });
});
try {
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
  for (const width of [320, 375, 390, 430, 600, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(mobile => !!document.querySelector('#hero-video') === mobile, width <= 768);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', {name:'Our services'}).click();
  assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'), 'false');
  const tintSlider = page.getByRole('slider', { name: 'Compare Window tint before and after' });
  const ppfSlider = page.getByRole('slider', { name: 'Compare Paint protection film before and after' });
  await tintSlider.focus();
  await tintSlider.press('Home');
  assert.equal(await tintSlider.inputValue(), '0');
  assert.equal(await page.locator('.mobile-comparison-image').first().evaluate(node => node.style.getPropertyValue('--position')), '0%');
  await tintSlider.press('End');
  assert.equal(await tintSlider.inputValue(), '100');
  assert.equal(await ppfSlider.inputValue(), '50');
  await ppfSlider.fill('25');
  assert.equal(await ppfSlider.getAttribute('aria-valuetext'), '25% before, 75% after');
  await page.getByRole('button', {name:'Get a ceramic tint quote'}).click();
  assert.match(await page.locator('#package-selection').textContent(), /Ceramic Film/);
  await page.locator('input[name="vehicle"]').fill('2024 Tesla Model 3');
  await page.locator('input[name="name"]').fill('Test Customer');
  await page.locator('input[name="phone"]').fill('9165550123');
  await page.locator('textarea[name="message"]').fill('Side windows');
  await page.getByRole('button', {name:'Send my quote request'}).click();
  assert.equal(requests, 0, 'Missing email must block submission');
  await page.locator('input[name="email"]').fill('test@example.com');
  reject = true;
  await page.getByRole('button', {name:'Send my quote request'}).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('input[name="vehicle"]').inputValue(), '2024 Tesla Model 3');
  reject = false;
  await page.getByRole('button', {name:'Send my quote request'}).click();
  await page.getByRole('status').waitFor();
  assert.match(await page.getByRole('status').textContent(), /Request sent/);
  assert.equal(payload.services, 'Window tint');
  assert.match(payload.message, /Selected film: Ceramic Film\nSide windows/);
  assert.equal(payload.vehicle, '2024 Tesla Model 3');
  assert.equal(await page.locator('input[name="name"]').inputValue(), '');
  await page.locator('#service').selectOption('Home & commercial tint');
  await page.getByLabel('Tell us about your space').waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('video').paused);
  await page.getByRole('button', {name:'Play hero video'}).click();
  await page.waitForFunction(() => !document.querySelector('video').paused && document.querySelector('video').currentTime > 0);
  await page.getByRole('button', {name:'Pause hero video'}).click();
  assert.equal(await page.locator('video').evaluate(video => video.paused), true);
  await page.goto('http://127.0.0.1:5173/');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({path:'artifacts/mobile-built.png'});
  await page.screenshot({path:'artifacts/mobile-built-full.png',fullPage:true});
  assert.deepEqual(errors, []);
  assert.equal(requests, 2);
  console.log('Passed: 8 viewport widths, desktop/mobile switching, menu, film selection, lead payload, error recovery, success, property fields, video controls, reduced motion. No real leads sent.');
} finally { await browser.close(); }
