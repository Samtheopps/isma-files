export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Isma Files
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Plateforme de vente d'instrumentales de qualité professionnelle
          </p>
          
          <div className="flex gap-4 justify-center">
            <a
              href="/beats"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Explorer les Beats
            </a>
            <a
              href="/admin"
              className="bg-dark-card hover:bg-dark-border text-white px-8 py-3 rounded-lg font-semibold transition-all border border-dark-border"
            >
              Admin Dashboard
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">🎵 Beats de Qualité</h3>
            <p className="text-gray-400">
              Instrumentales produites avec soin, disponibles en MP3, WAV et Stems
            </p>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">📜 Licences Claires</h3>
            <p className="text-gray-400">
              Du Basic à l'Exclusive, choisissez la licence adaptée à votre projet
            </p>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">⚡ Téléchargement Instant</h3>
            <p className="text-gray-400">
              Recevez vos fichiers et contrat immédiatement après l'achat
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
