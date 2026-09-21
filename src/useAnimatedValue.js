import { useEffect, useRef, useState } from 'react';

// Retarget from the current frame so rapid choices never queue animations.
export default function useAnimatedValue(target, duration = 240) {
  const current = useRef(target);
  const [value, setValue] = useState(target);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const startValue = current.current;
    const started = performance.now();
    const update = next => { current.current = next; setValue(next); };
    const finish = () => {
      if (media.matches) { cancelAnimationFrame(frame); update(target); }
    };
    const tick = now => {
      const progress = Math.max(0, Math.min((now - started) / duration, 1));
      const eased = 1 - Math.pow(1 - progress, 3);
      update(startValue + (target - startValue) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    if (media.matches || startValue === target) update(target);
    else frame = requestAnimationFrame(tick);
    media.addEventListener('change', finish);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', finish); };
  }, [target, duration]);
  return value;
}
