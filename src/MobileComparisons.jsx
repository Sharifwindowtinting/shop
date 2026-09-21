import React, { useState } from 'react';
import { comparisonItems } from './comparisonItems';

function Comparison({ item }) {
  const [position, setPosition] = useState(50);
  const controlId = `mobile-compare-${item.key}`;

  return (
    <article className="mobile-comparison">
      <h4>{item.eyebrow}</h4>
      <div className="mobile-comparison-image" style={{ '--position': `${position}%` }}>
        <img src={item.after.src} alt={item.after.alt} width="1672" height="941" loading="lazy" />
        <img className="mobile-comparison-before" src={item.before.src} alt={item.before.alt} width="1672" height="941" loading="lazy" />
        <div className="mobile-comparison-divider" aria-hidden="true" />
        <span className="mobile-comparison-label before">Before</span>
        <span className="mobile-comparison-label after">After</span>
      </div>
      <div className="mobile-comparison-control">
        <label htmlFor={controlId}>Slide to compare <span aria-hidden="true">← →</span></label>
        <input
          id={controlId}
          type="range"
          min="0"
          max="100"
          value={position}
          aria-label={`Compare ${item.eyebrow} before and after`}
          aria-valuetext={`${position}% before, ${100 - position}% after`}
          onChange={event => setPosition(Number(event.target.value))}
        />
        <p>{item.title}</p>
      </div>
    </article>
  );
}

export default function MobileComparisons() {
  return (
    <section className="mobile-comparisons" aria-labelledby="mobile-comparisons-heading">
      <div className="eyebrow">SEE THE DIFFERENCE</div>
      <h3 id="mobile-comparisons-heading">Before meets after.</h3>
      <p className="mobile-comparisons-intro">Move each slider to reveal the finish.</p>
      {comparisonItems.map(item => <Comparison key={item.key} item={item} />)}
    </section>
  );
}
