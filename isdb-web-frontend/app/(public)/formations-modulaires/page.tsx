import Link from 'next/link';
import HeroSection from '@/components/layout/hero';
import { formatFcfa, getFormationsModulaires } from '@/lib/api/formationsModulaires';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Formations modulaires', href: '/formations-modulaires', active: true },
];

export default async function FormationsModulairesPage() {
  const modules = await getFormationsModulaires();

  return (
    <div>
      <HeroSection
        title="Formations modulaires en cours du soir"
        description="Des modules professionnalisants en audiovisuel, communication, journalisme et création musicale, accessibles en parallèle de votre activité."
        color="orange"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        <p className="text-lg text-gray-600 mb-10 max-w-3xl">
          Chaque module est indépendant. Les frais comprennent une inscription et des frais de formation.
        </p>

        {modules.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {modules.map((module, index) => {
              const colors = [
                { bg: 'from-isdb-orange-50 to-isdb-orange-100', accent: 'text-isdb-orange-600', accentBg: 'bg-isdb-orange-600', border: 'border-isdb-orange-200' },
                { bg: 'from-isdb-green-50 to-isdb-green-100', accent: 'text-isdb-green-600', accentBg: 'bg-isdb-green-600', border: 'border-isdb-green-200' },
                { bg: 'from-isdb-red-50 to-isdb-red-100', accent: 'text-isdb-red-600', accentBg: 'bg-isdb-red-600', border: 'border-isdb-red-200' },
                { bg: 'from-isdb-gold-50 to-isdb-gold-100', accent: 'text-isdb-gold-600', accentBg: 'bg-isdb-gold-600', border: 'border-isdb-gold-200' }
              ];
              const color = colors[index % colors.length];

              return (
                <article
                  key={module.id}
                  className={`rounded-2xl border bg-gradient-to-br ${color.bg} ${color.border} bg-white p-8 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      {module.numero_module && (
                        <span className={`inline-block text-sm font-semibold ${color.accent} mb-2`}>
                          Module {module.numero_module}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-slate-900">{module.titre}</h2>
                    </div>
                    {module.duree_heures && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {module.duree_heures} h
                      </span>
                    )}
                  </div>

                  {module.contenu && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Contenu</h3>
                      <ul className="space-y-1 text-slate-700">
                        {module.contenu.split('\n').filter(Boolean).map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className={color.accent}>•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.offre && (
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-slate-500 mb-1">Inscription</p>
                        <p className="font-semibold text-slate-900">
                          {formatFcfa(module.offre.frais_inscription)}
                        </p>
                      </div>
                      <div className={`rounded-xl bg-gradient-to-br ${color.bg} p-4`}>
                        <p className="text-slate-500 mb-1">Frais de formation</p>
                        <p className={`font-semibold ${color.accent}`}>
                          {formatFcfa(module.offre.frais_formation)}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/formations-modulaires/${module.slug}`}
                    className={`inline-flex items-center ${color.accent} font-semibold hover:opacity-75`}
                  >
                    Voir le détail
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-600">Aucun module disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}
