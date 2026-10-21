import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight } from 'lucide-react';
import { Hero, About, Committees, FAQ, Contact } from '../../Component';
import './LandingPage.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LandingPageProps {
  onNavigateToRegistration?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const pageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const constrainedConnection =
      connection?.saveData === true || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
    const lenis = constrainedConnection
      ? null
      : new Lenis({ autoRaf: false, anchors: true, smoothWheel: true });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const animateLenis = (time: number) => lenis?.raf(time * 1000);
    const pauseWhenHidden = () => {
      if (!lenis) return;
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.remove(animateLenis);
      } else {
        lenis.start();
        gsap.ticker.add(animateLenis);
        ScrollTrigger.refresh();
      }
    };

    lenis?.on('scroll', updateScrollTrigger);
    if (lenis && !document.hidden) gsap.ticker.add(animateLenis);
    document.addEventListener('visibilitychange', pauseWhenHidden);

    gsap.utils.toArray<HTMLElement>(
      '[data-reveal]:not([data-reveal-footer]):not([data-closing-cta])',
      page,
    ).forEach((element) => {
      gsap.fromTo(
        element,
        { y: 24 },
        {
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        },
      );
    });

    const footer = page.querySelector<HTMLElement>('[data-reveal-footer]');
    if (footer) {
      gsap.fromTo(
        footer,
        { y: 16 },
        {
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 100%',
            once: true,
          },
        },
      );
    }

    const committeeCards = gsap.utils.toArray<HTMLElement>('[data-committee-card]', page);
    if (committeeCards.length) {
      gsap.fromTo(
        committeeCards,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#committees',
            start: 'top 82%',
            once: true,
          },
        },
      );
    }

    const faqItems = gsap.utils.toArray<HTMLElement>('[data-faq-item]', page);
    if (faqItems.length) {
      gsap.fromTo(
        faqItems,
        { y: 18 },
        {
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 82%',
            once: true,
          },
        },
      );
    }

    const aboutParagraphs = gsap.utils.toArray<HTMLElement>('[data-about-paragraph]', page);
    if (aboutParagraphs.length) {
      gsap.fromTo(
        aboutParagraphs,
        { y: 22 },
        {
          y: 0,
          duration: 0.72,
          stagger: 0.16,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 72%',
            once: true,
          },
        },
      );
    }

    const aboutImageMotion = gsap.matchMedia();
    const aboutImage = page.querySelector<HTMLElement>('[data-about-image] .about-image');
    if (aboutImage) {
      gsap.fromTo(
        aboutImage,
        {
          autoAlpha: 0,
          scale: 0.94,
          y: 20,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '[data-about-image]',
            start: 'top 78%',
            once: true,
          },
        },
      );
      if (!constrainedConnection) {
        aboutImageMotion.add('(min-width: 761px) and (hover: hover) and (pointer: fine)', () => {
          gsap.to(aboutImage, {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-about-image]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          });
        });
      }
    }

    const contactSection = page.querySelector<HTMLElement>('[data-contact-section]');
    const contactIntro = gsap.utils.toArray<HTMLElement>('[data-contact-intro]', page);
    const contactPanel = page.querySelector<HTMLElement>('[data-contact-form]');
    if (contactSection && contactIntro.length && contactPanel) {
      gsap.timeline({
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 74%',
          once: true,
        },
      })
        .fromTo(
          contactIntro,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.1, ease: 'power2.out' },
        )
        .fromTo(
          contactPanel,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.58, ease: 'power2.out' },
          '-=0.18',
        );
    }



    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: page,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    return () => {
      lenis?.off('scroll', updateScrollTrigger);
      if (lenis) gsap.ticker.remove(animateLenis);
      document.removeEventListener('visibilitychange', pauseWhenHidden);
      lenis?.destroy();
      aboutImageMotion.revert();
    };
  }, { scope: pageRef });

  return (
    <main className="litmun-home-preview" ref={pageRef}>
      <div className="page-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <Hero />
      <About />
      <Committees />
      <FAQ />
      <Contact />
      <footer className="landing-footer" data-reveal data-reveal-footer>
        <div className="landing-footer-inner">
          <div>
            <p className="landing-footer-title">NITRRMUN 2026–27</p>
            <p>National Institute of Technology Raipur Model United Nations</p>
          </div>
          <nav className="landing-footer-links" aria-label="Footer">
            <a href="#contact">Contact</a>
            <a href="mailto:nitrrmun@nitrr.ac.in">Email</a>
            <a href="https://instagram.com/nitrrmun" target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </nav>
          <p className="landing-footer-copy">© 2026 NITRRMUN Conference, NIT Raipur. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
