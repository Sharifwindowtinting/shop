import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import CoverageSelect from './CoverageSelect';
import { packageGroups } from './packageGroups';

const options = packageGroups.find(group => group.key === 'ppf').options;

export default function MobilePpfPackages() {
  const [selected, setSelected] = useState('full-front');
  const option = options.find(item => item.key === selected);
  return (
    <div className="mobile-ppf">
      <p className="intro">Choose your coverage. See which panels are protected.</p>
      <CoverageSelect options={options} value={selected} onChange={setSelected} />
      <article className="mobile-ppf-detail">
        <img className="ppf-coverage-reveal" key={option.visual} src={option.visual} alt={option.alt} width="771" height="323" />
        <div className="mobile-ppf-copy">
          <div className="ppf-details-reveal" key={option.key}>
          <h3>{option.name}</h3>
          <p>{option.title}</p>
          <ul>{option.includes.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
          </div>
          <button className="button dark" type="button" data-service="Paint protection film" data-package={option.name}>Get a PPF quote <ArrowRight size={18} aria-hidden="true" /></button>
          <small className="price-note">{option.quote}</small>
        </div>
      </article>
    </div>
  );
}
