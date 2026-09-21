import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173/');
  await page.locator('.tint-shade-option').filter({has:page.locator('input[value="20"]')}).click();
  await page.getByRole('link',{name:'Help me choose',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#quote');
  assert.equal(await page.locator('#quote select').inputValue(),width===390?'Window tint':'Window Tint');
  assert.equal(await page.locator('input[name="tint-shade"]:checked').count(),0);
  assert.equal(await page.locator('#quote select').evaluate(el=>el===document.activeElement),true);
  assert.ok(!(await page.locator('#quote').textContent()).includes('20%'));
  await page.close();
 }
 console.log('Passed: mobile and desktop quote navigation, service selection, focus, and cleared shade preference.');
}finally{await browser.close();}
