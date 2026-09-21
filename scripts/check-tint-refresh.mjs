import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:900});
  for(let refresh=0;refresh<2;refresh++) {
   await page.goto('http://127.0.0.1:5173/#packages',{waitUntil:'domcontentloaded'});
   for(const shade of [5,70,20]) {
    await page.locator('.tint-shade-option').filter({has:page.locator(`input[value="${shade}"]`)}).click();
    assert.equal(await page.locator('input[name="tint-shade"]:checked').inputValue(),String(shade));
    await page.waitForFunction(v=>{const img=document.querySelector('.tint-shade-frame.is-active');return img?.dataset.shade===String(v)&&img.complete&&img.naturalWidth>0;},shade);
   }
   assert.equal(await page.locator('.tint-shade-photo filter').count(),0);
  }
 }
 const samples=await page.evaluate(async()=>{
  const values=[];
  for(const shade of [5,20,35,50,70]){
   const image=new Image();image.src=`/assets/tint-shades/tesla-${shade}.webp`;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
   const pixels=ctx.getImageData(405,245,35,30).data;let sum=0;for(let i=0;i<pixels.length;i+=4)sum+=pixels[i]+pixels[i+1]+pixels[i+2];values.push(sum/(pixels.length/4*3));
  }return values;
 });
 for(let i=1;i<samples.length;i++)assert.ok(samples[i]>samples[i-1]+2,`Shades should visibly differ: ${samples}`);
 assert.deepEqual(errors,[]);
 console.log('Passed: cold refresh on mobile/desktop under 4x CPU slowdown, immediate selection, all frames load, real window pixels differ at every shade, no runtime SVG filter.');
}finally{await browser.close();}
