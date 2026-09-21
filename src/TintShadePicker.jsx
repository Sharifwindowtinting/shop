import React, { useId } from 'react';
import { Check } from 'lucide-react';
import useAnimatedValue from './useAnimatedValue';

const shades = [
  { value: 5, name: 'Very dark' },
  { value: 20, name: 'Dark' },
  { value: 35, name: 'Medium' },
  { value: 50, name: 'Light' },
  { value: 70, name: 'Very light' },
];
const carImage = '/assets/tesla-tint-clear.jpg';
// Window contours follow the 1536 × 1024 source; bodywork and mirrors stay unchanged.
const windows = 'M229 340 C303 295 394 273 471 269 L449 391 L263 376 Q225 370 229 340 Z M489 269 C595 264 673 300 743 380 L749 406 L728 405 C725 381 708 363 681 367 C650 368 635 379 630 400 L480 393 Z';

export default function TintShadePicker({ value, onChange }) {
  const id = useId().replaceAll(':', '');
  const preview = value ?? 35;
  // Attenuate light in linear RGB instead of painting black over sRGB pixels.
  // The reflection stays visible as cabin detail recedes into the darker glass.
  const transmission = useAnimatedValue(Math.pow(preview / 70, 1.35));
  return (
    <div className="tint-shade-picker">
      <div className="tesla-tint-stage">
        <fieldset className="tint-shade-controls">
          <legend>Tint %</legend>
          <div className="tint-shade-options">
            {shades.map(shade => (
              <label className="tint-shade-option" key={shade.value}>
                <input type="radio" name="tint-shade" value={shade.value} checked={value === shade.value} onChange={() => onChange(shade.value)} />
                <span className="tint-shade-option-content"><strong>{shade.value}%</strong><span>{shade.name}</span>{value === shade.value && <Check size={12} aria-hidden="true" />}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="tint-shade-photo">
          <img src={carImage} width="1536" height="1024" alt={`Tesla with an illustrative ${preview}% side-window tint preview`} loading="lazy" />
          <svg viewBox="0 0 1536 1024" aria-hidden="true">
            <defs>
              <clipPath id={`${id}-windows`}><path d={windows} /></clipPath>
              <filter id={`${id}-glass`} colorInterpolationFilters="linearRGB">
                <feComponentTransfer>
                  <feFuncR type="linear" slope={transmission} intercept="0.0015" />
                  <feFuncG type="linear" slope={transmission} intercept="0.0017" />
                  <feFuncB type="linear" slope={transmission} intercept="0.002" />
                </feComponentTransfer>
              </filter>
              <linearGradient id={`${id}-reflection`} x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0" stopColor="#d9e5ee" stopOpacity="0.1" />
                <stop offset="0.45" stopColor="#bacbd8" stopOpacity="0.045" />
                <stop offset="1" stopColor="#9eafbd" stopOpacity="0.005" />
              </linearGradient>
            </defs>
            <g clipPath={`url(#${id}-windows)`}>
              <image href={carImage} width="1536" height="1024" filter={`url(#${id}-glass)`} />
              <path className="tint-glass-reflection" d={windows} fill={`url(#${id}-reflection)`} />
            </g>
          </svg>
          <span className="tint-preview-label">{preview}% <small>Side-window preview</small></span>
        </div>
      </div>
      <div className="tint-preview-footer">
        <p className="tint-shade-selection" role="status">{value === null ? 'Previewing 35%. Choose a shade or let us help.' : `${value}% tint selected for your quote.`}</p>
        <button className="tint-shade-unsure" type="button" onClick={() => onChange(null)} aria-pressed={value === null}>Help me choose</button>
        <p className="tint-shade-note">Lower % means darker glass. Visual guide only; film, existing glass, and lighting affect the result. We’ll confirm suitable shades for your vehicle.</p>
      </div>
    </div>
  );
}
