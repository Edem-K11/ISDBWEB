

// components/formations/TabsContent.tsx
'use client';

import { useState } from 'react';

interface TabsContentProps {
  formation: any;
  offre: any;
  colors: any;
}

export default function TabsContent({ formation, offre, colors }: TabsContentProps) {
  const [activeTab, setActiveTab] = useState('presentation');

  const tabs = [
    { id: 'presentation', label: 'Présentation', show: true },
    { id: 'programme', label: 'Programme', show: formation.programme },
    { id: 'admission', label: 'Admission', show: formation.condition_admission || formation.profile_intree },
    { id: 'objectifs', label: 'Objectifs', show: formation.objectifs },
    { id: 'evaluation', label: 'Évaluation', show: formation.evaluation },
    { id: 'debouches', label: 'Débouchés', show: formation.profile_sortie },
  ].filter(tab => tab.show);

  return (
    <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabs Header */}
      <div className="flex flex-nowrap overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 whitespace-nowrap px-4 py-4 font-medium transition-all ${
              activeTab === tab.id
                ? `border-b-3 ${colors.text} ${colors.border} bg-gray-50`
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        {activeTab === 'presentation' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Présentation de la formation
            </h2>
            
            {formation.description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formation.description}
                </p>
              </div>
            )}

            {formation.specialite && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Spécialité</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formation.specialite}
                </p>
              </div>
            )}

            {offre.date_debut && offre.date_fin && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Période de formation</h3>
                <p className="text-gray-700">
                  Du {new Date(offre.date_debut).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })} au {new Date(offre.date_fin).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {offre.place_limited && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Places limitées</h3>
                <p className="text-gray-700">
                  Cette formation est limitée à {offre.place_limited} places. Inscrivez-vous rapidement !
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'programme' && formation.programme && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Programme de la formation
            </h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formation.programme }} />
            </div>

            {formation.programme_pdf && (
              <div className="mt-6">
                <a
                  href={formation.programme_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${colors.accent} text-white font-medium rounded-lg hover:opacity-90 transition-all`}
                >
                  📄 Télécharger le programme complet (PDF)
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admission' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Conditions d'admission
            </h2>

            {formation.profile_intree && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Profil d'entrée</h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formation.profile_intree }} />
                </div>
              </div>
            )}

            {formation.condition_admission && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Conditions requises</h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formation.condition_admission }} />
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700">
                Pour plus d'informations sur les modalités de candidature, 
                <a href="/admissions" className={`${colors.text} font-semibold hover:underline ml-1`}>
                  consultez notre page Admissions
                </a>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'objectifs' && formation.objectifs && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Objectifs de la formation
            </h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formation.objectifs }} />
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && formation.evaluation && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Modalités d'évaluation
            </h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formation.evaluation }} />
            </div>
          </div>
        )}

        {activeTab === 'debouches' && formation.profile_sortie && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Débouchés et poursuites d'études
            </h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formation.profile_sortie }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}