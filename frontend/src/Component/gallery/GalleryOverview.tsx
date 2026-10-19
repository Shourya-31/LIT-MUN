import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ImageOff, Maximize2, X } from 'lucide-react';
import useGalleryDialog from './useGalleryDialog';
import type { GalleryImage } from './types';

interface GalleryOverviewProps {
  images: readonly GalleryImage[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function OverviewPhoto({ image, index, selected, onSelect }: {
  image: GalleryImage;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <li style={{ '--gallery-delay': `${Math.min(index, 5) * 30}ms` } as CSSProperties}>
      <button type="button" className="gallery-overview-tile" aria-current={selected ? 'true' : undefined}
        aria-label={`Expand photograph: ${image.caption || image.alt}`} aria-haspopup="dialog" onClick={() => onSelect(image.id)}>
        <span className="gallery-overview-image">
          {failed ? <span className="gallery-overview-error"><ImageOff size={28} aria-hidden="true" />Photograph unavailable</span> : (
            <img src={image.thumbnailSrc || image.src} srcSet={image.thumbnailSrcSet}
              sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw"
              alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" onError={() => setFailed(true)} />
          )}
          <span className="gallery-overview-expand"><Maximize2 size={17} aria-hidden="true" /></span>
        </span>
        <span className="gallery-overview-category">{image.category || 'LIT-MUN'}</span>
        <span className="gallery-overview-caption">{image.caption || image.alt}</span>
      </button>
    </li>
  );
}

export default function GalleryOverview({ images, selectedId, onSelect, onClose }: GalleryOverviewProps) {
  const uid = useId();
  const dialogRef = useGalleryDialog();

  return createPortal(
    <dialog ref={dialogRef} className="gallery-overview" aria-labelledby={`${uid}-title`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <header className="gallery-overview-header">
        <div><p className="gallery-overview-eyebrow">LIT-MUN / In focus</p><h2 id={`${uid}-title`}>The full gallery</h2><p className="gallery-overview-count">{images.length} photographs. Choose a moment to see it up close.</p></div>
        <button type="button" className="gallery-overview-close" onClick={onClose} aria-label="Close full gallery"><X size={24} aria-hidden="true" /></button>
      </header>
      <ul className="gallery-overview-grid">
        {images.map((image, index) => <OverviewPhoto key={`${image.id}-${image.src}`} image={image} index={index} selected={selectedId === image.id} onSelect={onSelect} />)}
      </ul>
    </dialog>, document.body,
  );
}
