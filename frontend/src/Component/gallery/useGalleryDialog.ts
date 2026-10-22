import { useCallback, useEffect, useRef } from 'react';

// The overview can remain open underneath an enlarged photograph. Keep the page
// locked until the last gallery dialog closes, regardless of cleanup order.
let openDialogs = 0;
let previousBodyOverflow = '';

export default function useGalleryDialog(onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingAnimation = useRef<Animation | null>(null);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || closingAnimation.current) return;
    if (!dialog.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    dialog.dataset.closing = 'true';
    const opacity = window.getComputedStyle(dialog).opacity || '1';
    const animation = dialog.animate([{ opacity }, { opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    closingAnimation.current = animation;
    void animation.finished.then(() => {
      if (closingAnimation.current === animation && dialog.isConnected) onClose();
    }, () => { /* Unmounting cancels an in-progress close. */ });
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    window.dispatchEvent(new Event('litmun:gallery-layer-change'));
    if (openDialogs === 0) previousBodyOverflow = document.body.style.overflow;
    openDialogs += 1;
    document.body.style.overflow = 'hidden';
    if (openDialogs === 1) window.dispatchEvent(new Event('litmun:gallery-open'));

    return () => {
      closingAnimation.current?.cancel();
      closingAnimation.current = null;
      dialog.close();
      window.dispatchEvent(new Event('litmun:gallery-layer-change'));
      openDialogs -= 1;
      if (openDialogs === 0) {
        document.body.style.overflow = previousBodyOverflow;
        window.dispatchEvent(new Event('litmun:gallery-close'));
      }
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return { dialogRef, requestClose };
}
