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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeaturedBeatsCarousel } from '@/components/homepage/FeaturedBeatsCarousel';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { FAQAccordion } from '@/components/homepage/FAQAccordion';

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const t = useTranslations('homepage');
  
  // Refs pour les animations
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeDotRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  
  // Stats counters
  const stat1Ref = useRef<HTMLParagraphElement>(null);
  const stat2Ref = useRef<HTMLParagraphElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  
  // Final CTA refs
  const finalCtaTitleRef = useRef<HTMLHeadingElement>(null);
  const finalCtaButtonsRef = useRef<HTMLDivElement>(null);
  const finalCtaBadgesRef = useRef<HTMLDivElement>(null);

  // Parallax background
  useParallax(heroRef, { y: 100 }, { scrub: true });

  // Stats counters avec scroll trigger
  useCounter(stat1Ref, { to: 500, suffix: '+', scrollTrigger: true, duration: 1.5 });
  useCounter(stat2Ref, { to: 1000, suffix: '+', scrollTrigger: true, duration: 1.5, decimals: 0 });

  // Hero entrance animation enrichie
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Badge : slide-in + rotate + scale
      tl.fromTo(
        badgeRef.current,
        { y: -50, opacity: 0, rotation: -15, scale: 0.8 },
        { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }
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

      // CTA buttons sans animation (juste fade simple)
      tl.fromTo(
        ctaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, []);
  
  // Badge dot pulse loop
  useEffect(() => {
    if (!badgeDotRef.current) return;
    
    gsap.to(badgeDotRef.current, {
      scale: 1.5,
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);
  
  // Gradient animé en fond
  useEffect(() => {
    if (!gradientRef.current) return;
    
    gsap.to(gradientRef.current, {
      backgroundPosition: '200% 50%',
      duration: 10,
      repeat: -1,
      ease: 'linear',
    });
  }, []);
  
  // Stats pulse au scroll
  useEffect(() => {
    if (!stat1Ref.current || !stat2Ref.current) return;
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stat1Ref.current,
        start: 'top 90%',
        onEnter: () => {
          gsap.to([stat1Ref.current, stat2Ref.current], {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          });
        },
        once: true,
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Final CTA animations
  useEffect(() => {
    if (!finalCtaTitleRef.current || !finalCtaButtonsRef.current || !finalCtaBadgesRef.current) return;
    
    const ctx = gsap.context(() => {
      // Title mask reveal
      ScrollTrigger.create({
        trigger: finalCtaTitleRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            finalCtaTitleRef.current,
            { 
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
              opacity: 0,
            },
            { 
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
            }
          );
        },
        once: true,
      });
      
      // Buttons pop entrance
      ScrollTrigger.create({
        trigger: finalCtaButtonsRef.current,
        start: 'top 85%',
        onEnter: () => {
          const buttons = finalCtaButtonsRef.current!.querySelectorAll('a');
          gsap.fromTo(
            buttons,
            { scale: 0, opacity: 0, rotation: -10 },
            { 
              scale: 1, 
              opacity: 1, 
              rotation: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'elastic.out(1, 0.6)',
            }
          );
        },
        once: true,
      });
      
      // Trust badges slide up + stagger
      ScrollTrigger.create({
        trigger: finalCtaBadgesRef.current,
        start: 'top 90%',
        onEnter: () => {
          const badges = finalCtaBadgesRef.current!.querySelectorAll('[data-trust-badge]');
          gsap.fromTo(
            badges,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
            }
          );
        },
        once: true,
      });
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
        {/* Gradient animé */}
        <div 
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-br from-matrix-green/5 via-transparent to-matrix-green/5"
          style={{ 
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 50%',
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-black/50 to-matrix-black" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-32">
          {/* Badge premium avec animation */}
          <div 
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <div ref={badgeDotRef} className="w-2 h-2 rounded-full bg-matrix-green" />
            <span className="text-sm text-gray-400 font-medium">{t('badge')}</span>
          </div>

          {/* Main Title with BlurText Effect + shadow layer */}
          <div ref={titleContainerRef} className="relative mb-12 flex flex-col items-center">
            {/* Shadow text layer */}
            <div 
              className="absolute inset-0 blur-sm opacity-20 pointer-events-none"
              style={{ transform: 'translate(3px, 3px)' }}
            >
              <BlurText
                text={t('title')}
                delay={100}
                animateBy="letters"
                direction="top"
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-matrix-green/40 block justify-center"
              />
            </div>
            
            {/* Main text */}
            <BlurText
              text={t('title')}
              delay={100}
              animateBy="letters"
              direction="top"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-matrix-green block relative justify-center"
            />
          </div>

          {/* Subtitle avec white et gray-400 */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed text-center"
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

      {/* SECTION 2: Featured Beats Carousel */}
      <FeaturedBeatsCarousel />

      {/* SECTION 3: How It Works */}
      <HowItWorks />

      {/* SECTION 4: FAQ Accordion */}
      <FAQAccordion />

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 
            ref={finalCtaTitleRef}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {t('finalCta.title')}
            <br />
            <span className="bg-gradient-to-r from-matrix-green/90 to-matrix-green/70 bg-clip-text text-transparent">
              {t('finalCta.titleAccent')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            {t('finalCta.description')}
          </p>
          
          <div ref={finalCtaButtonsRef} className="flex flex-col sm:flex-row gap-6 justify-center">
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

          {/* Trust badges avec animations */}
          <div ref={finalCtaBadgesRef} className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-500">
            <div data-trust-badge className="flex items-center gap-2 group cursor-default">
              <svg className="w-5 h-5 text-matrix-green/80 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform">{t('trustBadges.secure')}</span>
            </div>
            <div data-trust-badge className="flex items-center gap-2 group cursor-default">
              <svg className="w-5 h-5 text-matrix-green/80 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform">{t('trustBadges.instant')}</span>
            </div>
            <div data-trust-badge className="flex items-center gap-2 group cursor-default">
              <svg className="w-5 h-5 text-matrix-green/80 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform">{t('trustBadges.clear')}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
