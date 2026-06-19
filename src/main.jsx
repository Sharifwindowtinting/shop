import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import {
  ArrowRight,
  CalendarCheck,
  Car,
  Check,
  ChevronDown,
  Clock,
  Droplets,
  Gauge,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Phone,
  Shield,
  Sparkles,
  Star,
  Sun,
  X,
} from 'lucide-react';
import './styles.css';

const phoneDisplay = '(916) 690-3999';
const phoneHref = 'tel:+19166903999';
const smsHref = 'sms:+19166903999';
const email = 'info@sharifwindowtinting.com';
const address = '3133 Dwight Rd, Ste 100, Elk Grove, CA 95758';
const googleReviewsHref =
  'https://www.google.com/search?q=sharif+window+tinting#lrd=0x809ac1e4aa0ec785:0x4cb4f14a2f3d1852,1,,,';

const navItems = [
  ['Services', '#services'],
  ['Packages', '#packages'],
  ['Work', '#work'],
  ['Reviews', '#reviews'],
  ['Quote', '#quote'],
];

const services = [
  {
    icon: Sun,
    title: 'Automotive Window Tint',
    label: 'Cars & daily drivers',
    image: '/assets/service-window-tint-install.png',
    summary:
      'Ceramic tint for heat rejection, privacy, glare control, and a cleaner look on Sacramento roads.',
    details: ['Ceramic IR film options', 'Cleaner interior temperatures', 'Factory-style finish'],
  },
  {
    icon: Shield,
    title: 'Paint Protection Film',
    label: 'PPF protection',
    image: '/assets/service-ppf-install.jpg',
    summary:
      'Nearly invisible film that shields high-impact paint from rock chips, scratches, and road debris.',
    details: ['Full front and full body coverage', 'Clean wrapped edges', 'Warranty-backed film options'],
  },
  {
    icon: Gauge,
    title: 'Commercial Window Tint',
    label: 'Offices & storefronts',
    image: '/assets/service-commercial.jpg',
    summary:
      'Professional film for storefronts, office glass, heat reduction, privacy, and a more polished business space.',
    details: ['Solar heat control', 'Privacy and glare reduction', 'Clean commercial finish'],
  },
  {
    icon: Sparkles,
    title: 'Residential Window Tint',
    label: 'Homes & glass doors',
    image: '/assets/service-residential.jpg',
    summary:
      'Comfort-focused home window film that helps reduce heat, glare, fading, and harsh afternoon light.',
    details: ['UV and furniture protection', 'Cooler rooms', 'Daytime privacy options'],
  },
];

