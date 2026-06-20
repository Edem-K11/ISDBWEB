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
            {modules.map((module) => (
              <article
                key={module.id}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Accent border animée */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-isdb-orange-500 via-isdb-green-500 to-isdb-orange-600"></div>

                <div className="p-8">
                  {/* En-tête avec titre et durée */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-isdb-orange-600 transition-colors">
                        {module.titre}
                      </h2>
                      {module.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {module.description}
                        </p>
                      )}
                    </div>
                    {module.duree_heures && (
                      <div className="shrink-0 rounded-2xl bg-gradient-to-br from-isdb-orange-100 to-isdb-orange-50 px-4 py-2 text-center">
                        <p className="text-xs text-slate-600 mb-1">Durée</p>
                        <p className="text-lg font-bold text-isdb-orange-600">{module.duree_heures}h</p>
                      </div>
                    )}
                  </div>

                  {/* Contenu en points clés */}
                  {module.contenu && (
                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Au programme</h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {module.contenu.split('\n').filter(Boolean).slice(0, 3).map((line) => (
                          <li key={line} className="flex gap-2 items-start">
                            <svg className="w-4 h-4 text-isdb-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tarifs */}
                  {module.offre && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="rounded-2xl bg-white border border-slate-200 p-4">
                        <p className="text-xs text-slate-500 font-medium mb-1">Inscription</p>
                        <p className="text-lg font-bold text-slate-900">
                          {formatFcfa(module.offre.frais_inscription)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-isdb-orange-50 to-isdb-orange-100 border border-isdb-orange-200 p-4">
                        <p className="text-xs text-slate-600 font-medium mb-1">Formation</p>
                        <p className="text-lg font-bold text-isdb-orange-600">
                          {formatFcfa(module.offre.frais_formation)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/formations-modulaires/${module.slug}`}
                    className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-gradient-to-r from-isdb-orange-500 to-isdb-orange-600 text-white font-semibold rounded-2xl hover:from-isdb-orange-600 hover:to-isdb-orange-700 transition-all duration-200 group/btn shadow-md hover:shadow-lg"
                  >
                    Consulter les détails
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Aucun module disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}
