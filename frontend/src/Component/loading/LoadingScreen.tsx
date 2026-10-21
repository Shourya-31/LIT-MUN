import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './LoadingScreen.css';
import NITRRMUNdark from '../../assets/NITRRMUN-dark.png';

gsap.registerPlugin(useGSAP);

const emblemUrl = NITRRMUNdark;
const minimumDisplayTime = 3000;
const maximumWaitTime = 3100;

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);
  const orbitPathRef = useRef<SVGCircleElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const accentSweepRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useGSAP(() => {
    const screen = screenRef.current;
    const glow = glowRef.current;
    const logo = logoRef.current;
    const sweep = sweepRef.current;
    const orbit = orbitRef.current;
    const orbitPath = orbitPathRef.current;
    const subtitle = subtitleRef.current;
    const accent = accentRef.current;
    const accentSweep = accentSweepRef.current;

    if (!screen || !glow || !logo || !sweep || !orbit || !orbitPath || !subtitle || !accent || !accentSweep) {
      return;
    }

    const startedAt = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let assetsReady = false;
    let appReady = false;
    let minimumElapsed = false;
    let introComplete = false;
    let exiting = false;
    let motionTweens: gsap.core.Animation[] = [];
    let minimumTimer = 0;
    let fallbackTimer = 0;
    let removeImageListeners = () => { };

    const exitWhenReady = () => {
      if (!assetsReady || !appReady || !minimumElapsed || !introComplete || exiting) return;
      exiting = true;
      motionTweens.forEach((animation) => animation.kill());
      motionTweens = [];
      gsap.killTweensOf([logo, orbit, glow, sweep, accentSweep]);
      gsap.timeline({ onComplete: () => onCompleteRef.current() })
        .to(glow, { scale: 1.06, opacity: 0.9, duration: reducedMotion ? 0.08 : 0.16, ease: 'power1.out' })
        .to(logo, { filter: 'brightness(1.16)', duration: reducedMotion ? 0.08 : 0.14, ease: 'power1.out' }, '<')
        .to(screen, {
          autoAlpha: 0,
          y: reducedMotion ? 0 : -10,
          duration: reducedMotion ? 0.16 : 0.3,
          ease: 'power2.inOut',
        }, '-=0.03');
    };

    const markReady = () => {
      if (assetsReady) return;
      assetsReady = true;
      exitWhenReady();
    };

    const markMinimumElapsed = () => {
      minimumElapsed = true;
      exitWhenReady();
    };

    const markAppReady = () => {
      appReady = true;
      exitWhenReady();
    };

    const readyHandler = () => markAppReady();
    window.addEventListener('litmun:app-ready', readyHandler);

    const remainingMinimumTime = Math.max(0, minimumDisplayTime - (performance.now() - startedAt));
    minimumTimer = window.setTimeout(markMinimumElapsed, remainingMinimumTime);

    const intro = gsap.timeline({
      onComplete: () => {
        introComplete = true;
        if (!reducedMotion && !exiting && (!appReady || !assetsReady)) {
          motionTweens = [
            gsap.to(orbit, { rotation: '+=8', duration: 8, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }),
            gsap.to(glow, { scale: 1.025, opacity: 0.78, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          ];
        }
        exitWhenReady();
      },
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        intro.pause();
        motionTweens.forEach((animation) => animation.pause());
      } else {
        intro.resume();
        motionTweens.forEach((animation) => animation.resume());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (reducedMotion) {
      gsap.set(logo, { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', scale: 1, y: 0 });
      intro
        .fromTo(screen, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: 'power1.out' })
        .fromTo(logo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, '-=0.04')
        .fromTo(subtitle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, '-=0.04')
        .fromTo(accent, { scaleX: 0 }, { scaleX: 1, duration: 0.15, ease: 'power1.out' }, '<');
      gsap.set(orbitPath, { autoAlpha: 0.55, strokeDashoffset: 0 });
    } else {
      intro
        .fromTo(screen, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'power1.out' })
        .fromTo(glow, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'power2.out' }, '-=0.04')
        .fromTo(
          logo,
          {
            autoAlpha: 0,
            scale: 0.88,
            y: 18,
            filter: 'blur(8px)',
            clipPath: 'inset(50% 50% 50% 50%)',
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.62,
            ease: 'power3.out',
          },
          0.3,
        )
        .fromTo(sweep, { xPercent: -180, autoAlpha: 0 }, { xPercent: 180, autoAlpha: 0.8, duration: 0.38, ease: 'power1.inOut' }, 0.42)
        .fromTo(orbitPath, { autoAlpha: 0, strokeDashoffset: 680 }, { autoAlpha: 0.72, strokeDashoffset: 0, duration: 0.52, ease: 'power2.inOut' }, 0.55)
        .fromTo(orbit, { rotation: -14 }, { rotation: 346, duration: 0.7, ease: 'power1.inOut', transformOrigin: '50% 50%' }, 0.5)
        .to(glow, { scale: 1.035, opacity: 0.94, duration: 0.3, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 0.65)
        .fromTo(subtitle, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }, 0.84)
        .fromTo(accent, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.out' }, 0.84)
        .fromTo(accentSweep, { xPercent: -150, autoAlpha: 0 }, { xPercent: 150, autoAlpha: 1, duration: 0.36, ease: 'power1.inOut' }, 0.9);
    }

    fallbackTimer = window.setTimeout(() => {
      assetsReady = true;
      appReady = true;
      minimumElapsed = true;
      introComplete = true;
      intro.progress(1);
      exitWhenReady();
    }, maximumWaitTime);

    const criticalImages = [logoImageRef.current, document.querySelector<HTMLImageElement>('.hero-image')]
      .filter((candidate): candidate is HTMLImageElement => candidate !== null);
    const imageReady = Promise.all(criticalImages.map((criticalImage) => {
      if (criticalImage.complete) {
        return criticalImage.decode().catch(() => undefined);
      }

      return new Promise<void>((resolve) => {
        const onLoad = () => resolve();
        const onError = () => resolve();
        criticalImage.addEventListener('load', onLoad, { once: true });
        criticalImage.addEventListener('error', onError, { once: true });
        removeImageListeners = () => {
          criticalImage.removeEventListener('load', onLoad);
          criticalImage.removeEventListener('error', onError);
        };
      });
    }));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    void Promise.all([imageReady, fontsReady]).then(markReady, markReady);

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('litmun:app-ready', readyHandler);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      removeImageListeners();
    };
  }, { scope: screenRef });

  return (
    <div ref={screenRef} className="loading-screen" role="status" aria-label="Loading NITRRMUN">
      <div ref={glowRef} className="loading-glow" aria-hidden="true" />
      <div className="loading-content">
        <div className="loading-stage" aria-hidden="true">
          <svg className="loading-orbit" viewBox="0 0 800 560" fill="none" aria-hidden="true" ref={orbitRef}>
            <circle
              ref={orbitPathRef}
              cx="400"
              cy="280"
              r="252"
              pathLength="1000"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="680 320"
              strokeDashoffset="680"
            />
          </svg>

          <div ref={logoRef} className="loading-logo-wrap">
            <img
              ref={logoImageRef}
              className="loading-logo"
              src={emblemUrl}
              alt="Official NITRRMUN Global Emblem"
              onError={() => console.error(`Failed to load the NITRRMUN emblem: ${emblemUrl}`)}
            />
            <span ref={sweepRef} className="loading-logo-sweep" />
          </div>
        </div>

        <p ref={subtitleRef} className="loading-subtitle">
          NITRRMUN 2026–27 <span aria-hidden="true">•</span> NIT RAIPUR
        </p>
        <span ref={accentRef} className="loading-accent" aria-hidden="true">
          <span ref={accentSweepRef} />
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
