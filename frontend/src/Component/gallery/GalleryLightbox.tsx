import { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import type { GalleryImage } from './types';
import useGalleryDialog from './useGalleryDialog';

interface GalleryLightboxProps {
  images: readonly GalleryImage[];
  imageId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function LightboxPhoto({ image, direction }: { image: GalleryImage; direction: number }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <div className="gallery-lightbox-photo" data-ready={!loading} data-direction={direction < 0 ? 'previous' : 'next'}>
      {failed ? <div className="gallery-photo-error" role="status"><ImageOff size={38} aria-hidden="true" /><p>This photograph could not be loaded.</p><span>You can still browse the rest of the gallery.</span></div> : <>
        {loading && <span className="gallery-loading" role="status">Loading photograph…</span>}
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" onLoad={() => setLoading(false)} onError={() => { setFailed(true); setLoading(false); }} />
      </>}
    </div>
  );
}

export default function GalleryLightbox({ images, imageId, onSelect, onClose }: GalleryLightboxProps) {
  const { dialogRef, requestClose } = useGalleryDialog(onClose);
  const [direction, setDirection] = useState(1);
  const uid = useId();
  const index = images.findIndex((image) => image.id === imageId);
  const image = images[index];

  if (!image) return null;
  const move = (step: number) => {
    if (dialogRef.current?.dataset.closing === 'true') return;
    setDirection(step);
    onSelect(images[(index + step + images.length) % images.length].id);
  };

  return createPortal(
    <dialog ref={dialogRef} className="gallery-lightbox" data-lenis-prevent aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-caption`}
      onCancel={(event) => { event.preventDefault(); requestClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}
      onKeyDown={(event) => {
        if (images.length < 2) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
      }}>
      <div className="gallery-lightbox-header">
        <div><p id={`${uid}-title`}>LIT-MUN <span>Gallery</span></p><span className="gallery-lightbox-count" role="status" aria-live="polite" aria-atomic="true">Photograph {index + 1} of {images.length}</span></div>
        <button type="button" className="gallery-lightbox-close" onClick={requestClose} aria-label="Close gallery"><X size={24} aria-hidden="true" /></button>
      </div>
      <div className="gallery-lightbox-stage">
        <button type="button" className="gallery-lightbox-arrow" disabled={images.length < 2} onClick={() => move(-1)} aria-label="Previous photograph"><ChevronLeft size={28} aria-hidden="true" /></button>
        <figure className="gallery-lightbox-figure">
          <LightboxPhoto key={`${image.id}-${image.src}`} image={image} direction={direction} />
          <figcaption key={image.id} id={`${uid}-caption`} className="gallery-lightbox-caption"><p>{image.caption || image.alt}</p>{(image.category || image.year) && <span>{[image.category, image.year].filter(Boolean).join(' · ')}</span>}</figcaption>
        </figure>
        <button type="button" className="gallery-lightbox-arrow" disabled={images.length < 2} onClick={() => move(1)} aria-label="Next photograph"><ChevronRight size={28} aria-hidden="true" /></button>
      </div>
      <p className="gallery-lightbox-hint">Use the arrow keys to explore <span aria-hidden="true">·</span> Esc to close</p>
    </dialog>, document.body,
  );
}
