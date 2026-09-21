import React, { useEffect, useRef, useState } from 'react';
import QuoteFeedback from './QuoteFeedback';
import MobileComparisons from './MobileComparisons';

export default function MobileSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState('Window tint');
  const [film, setFilm] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) videoRef.current?.pause();
    };
    const escape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); menuRef.current?.focus(); }
    };
    media.addEventListener('change', update);
    document.addEventListener('keydown', escape);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('keydown', escape);
      requestRef.current?.abort();
    };
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  function handleServiceClick(event) {
    const button = event.target.closest('[data-service]');
    if (!button) return;
    setService(button.dataset.service);
    setFilm(button.dataset.package || '');
    document.querySelector('#quote').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    document.querySelector('#service').focus({ preventScroll: true });
  }

  async function submitQuote(event) {
    event.preventDefault();
    if (requestRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!String(data.get('name')).trim() || !String(data.get('vehicle')).trim() || String(data.get('phone')).replace(/\D/g, '').length < 7) {
      setStatus({type: 'error', message: 'Please enter your name, vehicle or property details, and a valid phone number.'});
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setSending(true);
    setStatus(null);
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          ...Object.fromEntries(data),
          services: service,
          message: [film && `Selected film: ${film}`, data.get('message')].filter(Boolean).join('\n'),
          contact: [data.get('phone'), data.get('email')].filter(Boolean).join(' / '),
          page: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('Request not accepted');
      form.reset();
      setFilm('');
      setStatus({type: 'success', message: 'Request sent. Sharif Window Tinting will follow up shortly.'});
    } catch (error) {
      setStatus({type: 'error', message: error.name === 'AbortError' ? 'Your request timed out. Your details are still here; please try again or call us.' : 'We couldn’t send your request. Your details are still here; please try again or call us.'});
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      setSending(false);
    }
  }

  return (<>

<svg className="icons" xmlns="http://www.w3.org/2000/svg">
<symbol id="arrow" viewBox="0 0 24 24">
<path d="M5 12h14m-6-6 6 6-6 6"/>
</symbol>
<symbol id="phone" viewBox="0 0 24 24">
<path d="m5 3 4 1 1 5-3 2c2 3 3 4 6 6l2-3 5 1 1 4c-1 5-9 1-13-3S0 4 5 3Z"/>
</symbol>
<symbol id="pin" viewBox="0 0 24 24">
<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/>
<circle cx="12" cy="10" r="2"/>
</symbol>
<symbol id="shield" viewBox="0 0 24 24">
<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/>
<path d="m8 12 3 3 5-6"/>
</symbol>
<symbol id="sun" viewBox="0 0 24 24">
<circle cx="12" cy="12" r="4"/>
<path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>
</symbol>
</svg>

<div id="top" className="site" onClick={handleServiceClick}>
<a className="skip" href="#main">Skip to content</a>
<header>
<a href="#top" aria-label="Sharif home">
<img src="/assets/logo.webp" width="1046" height="400" alt="Sharif Window Tinting" />
</a>
<div className="header-actions">
<a className="icon-button" href="tel:+19166903999" aria-label="Call Sharif">
<svg>
<use href="#phone"/>
</svg>
</a>
<button className="icon-button menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} ref={menuRef} aria-controls="navigation">
<span>
</span>
<span>
</span>
</button>
</div>
</header>
<nav id="navigation" aria-label="Primary navigation" hidden={!menuOpen} onClick={() => setMenuOpen(false)}>
<a href="#services">Our services</a>
<a href="#packages">Tint packages</a>
<a href="#work">Our work</a>
<a href="#visit">Visit the shop</a>
<a href="#quote">Get a quote <svg>
<use href="#arrow"/>
</svg>
</a>
</nav>
<main id="main">
<section className="hero">
<div className="location">
<span>
</span> ELK GROVE · SACRAMENTO</div>
<h1>Less heat.<br />More <em>style.</em>
</h1>
<p>Premium window tint & paint protection.<br />Made for your car. Built for California.</p>
<a className="button primary" href="#quote">Find my perfect tint <svg>
<use href="#arrow"/>
</svg>
</a>
<div className="hero-image">
<video id="hero-video" ref={videoRef} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} autoPlay={!reducedMotion} muted loop playsInline preload="metadata" poster="/assets/gallery-black-car.jpg" aria-label="Sharif automotive protection showcase">
<source src="/assets/premium-oc-bg.mp4" type="video/mp4" />
<source src="/assets/hero-ppf-loop.webm" type="video/webm" />
</video>
<button className="video-toggle" type="button" aria-controls="hero-video" aria-label={playing ? "Pause hero video" : "Play hero video"} onClick={toggleVideo}>{playing ? "Pause" : "Play"}</button>
<span className="image-caption">THE DETAILS MAKE THE DIFFERENCE.</span>
<span className="image-number">01 / SHARIF</span>
</div>
<a className="trust" href="https://www.google.com/search?q=sharif+window+tinting#lrd=0x809ac1e4aa0ec785:0x4cb4f14a2f3d1852,1,,," target="_blank" rel="noreferrer">
<span className="google">G</span>
<div>
<strong>5.0 <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
</strong>
<small>149 Google reviews</small>
</div>
<span className="trust-note">Local work.<br />Lasting impressions.</span>
<svg>
<use href="#arrow"/>
</svg>
</a>
</section>
<section className="section services" id="services">
<div className="eyebrow">YOUR CAR. YOUR WAY.</div>
<h2>What can we<br />help you protect?</h2>
<div className="service-list">
<button data-service="Window tint">
<span className="service-icon">
<svg>
<use href="#sun"/>
</svg>
</span>
<span>
<strong>Window tint</strong>
<small>Cooler drives. A cleaner look.</small>
</span>
<svg>
<use href="#arrow"/>
</svg>
</button>
<button data-service="Paint protection film">
<span className="service-icon">
<svg>
<use href="#shield"/>
</svg>
</span>
<span>
<strong>Paint protection film</strong>
<small>Keep the road off your paint.</small>
</span>
<svg>
<use href="#arrow"/>
</svg>
</button>
<button data-service="Home & commercial tint">
<span className="service-icon">
<svg>
<use href="#pin"/>
</svg>
</span>
<span>
<strong>Home & commercial</strong>
<small>Better comfort, beyond your car.</small>
</span>
<svg>
<use href="#arrow"/>
</svg>
</button>
</div>
</section>
<section className="section packages" id="packages">
<div className="section-title">
<div>
<div className="eyebrow">FIND YOUR FIT</div>
<h2>A shade above.</h2>
</div>
<span className="section-number">02</span>
</div>
<p className="intro">Choose your comfort level. We’ll help with the shade.</p>
<article className="featured">
<div className="featured-heading">
<span>CERAMIC FILM</span>
<span className="pill">FOR DAILY DRIVES</span>
</div>
<h3>Cool, calm.<br />Comfortably yours.</h3>
<img src="/assets/package-ceramic-film-clean.png" width="1536" height="1024" alt="Side view of a white sedan with ceramic tinted windows" loading="lazy" />
<div className="benefits">
<span>Heat rejection</span>
<span>UV protection</span>
<span>Clear views</span>
</div>
<p>Comfort-focused tint for Sacramento heat, with refined privacy and a clean finish.</p>
<button className="button dark" data-service="Window tint" data-package="Ceramic Film">Get a ceramic tint quote <svg>
<use href="#arrow"/>
</svg>
</button>
<small className="price-note">Personalized pricing for your vehicle.</small>
</article>
<details>
<summary>
<span>
<strong>Carbon Film</strong>
<small>Privacy & everyday style</small>
</span>
<span className="plus">+</span>
</summary>
<p>A clean, darker look with privacy and glare control. A practical starting point for your tint.</p>
<button className="text-button" data-service="Window tint" data-package="Carbon Film">Ask about carbon <svg>
<use href="#arrow"/>
</svg>
</button>
</details>
<details>
<summary>
<span>
<strong>IR Nano Ceramic</strong>
<small>Premium comfort & clarity</small>
</span>
<span className="plus">+</span>
</summary>
<p>Our premium tint option for infrared heat rejection and optical clarity. We’ll help you compare films for your vehicle.</p>
<button className="text-button" data-service="Window tint" data-package="IR Nano Ceramic">Explore nano ceramic <svg>
<use href="#arrow"/>
</svg>
</button>
</details>
</section>
<section className="work section" id="work">
<div className="eyebrow">UP CLOSE. NO SHORTCUTS.</div>
<h2>Good work speaks<br />for itself.</h2>
<div className="work-grid">
<figure>
<img src="/assets/service-window-tint-install.png" width="1080" height="810" alt="Window film installation in progress" loading="lazy" />
<figcaption>Precision in every edge.</figcaption>
</figure>
<figure>
<img src="/assets/service-ppf-install.jpg" width="1800" height="1192" alt="Paint protection film being fitted to a vehicle" loading="lazy" />
<figcaption>Protection you can see.</figcaption>
</figure>
</div>
<MobileComparisons />
<blockquote id="reviews">
<span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
<p>“Wonderful job on our window tinting and outstanding customer service.”</p>
<footer>
<span className="avatar">MB</span>
<span>
<strong>Mike Barnett</strong>
<small>Google review</small>
</span>
</footer>
</blockquote>
</section>
<section className="section quote" id="quote">
<div className="eyebrow">LET’S MAKE IT YOURS</div>
<h2>Your next upgrade<br />starts here.</h2>
<p className="intro">Tell us a little about what you need.</p>
<form id="quote-form" onSubmit={submitQuote} aria-busy={sending}>

