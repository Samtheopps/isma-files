'use client';

import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrer le plugin (safe pour SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseScrollTriggerConfig {
  trigger: RefObject<HTMLElement> | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Hook simplifié pour ScrollTrigger avec cleanup automatique
 * 
 * @example
 * const elementRef = useRef<HTMLDivElement>(null);
 * 
 * useScrollTrigger({
 *   trigger: elementRef,
 *   start: 'top 80%',
 *   end: 'top 20%',
 *   onEnter: () => {
 *     gsap.to(elementRef.current, { opacity: 1, y: 0 });
 *   }
 * });
 */
export function useScrollTrigger(
  animation: gsap.TweenVars,
  config: UseScrollTriggerConfig
) {
  useEffect(() => {
    // Protection SSR
    if (typeof window === 'undefined') return;

    const trigger = typeof config.trigger === 'string' 
      ? config.trigger 
      : config.trigger.current;

    if (!trigger) return;

    // Créer l'animation avec ScrollTrigger
    const ctx = gsap.context(() => {
      gsap.to(trigger, {
        ...animation,
        scrollTrigger: {
          trigger,
          start: config.start || 'top 80%',
          end: config.end || 'top 20%',
          scrub: config.scrub,
          pin: config.pin,
          markers: config.markers || false,
          toggleActions: config.toggleActions || 'play none none none',
          onEnter: config.onEnter,
          onLeave: config.onLeave,
          onEnterBack: config.onEnterBack,
          onLeaveBack: config.onLeaveBack,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [animation, config]);
}

/**
 * Hook pour créer un parallax simple
 * 
 * @example
 * const elementRef = useRef<HTMLDivElement>(null);
 * useParallax(elementRef, { y: 100, ease: 'none' });
 */
export function useParallax(
  elementRef: RefObject<HTMLElement>,
  movement: { x?: number; y?: number; scale?: number },
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        ...movement,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current,
          start: options?.start || 'top bottom',
          end: options?.end || 'bottom top',
          scrub: options?.scrub ?? true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [elementRef, movement, options]);
}

/**
 * Hook pour fade-in au scroll (pattern le plus commun)
 * 
 * @example
 * const elementRef = useRef<HTMLDivElement>(null);
 * useFadeInScroll(elementRef, { y: 30, duration: 0.8 });
 */
export function useFadeInScroll(
  elementRef: RefObject<HTMLElement>,
  options?: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const element = elementRef.current;

    // État initial
    gsap.set(element, {
      opacity: 0,
      y: options?.y ?? 30,
      x: options?.x ?? 0,
    });

    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: options?.duration ?? 0.8,
        delay: options?.delay ?? 0,
        ease: options?.ease ?? 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: options?.start || 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [elementRef, options]);
}
