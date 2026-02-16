'use client';

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseCounterConfig {
  /** Valeur de départ */
  from?: number;
  /** Valeur d'arrivée */
  to: number;
  /** Durée de l'animation en secondes */
  duration?: number;
  /** Ease function */
  ease?: string;
  /** Déclencher au scroll */
  scrollTrigger?: boolean;
  /** Position de déclenchement */
  start?: string;
  /** Nombre de décimales à afficher */
  decimals?: number;
  /** Préfixe (ex: "+", "$") */
  prefix?: string;
  /** Suffixe (ex: "€", "%", "k") */
  suffix?: string;
  /** Fonction de formatage custom */
  formatter?: (value: number) => string;
}

/**
 * Hook pour animer un compteur de nombres
 * Parfait pour les stats, prix, etc.
 * 
 * @example
 * const counterRef = useRef<HTMLSpanElement>(null);
 * useCounter(counterRef, {
 *   from: 0,
 *   to: 500,
 *   duration: 1.5,
 *   suffix: '+',
 *   scrollTrigger: true
 * });
 * 
 * return <span ref={counterRef}>0</span>
 */
export function useCounter(
  elementRef: RefObject<HTMLElement>,
  config: UseCounterConfig
) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const element = elementRef.current;
    const {
      from = 0,
      to,
      duration = 1.2,
      ease = 'power2.out',
      scrollTrigger = false,
      start = 'top 80%',
      decimals = 0,
      prefix = '',
      suffix = '',
      formatter,
    } = config;

    // Objet temporaire pour le compteur
    const counter = { value: from };

    // Fonction de formatage
    const formatValue = (val: number): string => {
      if (formatter) return formatter(val);
      
      const formatted = decimals > 0 
        ? val.toFixed(decimals) 
        : Math.round(val).toString();
      
      return `${prefix}${formatted}${suffix}`;
    };

    // Initialiser le texte
    element.textContent = formatValue(from);

    const animationConfig: gsap.TweenVars = {
      value: to,
      duration,
      ease,
      onUpdate: () => {
        element.textContent = formatValue(counter.value);
      },
    };

    // Ajouter ScrollTrigger si demandé
    if (scrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: element,
        start,
        toggleActions: 'play none none none',
      };
    }

    // Créer l'animation
    tweenRef.current = gsap.to(counter, animationConfig);

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [elementRef, config]);
}

/**
 * Hook pour animer plusieurs compteurs en même temps (ex: grille de stats)
 * 
 * @example
 * const stats = [
 *   { ref: useRef(null), to: 500, suffix: '+' },
 *   { ref: useRef(null), to: 1000, suffix: '+' },
 *   { ref: useRef(null), to: 24, suffix: '/7' },
 * ];
 * 
 * useCounters(stats, { scrollTrigger: true, stagger: 0.1 });
 */
export function useCounters(
  counters: Array<{
    ref: RefObject<HTMLElement>;
    to: number;
    from?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  }>,
  options?: {
    duration?: number;
    ease?: string;
    scrollTrigger?: boolean;
    start?: string;
    stagger?: number;
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const {
      duration = 1.2,
      ease = 'power2.out',
      scrollTrigger = false,
      start = 'top 80%',
      stagger = 0,
    } = options || {};

    const timeline = gsap.timeline({
      scrollTrigger: scrollTrigger
        ? {
            trigger: counters[0].ref.current,
            start,
            toggleActions: 'play none none none',
          }
        : undefined,
    });

    counters.forEach((counter, index) => {
      if (!counter.ref.current) return;

      const element = counter.ref.current;
      const from = counter.from ?? 0;
      const counterObj = { value: from };

      const formatValue = (val: number): string => {
        const decimals = counter.decimals ?? 0;
        const formatted = decimals > 0 
          ? val.toFixed(decimals) 
          : Math.round(val).toString();
        
        return `${counter.prefix || ''}${formatted}${counter.suffix || ''}`;
      };

      // Initialiser
      element.textContent = formatValue(from);

      // Ajouter à la timeline
      timeline.to(
        counterObj,
        {
          value: counter.to,
          duration,
          ease,
          onUpdate: () => {
            element.textContent = formatValue(counterObj.value);
          },
        },
        index * stagger
      );
    });

    return () => {
      timeline.kill();
    };
  }, [counters, options]);
}
