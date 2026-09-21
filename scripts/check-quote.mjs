import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import handler from '../api/lead.js';

// Rejected requests must never reach storage or email delivery.
const originalFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error('Unexpected network request'); };
for (const email of ['', 'not-an-email', 'person@example']) {
  let code;
  let body;
  const response = { status(value) { code = value; return this; }, json(value) { body = value; } };
  await handler({ method: 'POST', body: { name: 'Test', phone: '9165550123', vehicle: 'Test car', email } }, response);
  assert.equal(code, 400);
  assert.equal(body.field, 'email');
}
globalThis.fetch = originalFetch;

const browser = await chromium.launch({headless:true,channel:'chrome'});
try {
  for (const width of [320, 768, 1024, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    let requests = 0;
    await page.route('**/api/lead', async route => {
      requests++;
      assert.equal(route.request().postDataJSON().email, 'test@example.com');
      await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});
    });
    await page.goto('http://127.0.0.1:5173/');
    const form = page.locator('#quote form');
    await form.locator('[name="name"]').fill('Test Customer');
    await form.locator('[name="phone"]').fill('9165550123');
    await form.locator('[name="vehicle"]').fill('2024 Test Car');
    await form.locator('button[type="submit"]').click();
    assert.equal(requests, 0);
    assert.equal(await form.locator('[name="email"]').evaluate(el => el === document.activeElement), true);
    await form.locator('[name="email"]').fill('test@example');
    await form.locator('button[type="submit"]').click();
    assert.equal(requests, 0);
    await form.locator('[name="email"]').fill('test@example.com');
    assert.equal(await form.getByRole('progressbar').count(), 0);
    assert.equal(await form.locator('label').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#quote').textContent.includes('Request sent.'));
    assert.equal(await form.locator('[name="email"]').inputValue(), '');
    assert.equal(requests, 1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
    if(width === 320) await form.screenshot({path:'artifacts/quote-mobile.png'});
    await page.close();
  }
  console.log('Passed: server email rejection without external calls; required email, invalid email, focus, form reset, reduced motion, successful submission at 320/768/1024/1440px.');
} finally { await browser.close(); }
