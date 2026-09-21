import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 let payload;await page.route('**/api/lead',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await page.goto('http://127.0.0.1:5173/');
 for(const width of [320,375,390,430,768]) {
  await page.setViewportSize({width,height:844});
  assert.equal(await page.locator('#services .service-list button').count(),3);
  for(const value of [5,20,35,50,70]) {
   const label=page.locator('.tint-shade-option').filter({has:page.locator(`input[value="${value}"]`)});
   await label.tap();
   assert.equal(await page.locator('.tint-shade-option input:checked').inputValue(),String(value));
   const bounds=await label.boundingBox();assert.ok(bounds.width>=44&&bounds.height>=44);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('.tint-shade-option').filter({has:page.locator('input[value="20"]')}).tap();
 await page.getByRole('button',{name:'Get a ceramic tint quote'}).tap();
 assert.match(await page.locator('#package-selection').textContent(),/Ceramic Film · Preferred tint: 20%/);
 for(const [name,value] of Object.entries({name:'Test Customer',phone:'9165550123',email:'test@example.com',vehicle:'2024 Tesla Model 3'}))await page.locator(`#quote [name="${name}"]`).fill(value);
 await page.locator('#quote button[type="submit"]').tap();await page.getByRole('status').filter({hasText:'Request sent.'}).waitFor();
 assert.match(payload.message,/Selected film: Ceramic Film\nPreferred tint: 20% VLT/);
 assert.equal(await page.locator('.tint-shade-option input:checked').count(),0);
 await page.locator('.tint-shade-option').filter({has:page.locator('input[value="35"]')}).tap();
 await page.locator('#services [data-service="Paint protection film"]').tap();
 assert.equal(await page.locator('.tint-shade-option input:checked').count(),0);
 await page.locator('.tint-shade-photo img').evaluate(img=>img.loading='eager');await page.waitForFunction(()=>document.querySelector('.tint-shade-photo img').naturalWidth>0);
 await page.addStyleTag({content:'header,.bottom-bar{visibility:hidden!important}'});
 await page.locator('.tint-shade-picker').screenshot({path:'artifacts/mobile-tint-picker.png'});
 console.log('Passed: touch selection and target sizes at 5 phone/tablet widths, no overflow, unchanged services, film/shade quote payload, success reset, non-tint reset. No real lead sent.');
}finally{await browser.close();}
