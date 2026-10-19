import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { ChevronDown, ChevronUp, ImageOff, Images, Maximize2 } from 'lucide-react';
import SectionHeading from '../conference/SectionHeading';
import ScrollReveal from '../animations/ScrollReveal';
import GalleryLightbox from './GalleryLightbox';
import GalleryOverview from './GalleryOverview';
import { galleryImages } from './galleryData';
import type { GalleryImage, GalleryProps } from './types';
import './Gallery.css';

function StackPhoto({ image }: { image: GalleryImage }) {
  const [failed, setFailed] = useState(false);
  return <span className="gallery-stack-photo">{failed ? (
    <span className="gallery-stack-error"><ImageOff size={32} aria-hidden="true" /><span>Photograph unavailable</span></span>
  ) : (
    <img src={image.thumbnailSrc || image.src} srcSet={image.thumbnailSrcSet}
      sizes="(max-width: 760px) calc(100vw - 100px), (max-width: 1264px) 45vw, 480px"
      alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" onError={() => setFailed(true)} />
  )}</span>;
}

export default function Gallery({ images = galleryImages }: GalleryProps) {
  const uid = useId();
  const [selection, setSelection] = useState({ id: images[0]?.id ?? '', fromId: '', direction: 1, revision: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const currentCardRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(0, images.findIndex((image) => image.id === selection.id));
  const selected = images[selectedIndex];
  const departing = images.find((image) => image.id === selection.fromId);
  const closeLightbox = useCallback(() => setExpandedId(null), []);

  useLayoutEffect(() => {
    const card = currentCardRef.current;
    if (!selection.fromId || !card?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const animation = card.animate([
      { transform: `translateY(${selection.direction * 27}px) rotate(${selection.direction * 5}deg) scale(0.96)`, opacity: 0.65 },
      { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
    ], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    return () => animation.cancel();
  }, [selection]);

  function selectPhoto(id: string, direction = 1, animate = true) {
    if (id === selected?.id) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setSelection((previous) => ({ id, fromId: animate && !reducedMotion ? selected?.id ?? '' : '', direction, revision: previous.revision + 1 }));
  }

  function move(direction: number) {
    if (images.length < 2) return;
    selectPhoto(images[(selectedIndex + direction + images.length) % images.length].id, direction);
  }

  function onStackKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!images.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    else if (event.key === 'Home') { event.preventDefault(); selectPhoto(images[0].id, -1); }
    else if (event.key === 'End') { event.preventDefault(); selectPhoto(images[images.length - 1].id); }
  }

  function onSwipeEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartY.current;
    touchStartY.current = null;
    const end = event.changedTouches[0]?.clientY;
    if (start !== null && end !== undefined && Math.abs(start - end) > 45) move(start > end ? 1 : -1);
  }

  const neighbours = selected && images.length > 1 ? [
    ...(images.length > 2 ? [{ image: images[(selectedIndex - 1 + images.length) % images.length], position: 'previous' }] : []),
    { image: images[(selectedIndex + 1) % images.length], position: 'next' },
  ] : [];

  return (
    <section id="gallery" className="conference-section gallery-section" aria-labelledby={`${uid}-heading`}>
      <div className="conference-container">
        <ScrollReveal className="conference-reveal">
          <SectionHeading id={`${uid}-heading`} number="03" eyebrow="Beyond the debate"
            title={<>Moments that<br /><em>make the conference.</em></>}
            description="The exchanges, the connections, the shared sense of purpose. LIT-MUN's story, one photograph at a time." />
        </ScrollReveal>

        {selected ? (
          <div className="gallery-feature" data-direction={selection.direction < 0 ? 'previous' : 'next'}>
            <div className="gallery-feature-tools">
              <button type="button" className="gallery-view-all" aria-haspopup="dialog" onClick={() => setOverviewOpen(true)}>
                <Images size={17} aria-hidden="true" />View full gallery
              </button>
            </div>
            <div className="gallery-feature-body">
              <div className="gallery-stack" role="group" aria-label="Photograph stack" onKeyDown={onStackKeyDown}>
                <div className="gallery-stack-stage" onTouchStart={(event) => { touchStartY.current = event.touches[0]?.clientY ?? null; }}
                  onTouchEnd={onSwipeEnd} onTouchCancel={() => { touchStartY.current = null; }}>
                  {neighbours.map(({ image, position }) => (
                    <div key={image.id} className={`gallery-stack-card gallery-stack-card--${position}`} aria-hidden="true"><StackPhoto image={image} /></div>
                  ))}
                  {departing && <div key={`departing-${selection.revision}`} className="gallery-stack-card gallery-stack-card--departing" aria-hidden="true"
                    onAnimationEnd={(event) => {
                      if (event.target === event.currentTarget) setSelection((previous) => ({ ...previous, fromId: '' }));
                    }}><StackPhoto image={departing} /></div>}
                  <button ref={currentCardRef} type="button" className="gallery-stack-card gallery-stack-card--current"
                    aria-label={`Expand photograph: ${selected.caption || selected.alt}`} aria-describedby={`${uid}-caption`} aria-haspopup="dialog"
                    onClick={() => setExpandedId(selected.id)}>
                    <StackPhoto key={selected.id} image={selected} />
                    <span className="gallery-stack-expand"><Maximize2 size={18} aria-hidden="true" /></span>
                  </button>
                  <span className="gallery-stack-corner gallery-stack-corner--top" aria-hidden="true" />
                  <span className="gallery-stack-corner gallery-stack-corner--bottom" aria-hidden="true" />
                </div>
                <div className="gallery-stack-controls">
                  <button type="button" onClick={() => move(-1)} disabled={images.length < 2} aria-label="Previous gallery photograph"><ChevronUp size={20} aria-hidden="true" /></button>
                  <span className="gallery-stack-count" aria-label={`Photograph ${selectedIndex + 1} of ${images.length}`}>{String(selectedIndex + 1).padStart(2, '0')}<span aria-hidden="true">/</span>{String(images.length).padStart(2, '0')}</span>
                  <button type="button" onClick={() => move(1)} disabled={images.length < 2} aria-label="Next gallery photograph"><ChevronDown size={20} aria-hidden="true" /></button>
                </div>
              </div>

              <div className="gallery-feature-copy">
                <p className="gallery-feature-eyebrow">LIT-MUN / In focus</p>
                <h3>Every dialogue<br />leaves a memory.</h3>
                <div className="gallery-current-caption" aria-live="polite" aria-atomic="true">
                  {departing && <div key={`caption-${selection.revision}`} className="gallery-caption-departing" aria-hidden="true">
                    <p className="gallery-current-category">{[departing.category, departing.year].filter(Boolean).join(' · ') || 'LIT-MUN'}</p>
                    <p>{departing.caption || departing.alt}</p>
                  </div>}
                  <div key={selected.id} className="gallery-caption-content">
                    <p className="gallery-current-category">{[selected.category, selected.year].filter(Boolean).join(' · ') || 'LIT-MUN'}</p>
                    <p id={`${uid}-caption`} className="gallery-caption-text">{selected.caption || selected.alt}</p>
                  </div>
                </div>
                <p className="gallery-stack-hint">Explore the stack with the arrows, or open the full gallery.</p>
              </div>
            </div>
          </div>
        ) : <div className="conference-empty"><p>No photographs in this collection yet.</p></div>}

        <div className="gallery-endnote"><span>LIT-MUN</span><span>Dialogue. Diplomacy. Perspective.</span><span aria-hidden="true">✦</span></div>
      </div>

      {overviewOpen && <GalleryOverview images={images} selectedId={selected?.id} onClose={() => setOverviewOpen(false)}
        onSelect={(id) => { selectPhoto(id, 1, false); setExpandedId(id); }} />}
      {expandedId && images.some((image) => image.id === expandedId) && <GalleryLightbox images={images} imageId={expandedId}
        onSelect={(id) => { setExpandedId(id); selectPhoto(id, 1, false); }} onClose={closeLightbox} />}
    </section>
  );
}
