const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');}
menu.addEventListener('click',()=>{nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));menu.setAttribute('aria-label',nav.hidden?'Open menu':'Close menu');});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden){closeMenu();menu.focus();}});
const service=document.querySelector('#service');
let selectedPackage='';
function updateService(){const property=service.value==='Home & commercial tint';document.querySelector('#project-label').textContent=property?'Tell us about your space':'Your vehicle';document.querySelector('#project').placeholder=property?'e.g. Home with west-facing windows':'e.g. 2024 Tesla Model 3';document.querySelector('#package-selection').hidden=!selectedPackage;document.querySelector('#package-selection').textContent=selectedPackage?`Selected film: ${selectedPackage}`:'';document.querySelector('#form-result').hidden=true;}
service.addEventListener('change',()=>{selectedPackage='';updateService();});
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{service.value=button.dataset.service;selectedPackage=button.dataset.package||'';updateService();document.querySelector('#quote').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});service.focus({preventScroll:true});}));
document.querySelector('#quote-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const result=document.querySelector('#form-result');result.textContent=`Thanks, ${data.get('name')}! Your preview: ${selectedPackage||data.get('service')} for ${data.get('project')}. Preferred phone: ${data.get('phone')}. Nothing has been sent. To request a real quote, call (916) 690-3999.`;result.hidden=false;});

const heroVideo = document.querySelector('#hero-video');
const videoToggle = document.querySelector('.video-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateVideoToggle() {
  videoToggle.textContent = heroVideo.paused ? 'Play' : 'Pause';
  videoToggle.setAttribute('aria-label', heroVideo.paused ? 'Play hero video' : 'Pause hero video');
}
heroVideo.addEventListener('play', updateVideoToggle);
heroVideo.addEventListener('pause', updateVideoToggle);
videoToggle.addEventListener('click', () => {
  if (heroVideo.paused) heroVideo.play().catch(updateVideoToggle);
  else heroVideo.pause();
});
function respectMotionPreference() {
  if (reducedMotion.matches) {
    heroVideo.autoplay = false;
    heroVideo.pause();
  }
  updateVideoToggle();
}
reducedMotion.addEventListener('change', respectMotionPreference);
respectMotionPreference();
