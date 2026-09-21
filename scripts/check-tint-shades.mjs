import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 let payload; await page.route('**/api/lead',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await page.goto('http://127.0.0.1:5173/');
 for(const value of [5,20,35,50,70]) {
  await page.locator(`.tint-shade-option input[value="${value}"]`).check({force:true});
  assert.equal(await page.locator('.tint-shade-option input:checked').inputValue(),String(value));
  assert.ok(Math.abs(Number(await page.locator('.tint-shade-photo feFuncR').getAttribute('slope'))-Math.pow(value/70,1.35))<0.001);
 }
 await page.locator('.tint-shade-option input[value="20"]').check({force:true});
 await page.locator('.package-actions').getByRole('link',{name:'Start quote'}).click();
 assert.equal(await page.locator('#quote select').inputValue(),'Window Tint');
 assert.match(await page.locator('.quote-package-selection').textContent(),/20% tint/);
 for(const [name,value] of Object.entries({name:'Test',phone:'9165550123',email:'test@example.com',vehicle:'2024 Test car'}))await page.locator(`#quote [name="${name}"]`).fill(value);
 await page.locator('#quote button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#quote').textContent.includes('Request sent.'));
 assert.match(payload.message,/Preferred tint: 20% VLT/);
 await page.locator('.tint-shade-unsure').click();assert.equal(await page.locator('.tint-shade-option input:checked').count(),0);
 await page.getByRole('button',{name:'PPF Packages',exact:true}).click();assert.equal(await page.locator('.tint-shade-picker').count(),0);
 await page.getByRole('button',{name:'Window Tint',exact:true}).click();
 for(const width of [769,1024,1440]) {await page.setViewportSize({width,height:1000});assert.ok(await page.locator('.tint-shade-picker').evaluate(el=>el.scrollWidth<=el.clientWidth));}
 await page.locator('.tint-shade-photo img').evaluate(img=>img.loading='eager');await page.waitForFunction(()=>document.querySelector('.tint-shade-photo img').naturalWidth>0);
 await page.addStyleTag({content:'.site-header,.floating-call{visibility:hidden!important}'});await page.locator('.tint-shade-picker').screenshot({path:'artifacts/tint-shades.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForSelector('#hero-video');assert.equal(await page.locator('.tint-shade-picker').count(),1);
 console.log('Passed: all shades, glass transmission, quote payload, no-preference option, PPF exclusion, desktop widths, mobile selector present. No lead sent.');
}finally{await browser.close();}
