'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Button } from '@/components/ui';
import BlurText from '@/components/effects/BlurText';
import { useCounter } from '@/lib/hooks/useCounter';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';
import { useParallax } from '@/lib/hooks/useScrollTrigger';
import { gsap } from 'gsap';

export default function HomePage() {
  const t = useTranslations('homepage');
  
  // Refs pour les animations
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  // Stats counters
  const stat1Ref = useRef<HTMLParagraphElement>(null);
  const stat2Ref = useRef<HTMLParagraphElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  // Sections refs
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  // Parallax background
  useParallax(heroRef, { y: 100 }, { scrub: true });

  // Stats counters avec scroll trigger
  useCounter(stat1Ref, { to: 500, suffix: '+', scrollTrigger: true, duration: 1.5 });
  useCounter(stat2Ref, { to: 1000, suffix: '+', scrollTrigger: true, duration: 1.5, decimals: 0 });

  // Fade in sections
  useFadeInScroll(section1Ref, { y: 50, duration: 1 });
  useFadeInScroll(section2Ref, { y: 50, duration: 1 });
  useFadeInScroll(section3Ref, { y: 50, duration: 1 });

  // Hero entrance animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Badge slide-in from top
      tl.fromTo(
        badgeRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Subtitle word-by-word stagger
      if (subtitleRef.current) {
        const words = subtitleRef.current.textContent?.split(' ') || [];
        subtitleRef.current.innerHTML = words
          .map((word) => `<span class="inline-block opacity-0">${word}&nbsp;</span>`)
          .join('');

        tl.to(
          subtitleRef.current.querySelectorAll('span'),
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
          },
          '-=0.3'
        );
      }

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-black/50 to-matrix-black" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-32">
          {/* Badge premium et subtil */}
          <div 
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-matrix-green animate-pulse" />
            <span className="text-sm text-gray-400 font-medium">{t('badge')}</span>
          </div>

          {/* Main Title with BlurText Effect */}
          <div className="relative mb-12">
            <BlurText
              text={t('title')}
              delay={100}
              animateBy="letters"
              direction="top"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-matrix-green block"
            />
          </div>

          {/* Subtitle avec white et gray-400 */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            <span className="text-white font-normal">{t('subtitle.part1')}</span>, {t('subtitle.part2')}
          </p>

          {/* CTA Buttons avec spacing augmenté */}
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/beats">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                {t('cta.explore')}
              </Button>
            </Link>
            <Link href="#why-isma">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                {t('cta.learnMore')}
              </Button>
            </Link>
          </div>

          {/* Stats avec borders subtiles */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-24">
            <div className="text-center">
              <p ref={stat1Ref} className="text-3xl md:text-4xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-gray-500">{t('stats.beats')}</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p ref={stat2Ref} className="text-3xl md:text-4xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-gray-500">{t('stats.artists')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span ref={stat3Ref}>24/7</span>
              </p>
              <p className="text-sm text-gray-500">{t('stats.delivery')}</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator subtil */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Why Isma Files Section */}
      <section id="why-isma" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div ref={section1Ref} className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Image avec borders subtiles */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t('features.quality.title')}
                <br />
                <span className="text-matrix-green/90">{t('features.quality.titleAccent')}</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                {t('features.quality.description')}
              </p>
              <ul className="space-y-4">
                {[
                  t('features.quality.list.production'),
                  t('features.quality.list.formats'),
                  t('features.quality.list.mastering'),
                  t('features.quality.list.royalty')
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Second Row - Reversed */}
          <div ref={section2Ref} className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t('features.licensing.title')}
                <br />
                <span className="text-matrix-green/90">{t('features.licensing.titleAccent')}</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                {t('features.licensing.description')}
              </p>
              <ul className="space-y-4">
                {[
                  t('features.licensing.list.transparent'),
                  t('features.licensing.list.pdf'),
                  t('features.licensing.list.tiers'),
                  t('features.licensing.list.distribution')
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div ref={section3Ref} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1 border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t('features.delivery.title')}
                <br />
                <span className="text-matrix-green/90">{t('features.delivery.titleAccent')}</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                {t('features.delivery.description')}
              </p>
              <ul className="space-y-4">
                {[
                  t('features.delivery.list.instant'),
                  t('features.delivery.list.secure'),
                  t('features.delivery.list.validity'),
                  t('features.delivery.list.automated')
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('finalCta.title')}
            <br />
            <span className="bg-gradient-to-r from-matrix-green/90 to-matrix-green/70 bg-clip-text text-transparent">
              {t('finalCta.titleAccent')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            {t('finalCta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/beats">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                {t('finalCta.browseBeats')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                {t('finalCta.createAccount')}
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-matrix-green/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('trustBadges.secure')}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-matrix-green/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('trustBadges.instant')}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-matrix-green/80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {t('trustBadges.clear')}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
