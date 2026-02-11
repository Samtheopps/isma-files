import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Isma Files
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Plateforme de vente d'instrumentales de qualité professionnelle
            </p>
            <p className="text-gray-400 mb-10">
              Découvrez notre collection de beats premium, produits avec soin pour sublimer vos projets musicaux
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button variant="primary" size="lg">
                  Explorer le catalogue
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="lg">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-card p-8 rounded-lg border border-dark-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Beats de qualité</h3>
              <p className="text-gray-400">
                Instrumentales produites avec soin, disponibles en MP3, WAV et Stems
              </p>
            </div>

            <div className="bg-dark-card p-8 rounded-lg border border-dark-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Licences claires</h3>
              <p className="text-gray-400">
                Du Basic à l'Exclusive, choisissez la licence adaptée à votre projet
              </p>
            </div>

            <div className="bg-dark-card p-8 rounded-lg border border-dark-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Téléchargement instant</h3>
              <p className="text-gray-400">
                Recevez vos fichiers et contrat immédiatement après l'achat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-primary-light/20 border border-primary/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à créer votre prochain hit ?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Rejoignez des centaines d'artistes qui font confiance à Isma Files
          </p>
          <Link href="/beats">
            <Button variant="primary" size="lg">
              Parcourir les beats maintenant
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