const packageGroups = [
  {
    key: 'tint',
    label: 'Window Tint',
    eyebrow: 'Heat, privacy, and UV control',
    visual: '/assets/package-tint-coverage.png',
    alt: 'White sedan diagram showing window tint coverage areas',
    options: [
      {
        key: 'carbon',
        name: 'Carbon Film',
        tag: 'Privacy',
        title: 'A clean factory-style shade for privacy and glare control.',
        coverage: 'carbon',
        visual: '/assets/package-carbon-film-clean.png',
        alt: 'White sedan with carbon window tint installed',
        quote: 'Quote after vehicle review',
        bestFor: 'Clean look, privacy, and budget-conscious tint.',
        includes: ['All side windows', 'Front windshield option', 'Back window', 'Sunroof option'],
        copy:
          'A strong entry point for drivers who want a darker look and a cleaner cabin feel without overcomplicating the build.',
      },
      {
        key: 'ceramic',
        name: 'Ceramic Film',
        tag: 'Comfort',
        title: 'Premium comfort with stronger heat rejection and cleaner clarity.',
        coverage: 'ceramic',
        visual: '/assets/package-ceramic-film-clean.png',
        alt: 'White sedan with ceramic window tint installed',
        quote: 'Quote after vehicle review',
        bestFor: 'Sacramento heat, daily driving, and better cabin comfort.',
        includes: ['All side windows', 'Front windshield option', 'Back window', 'Sunroof option'],
        copy:
          'The balanced choice for Sacramento heat: refined privacy, better interior comfort, UV protection, and a finish that looks intentional.',
      },
      {
        key: 'nano',
        name: 'Nano-Ceramic',
        tag: 'Elite',
        title: 'Highest-performance tint for maximum comfort and clarity.',
        coverage: 'nano',
        visual: '/assets/package-nano-ceramic-clean.png',
        alt: 'White sedan with nano ceramic window tint installed',
        quote: 'Quote after vehicle review',
        bestFor: 'Premium builds, strong IR rejection, and optical clarity.',
        includes: ['All side windows', 'Front windshield option', 'Back window', 'Sunroof option'],
        copy:
          'Built for customers who want the cleanest optical finish, stronger infrared rejection, and a premium cabin feel every day.',
      },
    ],
  },
  {
    key: 'ppf',
    label: 'PPF Packages',
    eyebrow: 'Rock chip and scratch defense',
    visual: '/assets/ppf-packages/partial-hood.png',
    alt: 'Paint protection film coverage diagram',
    options: [
      {
        key: 'partial-hood',
        name: 'Partial Hood',
        tag: 'Starter',
        title: 'Entry-level impact protection for the front hood area.',
        coverage: 'partial-hood',
        visual: '/assets/ppf-packages/partial-hood.png',
        alt: 'Partial hood paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Light commuter protection and focused hood coverage.',
        includes: ['Partial hood', 'Computer-cut film', 'Clean front-edge protection'],
        copy:
          'A simple way to protect the most visible front edge without building a full front-end package.',
      },
      {
        key: 'full-hood',
        name: 'Full Hood',
        tag: 'Hood',
        title: 'Full hood coverage for a cleaner, more complete front finish.',
        coverage: 'full-hood',
        visual: '/assets/ppf-packages/full-hood.png',
        alt: 'Full hood paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Newer vehicles, dark paint, and cleaner hood protection.',
        includes: ['Full hood', 'Wrapped edge options', 'Finish inspection'],
        copy:
          'A stronger hood-focused package for owners who want fewer visible film lines and better long-term finish protection.',
      },
      {
        key: 'partial-front',
        name: 'Partial Front',
        tag: 'Value',
        title: 'Balanced front-end protection for daily road debris.',
        coverage: 'partial-front',
        visual: '/assets/ppf-packages/partial-front.png',
        alt: 'Partial front paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Daily drivers that need bumper plus partial panel coverage.',
        includes: ['Partial hood', 'Partial fenders', 'Full bumper'],
        copy:
          'A practical package for drivers who want protection where road rash happens most often.',
      },
      {
        key: 'partial-front-mirrors',
        name: 'Partial Front + Mirrors',
        tag: 'Popular',
        title: 'Partial front protection with mirror coverage added.',
        coverage: 'partial-front-mirrors',
        visual: '/assets/ppf-packages/partial-front-mirrors.png',
        alt: 'Partial front with mirrors paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Highway driving, daily use, and exposed mirror caps.',
        includes: ['Partial hood', 'Partial fenders', 'Full bumper', 'Mirrors'],
        copy:
          'A smarter daily-driver package when mirror caps and front bumper take regular highway abuse.',
      },
      {
        key: 'full-front',
        name: 'Full Front',
        tag: 'Best seller',
        title: 'The cleanest front-end package for serious protection.',
        coverage: 'full-front',
        visual: '/assets/ppf-packages/full-front.png',
        alt: 'Full front paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Performance cars, luxury builds, and fresh paint preservation.',
        includes: ['Full hood', 'Full fenders', 'Full bumper', 'Mirrors'],
        copy:
          'The go-to package for owners who want full front-end defense with a premium, intentional finish.',
      },
      {
        key: 'full-vehicle',
        name: 'Full Vehicle',
        tag: 'Flagship',
        title: 'Complete exterior protection for long-term ownership.',
        coverage: 'full-vehicle',
        visual: '/assets/ppf-packages/full-vehicle.png',
        alt: 'Full vehicle paint protection film coverage diagram',
        quote: 'Quote after vehicle review',
        bestFor: 'Black paint, luxury vehicles, exotics, and resale value.',
        includes: ['All painted exterior panels', 'High-impact areas', 'Wrapped edge options'],
        copy:
          'Maximum paint preservation for owners who want the whole vehicle protected, not just the front.',
      },
    ],
  },
];

