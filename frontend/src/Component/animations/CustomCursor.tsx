import { useEffect, useRef } from 'react';
import './CustomCursor.css';

const TEXT_INPUT_SELECTOR = 'textarea, [contenteditable="true"], input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"])';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

    if (!cursor || !media.matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        cursor.classList.remove('custom-cursor--visible');
        return;
      }

      const target = event.target;
      const element = target instanceof Element ? target : null;
      const isTextInput = Boolean(element?.closest(TEXT_INPUT_SELECTOR));
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.classList.toggle('custom-cursor--visible', !isTextInput);
    };

    const handlePointerLeave = () => cursor.classList.remove('custom-cursor--visible');

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} aria-hidden="true" className="custom-cursor">
      <span className="custom-cursor__glint custom-cursor__glint--near" />
      <span className="custom-cursor__glint custom-cursor__glint--middle" />
      <span className="custom-cursor__glint custom-cursor__glint--far" />
    </div>
  );
};

export default CustomCursor;
