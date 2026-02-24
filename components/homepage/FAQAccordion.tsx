'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion() {
  const t = useTranslations('homepage.faq');
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  
  // Fade in section
  useFadeInScroll(sectionRef, { y: 50, duration: 1 });
  
  // Animation d'entrée du titre
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          // Titre slide from left
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
          );
          
          // Subtitle fade in
          gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
          );
        },
        once: true,
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Stagger entrance des questions (alternance gauche/droite)
  useEffect(() => {
    if (!itemsContainerRef.current) return;
    
    const items = itemsContainerRef.current.querySelectorAll('[data-faq-item]');
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: itemsContainerRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            items,
            { 
              opacity: 0, 
              x: (index) => (index % 2 === 0 ? -40 : 40),
            },
            {
              opacity: 1,
              x: 0,
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
  
  const faqItems: FAQItem[] = [
    {
      question: t('q1.question'),
      answer: t('q1.answer'),
    },
    {
      question: t('q2.question'),
      answer: t('q2.answer'),
    },
    {
      question: t('q3.question'),
      answer: t('q3.answer'),
    },
    {
      question: t('q4.question'),
      answer: t('q4.answer'),
    },
    {
      question: t('q5.question'),
      answer: t('q5.answer'),
    },
  ];
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-matrix-black/95 to-matrix-black relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-matrix-green/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
        >
          {t('title')}
        </h2>
        <p 
          ref={subtitleRef}
          className="text-center text-gray-400 mb-12 font-light text-lg"
        >
          Tout ce que vous devez savoir
        </p>
        
        {/* FAQ Items */}
        <div ref={itemsContainerRef} className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => toggleItem(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

function FAQAccordionItem({ item, isOpen, onClick, index }: FAQAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const questionRef = useRef<HTMLButtonElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentRef.current || !iconRef.current) return;
    
    if (isOpen) {
      // Ouvrir avec slide down + fade
      gsap.to(contentRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      
      // Chevron rotation + scale pulse
      gsap.to(iconRef.current, {
        rotation: 180,
        scale: 1.1,
        duration: 0.4,
        ease: 'back.out(1.4)',
      });
      
      // Glow effect sur la question
      if (questionRef.current) {
        gsap.to(questionRef.current, {
          textShadow: '0 0 20px rgba(0, 255, 159, 0.4)',
          duration: 0.3,
        });
      }
      
      // Border animation (width 0 → 100%)
      if (borderRef.current) {
        gsap.fromTo(
          borderRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    } else {
      // Fermer
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      
      gsap.to(iconRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.in',
      });
      
      if (questionRef.current) {
        gsap.to(questionRef.current, {
          textShadow: '0 0 0px rgba(0, 255, 159, 0)',
          duration: 0.2,
        });
      }
    }
  }, [isOpen]);
  
  // Hover effect : slight slide right + glow
  const handleHover = (isHovering: boolean) => {
    if (!questionRef.current || isOpen) return;
    
    gsap.to(questionRef.current, {
      x: isHovering ? 4 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };
  
  return (
    <div 
      data-faq-item
      className={`
        bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 relative
        ${isOpen ? 'border-matrix-green/30 bg-white/[0.07]' : 'border-white/10 hover:border-white/20'}
      `}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Border indicator animé */}
      {isOpen && (
        <div 
          ref={borderRef}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-matrix-green/50 via-matrix-green to-matrix-green/50 origin-left"
        />
      )}
      
      {/* Question - Cliquable */}
      <button
        ref={questionRef}
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <span className={`
          text-lg font-semibold transition-colors pr-4
          ${isOpen ? 'text-matrix-green' : 'text-white group-hover:text-matrix-green'}
        `}>
          {item.question}
        </span>
        
        {/* Chevron Icon */}
        <svg
          ref={iconRef}
          className={`
            w-6 h-6 flex-shrink-0 transition-colors
            ${isOpen ? 'text-matrix-green' : 'text-gray-400 group-hover:text-matrix-green'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Answer - Collapsible */}
      <div
        ref={contentRef}
        className="h-0 opacity-0 overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-gray-300 leading-relaxed font-light">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
