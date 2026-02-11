import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/ui';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400">Connectez-vous à votre compte Isma Files</p>
        </div>

        <Card padding="lg">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="text-primary hover:text-primary-light transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
