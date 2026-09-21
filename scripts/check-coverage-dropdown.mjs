import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 await page.goto('http://127.0.0.1:5173/');
 await page.getByRole('group',{name:'Package type'}).getByRole('button',{name:'Paint protection film'}).click();
 const trigger=page.locator('#mobile-ppf-coverage');
 await trigger.click();await page.getByRole('listbox').waitFor();
 assert.equal(await page.locator('.coverage-select-popup').evaluate(el=>getComputedStyle(el).transitionDuration.includes('0.2s')),true);
 await page.getByRole('listbox').press('Home');await page.getByRole('listbox').press('Enter');
 assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.match(await trigger.textContent(),/Partial Hood/);
 assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
 await trigger.press('ArrowDown');await page.getByRole('listbox').press('End');await page.getByRole('listbox').press('Enter');assert.match(await trigger.textContent(),/Full Vehicle/);
 await trigger.click();await page.getByRole('listbox').press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
 await trigger.tap();await page.getByRole('option',{name:'Partial Front + Mirrors',exact:true}).tap();assert.match(await page.locator('.mobile-ppf-copy h3').textContent(),/Partial Front \+ Mirrors/);
 await page.emulateMedia({reducedMotion:'reduce'});await trigger.click();assert.equal(await page.locator('.coverage-select-popup').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 await page.getByRole('listbox').press('Escape');await trigger.click();await page.locator('#packages h2').click();assert.equal(await trigger.getAttribute('aria-expanded'),'false');
 console.log('Passed: animated open, keyboard selection, Escape/focus return, touch selection, outside dismissal, reduced motion.');
}finally{await browser.close();}
