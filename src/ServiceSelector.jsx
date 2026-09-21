import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const services = [
  {
    name: 'Window tint',
    headline: 'Comfort you can feel.',
    description: 'Less heat and glare. More privacy. Find the right film and shade for your everyday drive.',
    image: '/assets/service-window-tint-install.png',
    alt: 'Precision installation of window tint on a vehicle',
    detail: 'Carbon · Ceramic · IR nano ceramic',
  },
  {
    name: 'Paint protection film',
    headline: 'Keep that new-car feeling.',
    description: 'A clear barrier against rock chips and road wear, from the front bumper to the full body.',
    image: '/assets/service-ppf-install.jpg',
    alt: 'Clear paint protection film being fitted to a car',
    detail: 'Targeted panels · Full front · Full body',
  },
  {
    name: 'Ceramic coating',
    headline: 'More shine. Less upkeep.',
    description: 'A glossy, water-repellent finish that makes washing easier and helps your paint stay looking its best.',
    image: '/assets/service-ceramic-coating.jpg',
    alt: 'Glossy graphite sports car with crisp reflections and water beading on the hood',
    detail: 'Deep gloss · Water repellency · Easy care',
  },
];

export default function ServiceSelector({ onSelect }) {
  function choose(service) {
    onSelect(service);
    requestAnimationFrame(() => document.querySelector('#quote select')?.focus({ preventScroll: true }));
  }

  return (
    <section id="services" className="service-editorial" aria-labelledby="services-heading">
      <div className="service-editorial-inner">
        <div className="service-editorial-heading">
          <div>
            <p className="service-editorial-eyebrow">THE RIGHT FINISH FOR YOUR EVERYDAY</p>
            <h2 id="services-heading">Made for the way<br />you drive.</h2>
          </div>
          <p>From a cooler commute to a finish worth protecting.<br />Explore what we can do for your car.</p>
        </div>
        <div className="service-editorial-grid">
          {services.map(service => (
            <a className="service-story" href="#quote" key={service.name} onClick={() => choose(service.name)} aria-label={`Get a quote for ${service.name}`}>
              <div className="service-story-image">
                <img src={service.image} alt={service.alt} width="1200" height="900" loading="lazy" />
                <span className="service-story-arrow" aria-hidden="true"><ArrowUpRight size={23} /></span>
              </div>
              <div className="service-story-copy">
                <p className="service-story-name">{service.name}</p>
                <h3>{service.headline}</h3>
                <p className="service-story-description">{service.description}</p>
                <p className="service-story-detail">{service.detail}</p>
                <span className="service-story-link">Get a quote <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </a>
          ))}
        </div>
        <a className="service-spaces" href="#quote" onClick={() => choose('Home & commercial tint')}>
          <img src="/assets/service-residential.jpg" alt="Light-filled living space with large windows" width="1200" height="816" loading="lazy" />
          <div><p>BEYOND THE DRIVEWAY</p><h3>Better comfort, at home and at work.</h3><span>Window film for sun-facing rooms, offices, and storefronts.</span></div>
          <span className="service-spaces-link">Home & business tint <ArrowUpRight size={20} aria-hidden="true" /></span>
        </a>
      </div>
    </section>
  );
}
