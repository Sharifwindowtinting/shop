import React, { useEffect, useRef, useState } from 'react';

/** Shared, progressively enhanced feedback for both quote layouts. */
export default function QuoteFeedback({ resetKey }) {
  const feedbackRef = useRef(null);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const form = feedbackRef.current.closest('form');
    const email = form.elements.namedItem('email');
    let emailTouched = false;
    function refresh() {
      const error = emailTouched && !email.validity.valid
        ? (email.validity.valueMissing ? 'Please enter your email so we can reply to your quote.' : 'Enter a complete email address, like you@example.com.')
        : '';
      setEmailError(error);
      email.setAttribute('aria-invalid', String(Boolean(error)));
    }
    function onBlur(event) { if (event.target === email) { emailTouched = true; refresh(); } }
    function onInvalid(event) { if (event.target === email) { emailTouched = true; refresh(); } }
    function onReset() { emailTouched = false; requestAnimationFrame(refresh); }
    email.setAttribute('aria-describedby', 'quote-email-help');
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    form.addEventListener('focusout', onBlur);
    form.addEventListener('invalid', onInvalid, true);
    form.addEventListener('reset', onReset);
    refresh();
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        form.classList.add('quote-entered');
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(form);
    return () => {
      observer.disconnect();
      form.removeEventListener('input', refresh);
      form.removeEventListener('change', refresh);
      form.removeEventListener('focusout', onBlur);
      form.removeEventListener('invalid', onInvalid, true);
      form.removeEventListener('reset', onReset);
    };
  }, [resetKey]);

  return (
    <span id="quote-email-help" className="quote-email-error" ref={feedbackRef} aria-live="polite">{emailError}</span>
  );
}
