import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5173/');
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.waitForFunction(mobile => Boolean(document.querySelector('#hero-video')) === mobile,width<=768);
    if (width <= 768) {
      assert.equal(await page.locator('#services .service-list button').count(), 3);
      assert.equal(await page.locator('#services .service-story').count(), 0);
      await page.locator('#services [data-service="Window tint"]').click();
      assert.equal(await page.locator('#quote select').inputValue(), 'Window tint');
      continue;
    }
    for(const [name,expected] of [['Window tint','Window Tint'],['Paint protection film','Paint Protection Film'],['Ceramic coating','Ceramic Coating']]) {
      await page.getByRole('link',{name:`Get a quote for ${name}`,exact:true}).click();
      assert.equal(await page.locator('#quote select').inputValue(),width<=768 ? name : expected);
    }
    await page.locator('.service-spaces').click();
    assert.equal(await page.locator('#quote select').inputValue(),'Home & commercial tint');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow at ${width}`);
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    assert.equal(await page.locator('#services').evaluate(el=>el.scrollWidth<=el.clientWidth),true,`Service text overflow at ${width}`);
    await page.evaluate(()=>document.documentElement.style.fontSize='');
  }
  await page.locator('#services img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#services img')].every(img=>img.complete&&img.naturalWidth>0));
  await page.evaluate(()=>document.fonts.ready);
  // Hide floating navigation for a clean section-only design capture.
  await page.addStyleTag({content:'.site-header,.floating-call,.bottom-bar{visibility:hidden!important}'});
  await page.locator('#services').screenshot({path:'artifacts/services-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.waitForSelector('#hero-video');
  await page.locator('#services img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#services img')].every(img=>img.complete&&img.naturalWidth>0));
  await page.addStyleTag({content:'header{visibility:hidden!important}'});
  await page.locator('#services').screenshot({path:'artifacts/services-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('Service links, quote selection, images, and layout at five widths and 200% text passed.');
} finally { await browser.close(); }
