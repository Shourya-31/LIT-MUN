import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ArrowRight } from 'lucide-react';
import { useMagneticPointer } from '../../hooks/useMagneticPointer';
import './Hero.css';
import NITRRMUNdark from "../../assets/NITRRMUN-dark.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroProps {
  onRegisterClick?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const aboutButtonRef = useMagneticPointer<HTMLAnchorElement>(0.07);
  const spotlightFrameRef = useRef<number | null>(null);
  const spotlightPositionRef = useRef({ x: 0, y: 0 });
  const spotlightEnabledRef = useRef(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateSpotlightPreference = () => {
      spotlightEnabledRef.current = pointerQuery.matches && !motionQuery.matches;
      if (!spotlightEnabledRef.current && spotlightFrameRef.current !== null) {
        window.cancelAnimationFrame(spotlightFrameRef.current);
        spotlightFrameRef.current = null;
      }
    };

    updateSpotlightPreference();
    pointerQuery.addEventListener('change', updateSpotlightPreference);
    motionQuery.addEventListener('change', updateSpotlightPreference);
    return () => {
      pointerQuery.removeEventListener('change', updateSpotlightPreference);
      motionQuery.removeEventListener('change', updateSpotlightPreference);
    };
  }, []);

  useGSAP(() => {
    const title = titleRef.current;
    const image = imageRef.current;
    if (!title || !image || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const splitTitle = new SplitType(title, { types: 'words' });
    const navbar = document.querySelector<HTMLElement>('.navbar-header');
    const motionMedia = gsap.matchMedia();
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    if (navbar) {
      timeline.fromTo(
        navbar,
        { y: -12 },
        { y: 0, duration: 0.55 },
      );
    }

    timeline
      .fromTo('[data-hero-eyebrow]', { y: 14 }, { y: 0, duration: 0.55 })
      .fromTo(
        splitTitle.words ?? [],
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.11 },
        '-=0.2',
      )
      .fromTo('[data-hero-copy]', { y: 14 }, { y: 0, duration: 0.55 }, '-=0.3')
      .fromTo('[data-hero-actions]', { y: 12 }, { y: 0, duration: 0.5 }, '-=0.2')
      .fromTo(
        '.hero-image-frame',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0 0 0)', duration: 0.75, ease: 'power2.inOut' },
        '-=0.75',
      )
      .fromTo(
        image,
        {
          autoAlpha: 0,
          scale: 1.035,
          clipPath: 'polygon(0 0, 0 0, 0 0, 0 0, 0 100%, 0 8%)',
        },
        {
          autoAlpha: 1,
          scale: 1,
          clipPath: 'polygon(5% 0, 100% 0, 100% 90%, 94% 100%, 0 100%, 0 8%)',
          duration: 1.1,
        },
        '-=0.75',
      );

    motionMedia.add('(min-width: 761px) and (hover: hover) and (pointer: fine)', () => {
      gsap.to(image, {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    const startEntrance = () => timeline.play(0);
    if (document.querySelector('.loading-screen')) {
      window.addEventListener('litmun:loader-dismissed', startEntrance, { once: true });
    } else {
      startEntrance();
    }

    return () => {
      window.removeEventListener('litmun:loader-dismissed', startEntrance);
      if (spotlightFrameRef.current !== null) {
        window.cancelAnimationFrame(spotlightFrameRef.current);
        spotlightFrameRef.current = null;
      }
      motionMedia.revert();
      splitTitle.revert();
    };
  }, { scope: sectionRef });

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !spotlightEnabledRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    spotlightPositionRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    if (spotlightFrameRef.current !== null) return;

    const section = event.currentTarget;
    spotlightFrameRef.current = window.requestAnimationFrame(() => {
      section.style.setProperty('--spotlight-x', `${spotlightPositionRef.current.x}px`);
      section.style.setProperty('--spotlight-y', `${spotlightPositionRef.current.y}px`);
      spotlightFrameRef.current = null;
    });
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      id="home"
      onPointerMove={handlePointerMove}
      aria-labelledby="hero-title"
    >
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-eyebrow" data-hero-eyebrow>
            <span className="hero-eyebrow-line" aria-hidden="true" />
            NITRRMUN 2026–27 <span aria-hidden="true">/</span> NIT Raipur
          </p>

          <h1 className="hero-title" id="hero-title" aria-label="Model United Nations">
            <span ref={titleRef} aria-hidden="true">Model United Nations</span>
          </h1>

          <p className="hero-description" data-hero-copy>
            Step into the realm of international diplomacy, where nations find common grounds to debate deliberately, perspectives that shape world policy and dialogues that pave way for collective progress, Model United Nations at NIT Raipur invites aspiring diplomats, critical thinkers and young leaders to engage with pressing global challenges through informed debate, strategic negotiation, and a consensus-driven decision-making.
          </p>

          <div className="hero-actions" data-hero-actions>
            <a
              ref={aboutButtonRef}
              className="hero-primary-action magnetic-button"
              href="#about"
            >
              <span className="button-label">
                About the Conference
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="hero-visual">
          <img
            ref={imageRef}
            className="hero-image"
            src={NITRRMUNdark}
            alt="Official NITRRMUN Global Emblem"
            loading="eager"
          />
          <span className="hero-image-frame" aria-hidden="true" />
          <figcaption className="hero-image-caption">
            {/* <span>NITRRMUN Global Emblem</span> */}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