const comparisonItems = [
  {
    key: 'tint',
    eyebrow: 'Window tint',
    title: 'Shade, privacy, and heat control in one clean finish.',
    before: {
      src: '/assets/compare-tint-before.png',
      alt: 'Vehicle side window before tint installation',
      label: 'Before Tint',
      copy: 'Open cabin, more glare, less privacy',
    },
    after: {
      src: '/assets/compare-tint-after.png',
      alt: 'Vehicle side window after tint installation',
      label: 'After Tint',
      copy: 'Darker glass, cleaner look, cooler cabin',
    },
    benefits: [
      ['Privacy', 'Cleaner cabin feel'],
      ['Heat Control', 'Less Sacramento glare'],
      ['UV Defense', 'Interior protection'],
      ['Factory Finish', 'Smooth, matched shade'],
    ],
  },
  {
    key: 'ppf',
    eyebrow: 'Paint protection film',
    title: 'Stop damage before it becomes permanent.',
    before: {
      src: '/assets/compare-ppf-before.png',
      alt: 'Vehicle front fender before paint protection film',
      label: 'Before PPF',
      copy: 'Scratches, chips, and swirl marks',
    },
    after: {
      src: '/assets/compare-ppf-after.png',
      alt: 'Vehicle front fender after paint protection film',
      label: 'After PPF',
      copy: 'Protected gloss with lasting clarity',
    },
    benefits: [
      ['Self-Healing', 'Swirl and scratch resistant'],
      ['UV Protection', 'Helps prevent fading'],
      ['Impact Defense', 'Guards against road debris'],
      ['Long Clarity', 'Gloss that stays cleaner'],
    ],
  },
];

