'use client';

import { useState } from 'react';

// Tabs Component
const TabsContent = () => {
  const [activeTab, setActiveTab] = useState('presentation');

  const tabs = [
    { id: 'presentation', label: 'Présentation' },
    { id: 'programme', label: 'Programme' },
    { id: 'admission', label: 'Admission' },
    { id: 'evaluation', label: 'Évaluation' },
    { id: 'after', label: 'Et après ?' }
  ];

  return (
    <div className="flex-1 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex flex-wrap ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 transition ${
              activeTab === tab.id
                ? 'border-b-3 border-blue-500 text-blue-600 font-bold bg-white'
                : 'hover:bg-blue-50 border-b-3 border-gray-200 text-gray-600'
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
              Présentation du Master
            </h2>
            <p className="mb-4 text-gray-700">
              Le Master Recherche Philosophie propose une formation approfondie en philosophie contemporaine, 
              avec une attention particulière portée aux enjeux épistémologiques, éthiques et politiques des sociétés modernes.
            </p>
            <p className="mb-4 text-gray-700">
              Ce programme s'adresse aux étudiants désireux de poursuivre des recherches en philosophie et de développer 
              une expertise dans ce domaine. La formation allie enseignements théoriques et méthodologiques, permettant 
              aux étudiants d'acquérir les compétences nécessaires à la réalisation d'un travail de recherche original.
            </p>
            <p className="text-gray-700">
              Les étudiants bénéficient d'un encadrement personnalisé par des enseignants-chercheurs reconnus dans leur 
              domaine et ont l'opportunité de participer à des colloques, séminaires et autres événements scientifiques.
            </p>
          </div>
        )}

        {activeTab === 'programme' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Programme de la formation
            </h2>
            <p className="mb-6 text-gray-700">
              Le programme du Master Recherche Philosophie est organisé sur deux années (M1 et M2) et comprend 
              des enseignements fondamentaux, des séminaires spécialisés et la réalisation d'un mémoire de recherche.
            </p>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Semestre 1</h3>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
              <li>Histoire de la philosophie ancienne et médiévale</li>
              <li>Épistémologie et philosophie des sciences</li>
              <li>Philosophie politique contemporaine</li>
              <li>Méthodologie de la recherche</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Semestre 2</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Philosophie moderne et contemporaine</li>
              <li>Éthique et philosophie morale</li>
              <li>Esthétique et philosophie de l'art</li>
              <li>Initiation à la rédaction scientifique</li>
            </ul>
          </div>
        )}

        {activeTab === 'admission' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Conditions d'admission
            </h2>
            <p className="mb-6 text-gray-700">
              L'admission en Master Recherche Philosophie est sélective et s'effectue sur dossier.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Prérequis</h3>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
              <li>Être titulaire d'une licence de philosophie ou d'un diplôme équivalent</li>
              <li>Posséder de solides compétences en rédaction et analyse conceptuelle</li>
              <li>Maîtriser au moins une langue étrangère</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Modalités de candidature</h3>
            <p className="mb-4 text-gray-700">
              Les candidatures s'effectuent en ligne via la plateforme dédiée de l'université. 
              Le dossier de candidature doit comprendre :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Un curriculum vitae</li>
              <li>Une lettre de motivation</li>
              <li>Les relevés de notes des trois années de licence</li>
              <li>Un projet de recherche préliminaire (2-3 pages)</li>
            </ul>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Modalités d'évaluation
            </h2>
            <p className="mb-4 text-gray-700">L'évaluation des étudiants repose sur :</p>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
              <li>Des examens écrits en fin de semestre</li>
              <li>Des travaux dirigés et exposés</li>
              <li>La rédaction et la soutenance d'un mémoire de recherche</li>
              <li>La participation active aux séminaires</li>
            </ul>
            <p className="text-gray-700">
              La validation du master nécessite l'obtention de 120 crédits ECTS répartis sur les quatre semestres de formation.
            </p>
          </div>
        )}

        {activeTab === 'after' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b">
              Débouchés et poursuites d'études
            </h2>
            <p className="mb-6 text-gray-700">
              Le Master Recherche Philosophie ouvre la voie à divers débouchés professionnels et poursuites d'études :
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Poursuites d'études</h3>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
              <li>Doctorat en philosophie</li>
              <li>Préparation aux concours de l'enseignement (CAPES, Agrégation)</li>
              <li>Formations complémentaires en éthique, médiation culturelle, etc.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Débouchés professionnels</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Enseignement secondaire et supérieur</li>
              <li>Recherche et expertise philosophique</li>
              <li>Métiers de l'édition et de la culture</li>
              <li>Consultant en éthique (entreprises, hôpitaux, institutions)</li>
              <li>Médiation culturelle et scientifique</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default TabsContent;