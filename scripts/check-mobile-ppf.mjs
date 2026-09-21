import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { packageGroups } from '../src/packageGroups.js';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 let payload;await page.route('**/api/lead',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await page.goto('http://127.0.0.1:5173/');
 await page.getByRole('group',{name:'Package type'}).getByRole('button',{name:'Paint protection film'}).tap();
 for(const item of packageGroups.find(group=>group.key==='ppf').options) {
  await page.locator('#mobile-ppf-coverage').click();
  await page.getByRole('option',{name:item.name,exact:true}).click();
  assert.equal(await page.locator('.mobile-ppf-detail img').getAttribute('src'),item.visual);
  assert.equal(await page.locator('.mobile-ppf-copy h3').textContent(),item.name);
 }
 for(const width of [320,390,768]) {await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.setViewportSize({width:390,height:844});
 await page.locator('#mobile-ppf-coverage').click();
 await page.getByRole('option',{name:'Full Front',exact:true}).click();
 await page.getByRole('button',{name:'Get a PPF quote'}).tap();
 assert.equal(await page.locator('#quote select').inputValue(),'Paint protection film');
 assert.match(await page.locator('#package-selection').textContent(),/Selected package: Full Front/);
 for(const [name,value] of Object.entries({name:'Test',phone:'9165550123',email:'test@example.com',vehicle:'2024 Test car'}))await page.locator(`#quote [name="${name}"]`).fill(value);
 await page.locator('#quote button[type="submit"]').tap();await page.getByRole('status').filter({hasText:'Request sent.'}).waitFor();
 assert.match(payload.message,/Selected package: Full Front/);assert.ok(!payload.message.includes('VLT'));
 await page.getByRole('group',{name:'Package type'}).getByRole('button',{name:'Window tint'}).tap();assert.equal(await page.locator('.tint-shade-picker').count(),1);
 console.log('Passed: all PPF coverage diagrams, mobile widths, package selection, quote payload, and tint switching. No real lead sent.');
}finally{await browser.close();}
