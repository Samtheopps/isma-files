'use client';

import { useEffect, useRef, useCallback, DependencyList } from 'react';
import gsap from 'gsap';

/**
 * Hook wrapper pour GSAP avec cleanup automatique
 * Garantit que toutes les animations sont nettoyées au démontage du composant
 * 
 * @example
 * useGSAP(() => {
 *   gsap.to('.element', { opacity: 1, duration: 0.6 });
 * }, []);
 */
export function useGSAP(
  callback: (context: gsap.Context) => void | (() => void),
  dependencies: DependencyList = []
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Créer un nouveau contexte GSAP
    contextRef.current = gsap.context(() => {
      const cleanup = callback(contextRef.current!);
      
      // Si le callback retourne une fonction, c'est un cleanup custom
      if (typeof cleanup === 'function') {
        return cleanup;
      }
    });

    // Cleanup automatique : tue toutes les animations du contexte
    return () => {
      contextRef.current?.revert();
      contextRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return contextRef;
}

/**
 * Hook pour créer une timeline GSAP avec cleanup automatique
 * 
 * @example
 * const timeline = useGSAPTimeline();
 * 
 * useEffect(() => {
 *   if (!timeline) return;
 *   timeline.to('.element', { x: 100 })
 *           .to('.other', { opacity: 0 });
 * }, [timeline]);
 */
export function useGSAPTimeline(config?: gsap.TimelineVars) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline(config);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [config]);

  return timelineRef.current;
}

/**
 * Hook pour créer un quickTo (animation ultra-performante)
 * Utile pour suivre la souris ou animer en temps réel
 * 
 * @deprecated Utiliser gsap.quickTo directement dans useEffect pour éviter les refs null
 * 
 * @example
 * // ❌ Ne pas faire (cause warnings null)
 * const xTo = useQuickTo(ref.current, 'x', { duration: 0.3 });
 * 
 * // ✅ Faire plutôt :
 * useEffect(() => {
 *   if (!ref.current) return;
 *   const xTo = gsap.quickTo(ref.current, 'x', { duration: 0.3 });
 *   const handleMove = (e) => xTo(e.clientX);
 *   window.addEventListener('mousemove', handleMove);
 *   return () => window.removeEventListener('mousemove', handleMove);
 * }, []);
 */
export function useQuickTo(
  target: gsap.TweenTarget,
  property: string,
  vars?: gsap.TweenVars
) {
  const quickToRef = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    // Vérifier que target existe avant de créer quickTo
    if (!target) {
      console.warn('[useQuickTo] Target is null/undefined. Skipping animation.');
      return;
    }

    quickToRef.current = gsap.quickTo(target, property, vars) as (value: number) => void;

    return () => {
      quickToRef.current = null;
    };
  }, [target, property, vars]);

  return useCallback((value: number) => {
    quickToRef.current?.(value);
  }, []);
}
