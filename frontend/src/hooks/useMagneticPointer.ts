import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useMagneticPointer = <T extends HTMLElement>(strength = 0.08) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const moveX = gsap.quickTo(element, 'x', { duration: 0.32, ease: 'power3.out' });
      const moveY = gsap.quickTo(element, 'y', { duration: 0.32, ease: 'power3.out' });
      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = element.getBoundingClientRect();
        moveX((event.clientX - bounds.left - bounds.width / 2) * strength);
        moveY((event.clientY - bounds.top - bounds.height / 2) * strength);
      };
      const resetPosition = () => {
        moveX(0);
        moveY(0);
      };

      element.addEventListener('pointermove', handlePointerMove);
      element.addEventListener('pointerleave', resetPosition);

      return () => {
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerleave', resetPosition);
        gsap.killTweensOf(element);
        gsap.set(element, { clearProps: 'transform' });
      };
    });

    return () => media.revert();
  }, [strength]);

  return elementRef;
};
