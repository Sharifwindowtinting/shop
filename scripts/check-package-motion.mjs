import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:5173/');
 await page.locator('.tint-shade-picker').scrollIntoViewIfNeeded();
 const initial=Number(await page.locator('feFuncR').getAttribute('slope'));
 const early = await page.evaluate(async () => {
   document.querySelector('input[name="tint-shade"][value="5"]').click();
   await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
   return Number(document.querySelector('feFuncR').getAttribute('slope'));
 });
 const target=Math.pow(5/70,1.35);
 assert.ok(early<=initial&&early>target,'Glass should transition instead of jumping');
 await page.waitForFunction(target=>Math.abs(Number(document.querySelector('feFuncR').getAttribute('slope'))-target)<0.0001,target);
 // Retarget several times without allowing the earlier transitions to finish.
 await page.locator('input[name="tint-shade"][value="70"]').evaluate(el=>el.click());
 await page.locator('input[name="tint-shade"][value="20"]').evaluate(el=>el.click());
 await page.waitForFunction(()=>Math.abs(Number(document.querySelector('feFuncR').getAttribute('slope'))-Math.pow(20/70,1.35))<0.0001);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('input[name="tint-shade"][value="70"]').evaluate(el=>el.click());
 await page.waitForFunction(()=>Number(document.querySelector('feFuncR').getAttribute('slope'))===1);
 const switches=page.getByRole('group',{name:'Package type'});
 await switches.getByRole('button',{name:'Paint protection film'}).click();
 assert.equal(await page.locator('.ppf-coverage-reveal').evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('#mobile-ppf-coverage').click();
 await page.getByRole('option',{name:'Full Vehicle',exact:true}).click();
 assert.equal(await page.locator('.ppf-coverage-reveal').evaluate(el=>getComputedStyle(el).animationName),'package-photo-in');
 await page.getByRole('button',{name:'Get a PPF quote'}).click();
 assert.match(await page.locator('#package-selection').textContent(),/Full Vehicle/);
 assert.deepEqual(errors,[]);
 console.log('Passed: intermediate tint frames, rapid retargeting, reduced motion, PPF reveal, and quote action.');
}finally{await browser.close();}
