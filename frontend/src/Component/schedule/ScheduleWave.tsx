import { useEffect, useId, useRef } from 'react';

export default function ScheduleWave() {
  const id = `schedule-wave-${useId().replace(/:/g, '')}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wave = ref.current;
    if (!wave) return;
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      wave.dataset.animate = String(visible && !document.hidden && !preference?.matches);
    };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (observer) observer.observe(wave);
    // Unsupported browsers retain a static decorative wave.
    update();
    document.addEventListener('visibilitychange', update);
    preference?.addEventListener?.('change', update);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      preference?.removeEventListener?.('change', update);
    };
  }, []);

  return (
    <div ref={ref} className="schedule-wave" aria-hidden="true">
      <svg className="schedule-wave-track" viewBox="0 0 2880 120" preserveAspectRatio="none" focusable="false">
        <defs>
          <g id={id}>
            <path d="M0 64 C120 24 240 24 360 64 S600 104 720 64 S960 24 1080 64 S1320 104 1440 64 V120 H0Z" fill="currentColor" opacity="0.08" />
            <path d="M0 64 C120 24 240 24 360 64 S600 104 720 64 S960 24 1080 64 S1320 104 1440 64" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
            <path d="M0 88 C120 64 240 64 360 88 S600 112 720 88 S960 64 1080 88 S1320 112 1440 88" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </g>
        </defs>
        <use href={`#${id}`} />
        <use href={`#${id}`} x="1440" />
      </svg>
    </div>
  );
}
