'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Button } from '@/components/ui';
import { BeatCard } from '@/components/beat/BeatCard';
import { IBeat } from '@/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from '@/navigation';

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function FeaturedBeatsCarousel() {
  const t = useTranslations('homepage.featured');
  const router = useRouter();
  
  const [beats, setBeats] = useState<IBeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navLeftRef = useRef<HTMLButtonElement>(null);
  const navRightRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // Fetch les beats (prend les 6 premiers pour le carousel)
  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const res = await fetch('/api/beats?limit=6');
        const json = await res.json();
        // L'API retourne {data: [...], pagination: {...}}
        setBeats(json.data || json.beats || []);
      } catch (error) {
        console.error('Error fetching beats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBeats();
  }, []);
  
  // Animation d'entrée spectaculaire
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Titre : Split text avec stagger
      const titleText = titleRef.current!.textContent || '';
      const letters = titleText.split('');
      titleRef.current!.innerHTML = letters
        .map(letter => `<span class="inline-block opacity-0">${letter === ' ' ? '&nbsp;' : letter}</span>`)
        .join('');
      
      tl.to(titleRef.current!.querySelectorAll('span'), {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.4)',
      });
      
      // Subtitle : Fade from bottom
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );
      
      // Navigation buttons : Pop with bounce
      if (navLeftRef.current && navRightRef.current) {
        tl.fromTo(
          [navLeftRef.current, navRightRef.current],
          { scale: 0, opacity: 0, rotation: -180 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' },
          '-=0.3'
        );
      }
      
      // CTA Button : Slide up
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.2'
        );
      }
    });
    
    return () => ctx.revert();
  }, []);
  
  // Glow pulse animation loop
  useEffect(() => {
    if (!glowRef.current) return;
    
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);
  
  // ScrollTrigger : Parallax léger sur toute la section
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Auto-play carousel
  useEffect(() => {
    if (beats.length === 0 || isPaused) return;
    
    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, beats.length, isPaused]);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, beats.length - 2));
    animateSlideTransition();
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, beats.length - 2)) % Math.max(1, beats.length - 2));
    animateSlideTransition();
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    animateSlideTransition();
  };
  
  // Animation de transition entre slides
  const animateSlideTransition = () => {
    if (!carouselRef.current) return;
    
    const cards = carouselRef.current.querySelectorAll('[data-beat-card]');
    
    gsap.fromTo(
      cards,
      { scale: 0.95, opacity: 0.6, filter: 'blur(4px)' },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  };
  
  // Calcul du nombre de slides possibles (on montre 3 beats à la fois)
  const totalSlides = Math.max(1, beats.length - 2);
  
  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-matrix-black via-matrix-black/95 to-matrix-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/5 rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded-lg w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[450px] bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (beats.length === 0) {
    return null;
  }
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-matrix-black via-matrix-black/95 to-matrix-black relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow effect avec animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-matrix-green/5 rounded-full blur-[120px]" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ perspective: '1000px' }}
          >
            {t('title')}
          </h2>
          <p 
            ref={subtitleRef}
            className="text-lg text-gray-400 font-light"
          >
            {t('subtitle')}
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons - Left */}
          <button
            ref={navLeftRef}
            onClick={prevSlide}
            disabled={beats.length <= 3}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group hover:scale-110"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-white group-hover:text-matrix-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Navigation Buttons - Right */}
          <button
            ref={navRightRef}
            onClick={nextSlide}
            disabled={beats.length <= 3}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group hover:scale-110"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-white group-hover:text-matrix-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Beats Grid */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
              }}
            >
              {beats.map((beat, index) => (
                <div 
                  key={beat._id} 
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
                  data-beat-card
                >
                  <BeatCard 
                    beat={beat} 
                    onClick={() => router.push(`/beats/${beat._id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="md:hidden flex justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-matrix-green w-8' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Desktop Dots */}
          {beats.length > 3 && (
            <div className="hidden md:flex justify-center gap-2 mt-10">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-matrix-green w-12' 
                      : 'bg-white/20 hover:bg-white/40 w-8'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* CTA Button */}
        <div ref={ctaRef} className="text-center mt-12">
          <Link href="/beats">
            <Button variant="secondary" size="lg" className="group">
              {t('viewAll')}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