<label>What are you interested in?<select id="service" name="services" value={service} onChange={event => {setService(event.target.value);setFilm('');}}>
<option>Window tint</option>
<option>Paint protection film</option>
<option>Ceramic coating</option>
<option>Home &amp; commercial tint</option>
</select>
</label>
{film && <p id="package-selection">Selected film: {film}</p>}
<label>{service === 'Home & commercial tint' ? 'Tell us about your space' : 'Your vehicle'}<input name="vehicle" required maxLength={180} placeholder={service === 'Home & commercial tint' ? 'e.g. Home with west-facing windows' : 'e.g. 2024 Tesla Model 3'} />
</label>
<div className="form-pair">
<label>Your name<input name="name" autoComplete="name" required maxLength={160} placeholder="First name" />
</label>
<label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(916) 555-0123" />
</label>
</div>
<label>Email<input name="email" type="email" pattern={String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`} required inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" maxLength={160} placeholder="you@example.com" />
<QuoteFeedback resetKey={status?.type === 'success'} />
</label>
<label>Anything else? (optional)<textarea name="message" maxLength={1800} rows={3} placeholder="Shade, coverage, or timing you have in mind" />
</label>
<label className="honeypot" aria-hidden="true">Website<input name="honey" tabIndex={-1} autoComplete="off" />
</label>
<button className="button primary" type="submit" disabled={sending}>{sending ? 'Sending your request…' : 'Send my quote request'} <svg>
<use href="#arrow"/>
</svg>
</button>
<p className="form-note">We’ll contact you about your quote. <a href="/privacy-policy.html">Privacy policy</a>
</p>
{status && <div id="form-result" className={status.type} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}{status.type === 'error' && <> <a href="tel:+19166903999">Call (916) 690-3999</a>
</>}</div>}
</form>
</section>
<section className="section visit" id="visit">
<div className="eyebrow">YOUR LOCAL TINT SHOP</div>
<h2>See you in Elk Grove.</h2>
<p>3133 Dwight Rd, Ste 100<br />Elk Grove, CA 95758</p>
<a className="text-button" href="https://www.google.com/maps/search/?api=1&query=Sharif+Window+Tinting+3133+Dwight+Rd+Elk+Grove" target="_blank" rel="noreferrer">Get directions <svg>
<use href="#arrow"/>
</svg>
</a>
<a className="visit-phone" href="tel:+19166903999">(916) 690-3999</a>
</section>
</main>
<footer className="site-footer">
<img src="/assets/logo.webp" width="1046" height="400" alt="Sharif Window Tinting" />
<p>Better comfort. Lasting protection.</p>
<small>© {new Date().getFullYear()} Sharif Window Tinting</small>
<nav className="legal-links" aria-label="Legal">
<a href="/warranty-care.html">Warranty &amp; care</a>
<a href="/privacy-policy.html">Privacy</a>
<a href="/terms.html">Terms</a>
</nav>
</footer>
<div className="bottom-bar">
<a className="call" href="tel:+19166903999">
<svg>
<use href="#phone"/>
</svg> Call shop</a>
<a className="button primary" href="#quote">Get my quote <svg>
<use href="#arrow"/>
</svg>
</a>
</div>
</div>
</>);
}
