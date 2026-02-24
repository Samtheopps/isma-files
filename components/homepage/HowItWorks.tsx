'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HowItWorks() {
  const t = useTranslations('homepage.howItWorks');
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Fade in section
  useFadeInScroll(sectionRef, { y: 50, duration: 1 });
  
  // Titre : Split text avec stagger
  useEffect(() => {
    if (!titleRef.current) return;
    
    const ctx = gsap.context(() => {
      const words = (titleRef.current!.textContent || '').split(' ');
      titleRef.current!.innerHTML = words
        .map(word => `<span class="inline-block opacity-0">${word}&nbsp;</span>`)
        .join('');
      
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(titleRef.current!.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.4)',
          });
        },
        once: true,
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Stagger animation des steps avec rotation 3D
  useEffect(() => {
    if (!step1Ref.current || !step2Ref.current || !step3Ref.current) return;
    
    const steps = [step1Ref.current, step2Ref.current, step3Ref.current];
    const badges = [badge1Ref.current, badge2Ref.current, badge3Ref.current];
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Cards avec rotation 3D
          gsap.fromTo(
            steps,
            { 
              opacity: 0, 
              y: 60, 
              rotateY: -25,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power3.out',
            }
          );
          
          // Badges avec bounce + rotation
          gsap.fromTo(
            badges,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: 'elastic.out(1, 0.6)',
            }
          );
        },
        once: true,
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Float animation continue sur les icônes
  useEffect(() => {
    if (!icon1Ref.current || !icon2Ref.current || !icon3Ref.current) return;
    
    const icons = [icon1Ref.current, icon2Ref.current, icon3Ref.current];
    
    icons.forEach((icon, index) => {
      gsap.to(icon, {
        y: -10,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.5,
      });
    });
  }, []);
  
  // Parallax inverse sur le grid de fond
  useEffect(() => {
    if (!gridRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(gridRef.current, {
        y: 50,
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
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-matrix-black to-matrix-black/95 relative"
      style={{ perspective: '1200px' }}
    >
      {/* Background subtle grid avec parallax */}
      <div ref={gridRef} className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
        >
          {t('title')}
        </h2>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div 
            ref={step1Ref}
            className="opacity-0 group relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/[0.07] hover:border-matrix-green/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-matrix-green/10">
              {/* Number Badge */}
              <div 
                ref={badge1Ref}
                className="absolute -top-4 -left-4 w-12 h-12 bg-matrix-green rounded-full flex items-center justify-center font-bold text-xl text-matrix-black shadow-lg group-hover:rotate-[360deg] transition-transform duration-500"
              >
                1
              </div>
              
              {/* Icon avec float */}
              <div className="mb-6 flex justify-center">
                <div 
                  ref={icon1Ref}
                  className="w-20 h-20 rounded-2xl bg-matrix-green/10 border border-matrix-green/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                >
                  <svg className="w-10 h-10 text-matrix-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {t('step1.title')}
              </h3>
              <p className="text-gray-400 text-center font-light leading-relaxed">
                {t('step1.description')}
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div 
            ref={step2Ref}
            className="opacity-0 group relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/[0.07] hover:border-matrix-green/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-matrix-green/10">
              {/* Number Badge */}
              <div 
                ref={badge2Ref}
                className="absolute -top-4 -left-4 w-12 h-12 bg-matrix-green rounded-full flex items-center justify-center font-bold text-xl text-matrix-black shadow-lg group-hover:rotate-[360deg] transition-transform duration-500"
              >
                2
              </div>
              
              {/* Icon avec float */}
              <div className="mb-6 flex justify-center">
                <div 
                  ref={icon2Ref}
                  className="w-20 h-20 rounded-2xl bg-matrix-green/10 border border-matrix-green/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                >
                  <svg className="w-10 h-10 text-matrix-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {t('step2.title')}
              </h3>
              <p className="text-gray-400 text-center font-light leading-relaxed">
                {t('step2.description')}
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div 
            ref={step3Ref}
            className="opacity-0 group relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/[0.07] hover:border-matrix-green/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-matrix-green/10">
              {/* Number Badge */}
              <div 
                ref={badge3Ref}
                className="absolute -top-4 -left-4 w-12 h-12 bg-matrix-green rounded-full flex items-center justify-center font-bold text-xl text-matrix-black shadow-lg group-hover:rotate-[360deg] transition-transform duration-500"
              >
                3
              </div>
              
              {/* Icon avec float */}
              <div className="mb-6 flex justify-center">
                <div 
                  ref={icon3Ref}
                  className="w-20 h-20 rounded-2xl bg-matrix-green/10 border border-matrix-green/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                >
                  <svg className="w-10 h-10 text-matrix-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {t('step3.title')}
              </h3>
              <p className="text-gray-400 text-center font-light leading-relaxed">
                {t('step3.description')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Optional: Arrow connectors on desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
          <div className="max-w-6xl mx-auto px-4 flex justify-between">
            <div className="w-[calc(33.333%-80px)] h-[2px] bg-gradient-to-r from-matrix-green/20 to-transparent ml-[calc(33.333%)] mt-2" />
            <div className="w-[calc(33.333%-80px)] h-[2px] bg-gradient-to-r from-matrix-green/20 to-transparent ml-4 mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
