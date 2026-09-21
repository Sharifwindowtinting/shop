import React, { useState } from 'react';
import { Check } from 'lucide-react';

const shades = [
  { value: 5, name: 'Very dark' },
  { value: 20, name: 'Dark' },
  { value: 35, name: 'Medium' },
  { value: 50, name: 'Light' },
  { value: 70, name: 'Very light' },
];
export default function TintShadePicker({ value, onChange, onHelp }) {
  const preview = value ?? 35;
  const [loaded, setLoaded] = useState(() => new Set());
  const [failed, setFailed] = useState(() => new Set());
  const displayed = loaded.has(preview) ? preview : 35;
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
        <div className="tint-shade-photo" role="img" aria-label={`Tesla with an illustrative ${preview}% side-window tint preview`} aria-busy={!loaded.has(preview) && !failed.has(preview)}>
          {shades.map(shade => (
            <img
              key={shade.value}
              className={`tint-shade-frame${displayed === shade.value ? ' is-active' : ''}`}
              data-shade={shade.value}
              src={`/assets/tint-shades/tesla-${shade.value}.webp`}
              width="1200" height="800" alt="" aria-hidden="true"
              loading="eager" decoding="async"
              onLoad={() => setLoaded(current => new Set(current).add(shade.value))}
              onError={() => setFailed(current => new Set(current).add(shade.value))}
            />
          ))}
          {!loaded.has(preview) && <span className="tint-image-status" role="status">{failed.has(preview) ? 'Preview unavailable. Your shade choice is still saved.' : 'Loading preview…'}</span>}
          <span className="tint-preview-label">{preview}% <small>Side-window preview</small></span>
        </div>
      </div>
      <div className="tint-preview-footer">
        <p className="tint-shade-selection" role="status">{value === null ? 'Previewing 35%. Choose a shade or let us help.' : `${value}% tint selected for your quote.`}</p>
        <a className="tint-shade-unsure" href="#quote" onClick={() => {
          onChange(null);
          onHelp();
          requestAnimationFrame(() => document.querySelector('#quote select')?.focus({ preventScroll: true }));
        }}>Help me choose</a>
        <p className="tint-shade-note">Lower % means darker glass. Visual guide only; film, existing glass, and lighting affect the result. We’ll confirm suitable shades for your vehicle.</p>
      </div>
    </div>
  );
}
