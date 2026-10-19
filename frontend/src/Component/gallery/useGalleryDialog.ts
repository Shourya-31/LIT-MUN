import { useEffect, useRef } from 'react';

// The overview can remain open underneath an enlarged photograph. Keep the page
// locked until the last gallery dialog closes, regardless of cleanup order.
let openDialogs = 0;
let previousBodyOverflow = '';

export default function useGalleryDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    if (openDialogs === 0) previousBodyOverflow = document.body.style.overflow;
    openDialogs += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      openDialogs -= 1;
      if (openDialogs === 0) document.body.style.overflow = previousBodyOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return dialogRef;
}
