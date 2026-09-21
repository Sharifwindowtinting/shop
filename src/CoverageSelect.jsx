import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function CoverageSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(options.findIndex(option => option.key === value));
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const id = useId();
  const selected = options.find(option => option.key === value);
  useEffect(() => {
    if (!open) return;
    list.current?.focus({ preventScroll: true });
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [active, open, id]);
  function show() { setActive(options.findIndex(option => option.key === value)); setOpen(true); }
  function choose(index) { onChange(options[index].key); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  function onKeyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setActive(event.key === 'Home' ? 0 : options.length - 1); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(active); }
    else if (event.key === 'Tab') setOpen(false);
    else if (event.key.length === 1) {
      const match = options.findIndex((option, index) => index > active && option.name.toLowerCase().startsWith(event.key.toLowerCase()));
      const fallback = options.findIndex(option => option.name.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0 || fallback >= 0) { event.preventDefault(); setActive(match >= 0 ? match : fallback); }
    }
  }
  return (
    <div className="coverage-select" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <span id={`${id}-label`} className="coverage-select-label">Coverage package</span>
      <button id="mobile-ppf-coverage" ref={trigger} type="button" className="coverage-select-trigger" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-labelledby={`${id}-label ${id}-value`} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); show(); } }}>
        <span id={`${id}-value`}>{selected.name}</span><ChevronDown size={18} aria-hidden="true" />
      </button>
      <div className="coverage-select-popup" data-open={open} inert={!open} aria-hidden={!open}>
        <div className="coverage-select-clip">
          <div id={`${id}-list`} ref={list} className="coverage-select-list" role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`} aria-activedescendant={open ? `${id}-${active}` : undefined} onKeyDown={onKeyDown}>
            {options.map((option, index) => (
              <div key={option.key} id={`${id}-${index}`} role="option" aria-selected={value === option.key} className="coverage-select-option" data-active={active === index} onPointerMove={() => setActive(index)} onClick={() => choose(index)}>
                <span>{option.name}</span>{value === option.key && <Check size={17} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
