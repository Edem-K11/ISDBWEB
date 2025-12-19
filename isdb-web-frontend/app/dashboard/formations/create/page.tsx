

'use client';

import { useState } from 'react';
import { ArrowLeft, GraduationCap, BookOpen, Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateFormationPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'PRINCIPALE' | 'MODULAIRE' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelection = (type: 'PRINCIPALE' | 'MODULAIRE') => {
    setSelectedType(type);
    router.push(`/dashboard/formations/create/${type.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Retour aux formations</span>
          </button>
          
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg">
                <GraduationCap className="text-white" size={28} strokeWidth={2} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer une nouvelle formation</h1>
              <p className="text-slate-600 text-base">
                Choisissez le type de formation adapté à vos besoins
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Intro Section */}
          <div className="text-center mb-12">
            <div className="inline-flex p-3 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl mb-5">
              <Sparkles className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Quel type de formation souhaitez-vous créer ?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sélectionnez l'option qui correspond le mieux à votre projet pédagogique
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Formation Principale */}
            <button
              onClick={() => handleSelection('PRINCIPALE')}
              onMouseEnter={() => setHoveredCard('principale')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative p-8 border-2 border-slate-200 rounded-3xl hover:border-indigo-300 transition-all duration-300 text-left bg-white hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-200/50">
                  <GraduationCap className="text-white" size={32} strokeWidth={2.5} />
                </div>
                
                {/* Badge */}
                <div className="absolute top-0 right-0 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  Diplômante
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Formation Principale
                </h3>
                
                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  {[
                    'Licence ou Master reconnu',
                    'Rattachée à un domaine d\'études',
                    'Programme sur 2-3 ans',
                    'Conditions d\'admission définies'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="mt-0.5 p-0.5 bg-indigo-100 rounded-full">
                        <Check size={14} className="text-indigo-600" strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Formulaire en plusieurs étapes
                  </div>
                </div>
              </div>
            </button>

            {/* Formation Modulaire */}
            <button
              onClick={() => handleSelection('MODULAIRE')}
              onMouseEnter={() => setHoveredCard('modulaire')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative p-8 border-2 border-slate-200 rounded-3xl hover:border-emerald-300 transition-all duration-300 text-left bg-white hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-200/50">
                  <BookOpen className="text-white" size={32} strokeWidth={2.5} />
                </div>
                
                {/* Badge */}
                <div className="absolute top-0 right-0 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  Courte durée
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Formation Modulaire
                </h3>
                
                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  {[
                    'Atelier ou séminaire pratique',
                    'Autonome et flexible',
                    'Durée de quelques jours/semaines',
                    'Inscription simplifiée'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="mt-0.5 p-0.5 bg-emerald-100 rounded-full">
                        <Check size={14} className="text-emerald-600" strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Formulaire simple et rapide
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Help Section */}
          <div className="pt-8 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
              Guide de sélection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50/70 to-violet-50/50 rounded-2xl p-6 border border-indigo-100/50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <GraduationCap size={20} className="text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mt-1">Formation Principale</h4>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Idéal pour les formations diplômantes de longue durée intégrées au cursus principal. 
                  Nécessite des informations complètes sur le programme, les objectifs pédagogiques et les prérequis.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-2xl p-6 border border-emerald-100/50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <BookOpen size={20} className="text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mt-1">Formation Modulaire</h4>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Parfait pour les ateliers, formations courtes et activités complémentaires. 
                  Création rapide et focus sur l'aspect pratique et opérationnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}