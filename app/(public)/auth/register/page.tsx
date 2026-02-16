'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import gsap from 'gsap';

export default function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div ref={containerRef} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Sign Up</h1>
          <p className="text-gray-400">Create your Isma Files account</p>
        </div>

        <div className="bg-black/80 border border-white/5 rounded-lg p-8">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-matrix-green hover:text-matrix-green/80 transition-colors font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
