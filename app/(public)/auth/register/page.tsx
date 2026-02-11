import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card } from '@/components/ui';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
          <p className="text-gray-400">Créez votre compte Isma Files</p>
        </div>

        <Card padding="lg">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary-light transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