const reviews = [
  {
    source: 'Google',
    date: '3 weeks ago',
    rating: 5,
    name: 'Mike Barnett',
    initials: 'MB',
    quote: 'Wonderful job on our window tinting and outstanding customer service.',
  },
  {
    source: 'Google',
    date: '3 weeks ago',
    rating: 5,
    name: 'Bilal Munir',
    initials: 'BM',
    quote: 'Amazing PPF work, reasonable pricing, and SunTek films.',
  },
  {
    source: 'Google',
    date: 'a month ago',
    rating: 5,
    name: 'Jairo Dimas',
    initials: 'JD',
    quote: 'Polite, punctual, patient team. Ceramic tint keeps the cabin cool.',
  },
  {
    source: 'Google',
    date: 'a month ago',
    rating: 5,
    name: 'Syed Quadri',
    initials: 'SQ',
    quote: 'Ceramic tint looks flawless on the Toyota Tundra.',
  },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Sharif Window Tinting home">
        <img src="/assets/logo.webp" alt="Sharif Window Tinting" />
      </a>
      <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <a key={label} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="icon-link" href={phoneHref} aria-label={`Call Sharif Window Tinting at ${phoneDisplay}`}>
          <Phone size={18} aria-hidden="true" />
          <span>{phoneDisplay}</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero section-pad">
      <div className="hero-bg" aria-hidden="true">
        <video autoPlay muted loop playsInline poster="/assets/gallery-black-car.jpg">
          <source src="/assets/premium-oc-bg.mp4" type="video/mp4" />
          <source src="/assets/hero-ppf-loop.webm" type="video/webm" />
        </video>
        <img src="/assets/gallery-black-car.jpg" alt="" />
        <div className="hero-shine" />
      </div>
      <div className="container hero-shell">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Sacramento & Elk Grove vehicle protection studio</p>
          <h1>Protect. Tint. Shine.</h1>
          <p className="hero-lede">
            Window tint, paint protection film, and ceramic coating installed with clean edges, deep gloss, and daily-driver durability.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#quote">
              Get my quote
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href={phoneHref}>
              <Phone size={18} aria-hidden="true" />
              Call {phoneDisplay}
            </a>
          </div>
        </div>
        <div className="hero-proof" data-reveal aria-label="Sharif Window Tinting highlights">
          <a href="#services">
            <Shield size={18} aria-hidden="true" />
            <span>PPF</span>
          </a>
          <a href="#services">
            <Sun size={18} aria-hidden="true" />
            <span>Window tint</span>
          </a>
          <a href="#services">
            <Droplets size={18} aria-hidden="true" />
            <span>Ceramic coating</span>
          </a>
          <a href="#reviews">
            <Star size={18} aria-hidden="true" />
            <span>5-star local reviews</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="services-section services-board-section">
      <div className="container services-shell">
        <div className="services-board-header" data-reveal>
          <div>
            <p className="eyebrow">Our services</p>
            <h2>Tint, PPF, and flat-glass film installed with a clean shop finish.</h2>
            <p>
              A tighter service lineup for Sacramento drivers, homes, and commercial spaces. Built around heat
              control, privacy, paint protection, and clean edges.
            </p>
          </div>
          <a className="services-quote-link" href="#quote">
            Get a quote
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="services-board">
          <div className="services-board-visual" data-reveal>
            <img src="/assets/services-premium-installation.jpg" alt="Professional window film installation by Sharif Window Tinting" loading="eager" />
            <div className="services-board-overlay">
              <p>Sharif Window Tinting</p>
              <strong>Premium film installation</strong>
              <span>Sacramento & Elk Grove</span>
            </div>
          </div>

          <div className="services-menu">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.title} data-reveal>
                  <div className="service-thumb">
                    <img src={service.image} alt={`${service.title} by Sharif Window Tinting`} loading={index === 0 ? 'eager' : 'lazy'} />
                  </div>
                  <div className="service-body">
                    <div className="service-card-top">
                      <span><Icon size={17} aria-hidden="true" /></span>
                      <p>0{index + 1}</p>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <ul>
                      {service.details.slice(0, 2).map((detail) => (
                        <li key={detail}><Check size={16} aria-hidden="true" />{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="services-spec-strip" data-reveal aria-label="Sharif Window Tinting installation standards">
          <span>Automotive tint</span>
          <span>Paint protection film</span>
          <span>Commercial glass</span>
          <span>Residential film</span>
        </div>
      </div>
    </section>
  );
}

function OfferBanner() {
  return (
    <section id="limited-offer" className="offer-section" aria-label="Limited time Sharif Window Tinting quote offer">
      <a className="offer-banner" href="#quote" data-reveal aria-label="Get a free quote from Sharif Window Tinting">
        <img
          src="/assets/services-premium-banner.png"
          width="1983"
          height="793"
          alt="Limited time offer for Sharif Window Tinting premium tint, paint protection, ceramic coating, and lifetime warranty"
          loading="lazy"
        />
        <span className="offer-cta-cover" aria-hidden="true"></span>
        <span className="offer-live-cta" aria-hidden="true">
          Get my free quote
          <ArrowRight size={22} aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}

function Packages() {
  const [groupKey, setGroupKey] = useState(packageGroups[0].key);
  const activeGroup = packageGroups.find((group) => group.key === groupKey) || packageGroups[0];
  const [optionKey, setOptionKey] = useState(activeGroup.options[0].key);
  const activeOption = activeGroup.options.find((option) => option.key === optionKey) || activeGroup.options[0];
  const typingWords = useMemo(() => activeGroup.options.slice(0, 3).map((option) => option.name), [activeGroup]);
  const typingWidth = useMemo(
    () => Math.max(typingWords.reduce((longest, word) => Math.max(longest, word.length), 0), 10),
    [typingWords],
  );
  const [typedIndex, setTypedIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTypedIndex(0);
    setTypedText('');
    setIsDeleting(false);
  }, [groupKey]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTypedText(typingWords[0] || '');
      return undefined;
    }

    const currentWord = typingWords[typedIndex % typingWords.length] || '';
    const isFullWord = !isDeleting && typedText === currentWord;
    const isEmpty = isDeleting && typedText === '';
    const delay = isFullWord ? 1900 : isEmpty ? 560 : isDeleting ? 78 : 118;

    const timer = window.setTimeout(() => {
      if (isFullWord) {
        setIsDeleting(true);
        return;
      }

      if (isEmpty) {
        setIsDeleting(false);
        setTypedIndex((index) => (index + 1) % typingWords.length);
        return;
      }

      const nextLength = typedText.length + (isDeleting ? -1 : 1);
      setTypedText(currentWord.slice(0, nextLength));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, typedIndex, typedText, typingWords]);

  function selectGroup(nextKey) {
    const nextGroup = packageGroups.find((group) => group.key === nextKey) || packageGroups[0];
    setGroupKey(nextGroup.key);
    setOptionKey(nextGroup.options[0].key);
  }

  const activeVisual = activeOption.visual || activeGroup.visual;
  const activeAlt = activeOption.alt || activeGroup.alt;

  return (
    <section id="packages" className="section-pad package-section">
      <div className="container">
        <div className="section-heading split" data-reveal>
          <div>
            <p className="eyebrow">Package selector</p>
            <h2 className="package-heading">
              <span className="package-heading-static">Build your</span>
              <span
                className="typing-wrap"
                style={{ '--typing-width': `${typingWidth + 1}ch` }}
                aria-live="polite"
                aria-label={typedText || typingWords[0]}
              >
                <span className="typing-text">{typedText || typingWords[0]}</span>
              </span>
            </h2>
          </div>
        </div>
        <div className="package-studio" data-reveal>
          <div className="package-mode-tabs" role="tablist" aria-label="Package type">
            {packageGroups.map((group) => (
              <button
                type="button"
                key={group.key}
                className={group.key === activeGroup.key ? 'is-active' : ''}
                aria-selected={group.key === activeGroup.key}
                onClick={() => selectGroup(group.key)}
              >
                {group.label}
              </button>
            ))}
          </div>
          <div className="package-tabs" role="tablist" aria-label={`${activeGroup.label} options`}>
            {activeGroup.options.map((option) => (
              <button
                type="button"
                key={option.key}
                className={option.key === activeOption.key ? 'is-active' : ''}
                aria-selected={option.key === activeOption.key}
                onClick={() => setOptionKey(option.key)}
              >
                <span>{option.tag}</span>
                {option.name}
              </button>
            ))}
          </div>
          <div className="package-detail">
            <div className={`package-visual package-visual-${activeGroup.key} coverage-${activeOption.coverage}`}>
              <img key={activeVisual} src={activeVisual} alt={activeAlt} loading="lazy" />
            </div>
            <article className="package-copy">
              <p className="package-kicker">{activeGroup.eyebrow}</p>
              <h3>{activeOption.name}</h3>
              <p className="package-title">{activeOption.title}</p>
              <div className="package-meta">
                <div>
                  <span>Best for</span>
                  <strong>{activeOption.bestFor}</strong>
                </div>
                <div>
                  <span>Pricing</span>
                  <strong>{activeOption.quote}</strong>
                </div>
              </div>
              <p className="package-note">{activeOption.copy}</p>
              <ul>
                {activeOption.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="package-actions">
                <a className="button button-primary" href="#quote">
                  Start quote
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="button button-ghost" href={phoneHref}>
                  <Phone size={18} aria-hidden="true" />
                  Call now
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { title: 'Inspect', Icon: Gauge },
    { title: 'Prepare', Icon: Sparkles },
    { title: 'Install', Icon: Droplets },
    { title: 'Deliver', Icon: Shield },
  ];

  return (
    <section className="section-pad process-section" aria-label="Sharif Window Tinting process">
      <div className="process-showcase">
        <div className="process-content" data-reveal>
          <p className="eyebrow">Our process</p>
          <h2>
            <span>Protection</span>
            <span>Without</span>
            <span>Compromise.</span>
          </h2>
          <p>Tint. PPF. Ceramic Coating. Installed with precision.</p>
        </div>
        <div className="process-steps" aria-label="Installation process" data-reveal>
          {steps.map(({ title, Icon }, index) => (
            <div className="process-pill" key={title}>
              <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
              <span>{title}</span>
              {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkGallery() {
  const [sliderPositions, setSliderPositions] = useState(
    comparisonItems.reduce((positions, item) => ({ ...positions, [item.key]: 50 }), {}),
  );

  return (
    <section id="work" className="section-pad comparison-section">
      <div className="container">
        <div className="section-heading split" data-reveal>
          <div>
            <p className="eyebrow">Visible results</p>
            <h2>Slide between before and after.</h2>
          </div>
          <a className="button button-secondary" href={smsHref + '?&body=Hi! I would like a quote from Sharif Window Tinting.'}>
            <MessageSquareText size={18} aria-hidden="true" />
            Text for quote
          </a>
        </div>
        <div className="comparison-grid">
          {comparisonItems.map((item) => (
            <article className="comparison-card" key={item.key} data-reveal>
              <div
                className="comparison-slider"
                style={{ '--split': `${sliderPositions[item.key]}%` }}
              >
                <img className="comparison-image comparison-after" src={item.after.src} alt={item.after.alt} loading="lazy" />
                <div className="comparison-before-wrap">
                  <img className="comparison-image comparison-before" src={item.before.src} alt={item.before.alt} loading="lazy" />
                </div>
                <div className="comparison-copy comparison-copy-before">
                  <strong>{item.before.label}</strong>
                  <span>{item.before.copy}</span>
                </div>
                <div className="comparison-copy comparison-copy-after">
                  <strong>{item.after.label}</strong>
                  <span>{item.after.copy}</span>
                </div>
                <div className="comparison-divider" aria-hidden="true">
                  <span>
                    <ChevronDown size={18} aria-hidden="true" />
                    <ChevronDown size={18} aria-hidden="true" />
                  </span>
                </div>
                <input
                  className="comparison-range"
                  type="range"
                  min="8"
                  max="92"
                  value={sliderPositions[item.key]}
                  aria-label={`Compare ${item.eyebrow} before and after`}
                  onChange={(event) =>
                    setSliderPositions((positions) => ({
                      ...positions,
                      [item.key]: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="comparison-footer">
                <div>
                  <p>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                </div>
                <dl>
                  {item.benefits.map(([label, copy]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{copy}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviewColumns = [
    reviews.slice(0, 2),
    reviews.slice(2),
    [...reviews].reverse(),
  ];

  return (
    <section id="reviews" className="section-pad reviews-section">
      <div className="container">
        <div className="reviews-heading" data-reveal>
          <p className="reviews-badge">Google verified customer proof</p>
          <h2>
            <span>Real customers.</span>
            <span>Real clean installs.</span>
          </h2>
          <div className="reviews-proof-row">
            <a className="reviews-score" href={googleReviewsHref} target="_blank" rel="noreferrer">
              <span>5.0</span>
              <div className="stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" aria-hidden="true" />
              ))}
              </div>
              <small>149 Google reviews</small>
            </a>
            <p className="reviews-intro">
              Trusted locally for tint, PPF, and ceramic protection.
            </p>
          </div>
        </div>

        <div className="testimonial-columns" data-reveal>
          {reviewColumns.map((column, columnIndex) => (
            <div className={`testimonial-column testimonial-column-${columnIndex + 1}`} key={columnIndex}>
              <div className="testimonial-track">
                {[0, 1].map((loop) => (
                  <React.Fragment key={loop}>
                    {column.map((review) => (
                      <a
                        className="testimonial-card"
                        href={googleReviewsHref}
                        target="_blank"
                        rel="noreferrer"
                        key={`${review.name}-${loop}`}
                        aria-label={`Read ${review.name}'s Google review for Sharif Window Tinting`}
                      >
                        <blockquote>{review.quote}</blockquote>
                        <div className="testimonial-person">
                          <span className="review-avatar" aria-hidden="true">{review.initials}</span>
                          <div>
                            <cite>{review.name}</cite>
                            <p>{review.date} on {review.source}</p>
                          </div>
                        </div>
                        <div className="testimonial-footer">
                          <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
                            {Array.from({ length: review.rating }).map((_, index) => (
                              <Star key={index} size={14} fill="currentColor" aria-hidden="true" />
                            ))}
                          </div>
                          <span>Google review</span>
                        </div>
                      </a>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    services: 'Tint + PPF + Ceramic Coating',
    message: '',
    _honey: '',
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatusType('pending');
    setStatus('Sending your quote request...');

    try {
      const contact = [form.phone, form.email].filter(Boolean).join(' / ');
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          contact,
          vehicle: form.vehicle,
          services: form.services,
          message: form.message,
          honey: form._honey,
          page: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Resend did not accept the request.');
      }

      setForm({
        name: '',
        phone: '',
        email: '',
        vehicle: '',
        services: 'Tint + PPF + Ceramic Coating',
        message: '',
        _honey: '',
      });
      setStatusType('success');
      setStatus('Request sent. Sharif Window Tinting will follow up shortly.');
    } catch (error) {
      setStatusType('error');
      setStatus(`We could not send the form automatically. Please call ${phoneDisplay} or email ${email}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="quote" className="section-pad quote-section">
      <div className="container quote-layout">
        <div className="quote-copy" data-reveal>
          <p className="eyebrow">Free local quote</p>
          <h2>Tell us what you drive and what you want protected.</h2>
          <p>
            Most quotes are answered within one business day. For the fastest answer, include your vehicle year, make,
            model, and whether you want tint, PPF, ceramic coating, or a complete protection plan.
          </p>
          <div className="contact-list">
            <a href={phoneHref}><Phone size={18} /> {phoneDisplay}</a>
            <a href={`mailto:${email}`}><Mail size={18} /> {email}</a>
            <a href="https://maps.google.com/?q=3133%20Dwight%20Rd%20Ste%20100%20Elk%20Grove%20CA%2095758"><MapPin size={18} /> {address}</a>
            <span><Clock size={18} /> Mon-Sat 9:00-5:30, Sun 9:00-1:00</span>
          </div>
        </div>
        <form
          className="quote-form"
          action="/api/lead"
          method="POST"
          onSubmit={handleSubmit}
          data-reveal
        >
          <label className="quote-honeypot" aria-hidden="true">
            Website
            <input name="_honey" value={form._honey} onChange={updateField} tabIndex="-1" autoComplete="off" />
          </label>
          <div className="field-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={updateField} autoComplete="name" required />
            </label>
            <label>
              Phone
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                autoComplete="tel"
                placeholder="(916) 555-0199"
                required
              />
            </label>
          </div>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Vehicle
            <input name="vehicle" value={form.vehicle} onChange={updateField} placeholder="2024 Tesla Model Y" required />
          </label>
          <label>
            Service interest
            <select name="services" value={form.services} onChange={updateField}>
              <option>Tint + PPF + Ceramic Coating</option>
              <option>Window Tint</option>
              <option>Paint Protection Film</option>
              <option>Ceramic Coating</option>
              <option>PPF + Ceramic Coating</option>
            </select>
          </label>
          <label>
            Notes
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              rows="4"
              placeholder="Coverage goals, color/tint preference, timeline, or photos you plan to send."
            />
          </label>
          <button className="button button-primary full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending request...' : 'Send quote request'}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          {status && <p className={`form-status ${statusType}`} role="status">{status}</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/assets/logo.webp" alt="Sharif Window Tinting" />
          <p>Window tint, paint protection film, and ceramic coating for Sacramento and Elk Grove drivers.</p>
          <div className="footer-actions">
            <a href={phoneHref}>Call {phoneDisplay}</a>
            <a href={smsHref}>Text us</a>
          </div>
        </div>
        <nav aria-label="Footer pages">
          <h2>Pages</h2>
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#work">Before & After</a>
          <a href="#reviews">Reviews</a>
          <a href="#quote">Get a Quote</a>
        </nav>
        <nav aria-label="Footer services">
          <h2>Services</h2>
          <a href="#packages">Automotive Tint</a>
          <a href="#packages">Paint Protection Film</a>
          <a href="#services">Commercial Tint</a>
          <a href="#services">Residential Tint</a>
        </nav>
        <div className="footer-contact">
          <h2>Contact</h2>
          <a href={phoneHref}>
            <Phone size={16} aria-hidden="true" />
            {phoneDisplay}
          </a>
          <a href={`mailto:${email}`}>
            <Mail size={16} aria-hidden="true" />
            {email}
          </a>
          <a href="https://maps.google.com/?q=3133%20Dwight%20Rd%20Ste%20100%20Elk%20Grove%20CA%2095758" target="_blank" rel="noreferrer">
            <MapPin size={16} aria-hidden="true" />
            {address}
          </a>
          <p>
            <Clock size={16} aria-hidden="true" />
            Mon-Sat 9:00 am - 5:30 pm<br />Sun 9:00 am - 1:00 pm
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Copyright 2026 Sharif Window Tinting. All rights reserved.</span>
        <nav aria-label="Footer legal links">
          <a href="/warranty-care.html">Warranty & Care</a>
          <a href="/privacy-policy.html">Privacy Policy</a>
          <a href="/terms.html">Terms</a>
        </nav>
      </div>
    </footer>
  );
}

function App() {
  useReveal();

  return (
    <>
      <a className="skip-link" href="#quote">Skip to quote form</a>
      <Header />
      <main>
        <Hero />
        <Services />
        <OfferBanner />
        <Packages />
        <Process />
        <WorkGallery />
        <Reviews />
        <QuoteForm />
      </main>
      <Footer />
      <a className="floating-call" href={phoneHref} aria-label={`Call Sharif Window Tinting at ${phoneDisplay}`}>
        <Phone size={20} aria-hidden="true" />
      </a>
      <Analytics />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
