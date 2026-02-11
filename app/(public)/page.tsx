import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-mono uppercase tracking-wider mb-6 text-matrix-green glow-green-strong glitch">
              ISMA FILES // MATRIX PROTOCOL
            </h1>
            <p className="text-xl md:text-2xl font-mono text-matrix-green-glow mb-8">
              &gt; PLATEFORME DE DISTRIBUTION D'INSTRUMENTALES // QUALITÉ PROFESSIONNELLE
            </p>
            <p className="font-mono text-matrix-green-dim mb-10">
              // Découvrez notre collection de beats premium, produits avec soin pour sublimer vos projets musicaux
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button variant="primary" size="lg">
                  EXPLORER LE CATALOGUE_
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="lg">
                  CRÉER UN COMPTE_
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
            <Card variant="terminal" hover className="group">
              <div className="w-12 h-12 bg-matrix-black border-2 border-matrix-green flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-mono uppercase tracking-wider text-matrix-green-light mb-3 glow-green">&gt; Beats de qualité</h3>
              <p className="font-mono text-matrix-green-dim text-sm">
                Instrumentales produites avec soin, disponibles en MP3, WAV et Stems
              </p>
            </Card>

            <Card variant="terminal" hover className="group">
              <div className="w-12 h-12 bg-matrix-black border-2 border-matrix-green flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-mono uppercase tracking-wider text-matrix-green-light mb-3 glow-green">&gt; Licences claires</h3>
              <p className="font-mono text-matrix-green-dim text-sm">
                Du Basic à l'Exclusive, choisissez la licence adaptée à votre projet
              </p>
            </Card>

            <Card variant="terminal" hover className="group">
              <div className="w-12 h-12 bg-matrix-black border-2 border-matrix-green flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-mono uppercase tracking-wider text-matrix-green-light mb-3 glow-green">&gt; Téléchargement instant</h3>
              <p className="font-mono text-matrix-green-dim text-sm">
                Recevez vos fichiers et contrat immédiatement après l'achat
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="terminal" className="p-12 text-center border-matrix-green">
            <h2 className="text-3xl md:text-4xl font-mono uppercase tracking-wider text-matrix-green mb-4 glow-green-strong">
              PRÊT À CRÉER VOTRE PROCHAIN HIT ?
            </h2>
            <p className="font-mono text-matrix-green-glow mb-8 text-lg">
              &gt; Rejoignez des centaines d'artistes qui font confiance à Isma Files
            </p>
            <Link href="/beats">
              <Button variant="primary" size="lg">
                PARCOURIR LES BEATS MAINTENANT_
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
