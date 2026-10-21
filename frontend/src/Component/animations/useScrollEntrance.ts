import { useEffect, useRef } from 'react';

// One observer per container, and each mounted target reveals only once.
// Content stays visible when observers or motion are unavailable.
export default function useScrollEntrance<T extends HTMLElement>(contentKey = '') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!container || preference?.matches || typeof IntersectionObserver === 'undefined') return;
    const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-entrance]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.entered = 'true';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -16px 0px' });
    targets.forEach((target) => {
      if (target.dataset.entered) return;
      target.dataset.entranceReady = 'true';
      observer.observe(target);
    });
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const target = event.target.closest<HTMLElement>('[data-entrance]');
      if (!target || !container.contains(target)) return;
      target.dataset.entered = 'true';
      observer.unobserve(target);
    };
    container.addEventListener('focusin', revealFocused);
    const revealAll = () => {
      if (!preference?.matches) return;
      targets.forEach((target) => { target.dataset.entered = 'true'; });
      observer.disconnect();
      container.removeEventListener('focusin', revealFocused);
    };
    preference?.addEventListener?.('change', revealAll);
    return () => {
      observer.disconnect();
      container.removeEventListener('focusin', revealFocused);
      preference?.removeEventListener?.('change', revealAll);
      // A filter/day change must not leave detached or retained targets hidden.
      targets.forEach((target) => { delete target.dataset.entranceReady; });
    };
  }, [contentKey]);

  return ref;
}
