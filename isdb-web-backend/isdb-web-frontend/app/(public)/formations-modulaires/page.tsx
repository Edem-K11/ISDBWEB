'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, DollarSign } from 'lucide-react';
import MyNavFloating from '@/components/layout/navbar2';
import Footer from '@/components/layout/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Module {
  id: number;
  titre: string;
  slug: string;
  description: string;
  duree_heures: number;
  frais_inscription: number;
  frais_formation: number;
  statut_formation: string;
}

export default function FormationsModulairesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${API_URL}/formations-modulaires`);
        const data = await res.json();
        setModules(data.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MyNavFloating />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-32 translate-x-32" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Formations Modulaires
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Développez vos compétences en audiovisuel, communication et création avec nos formations modulaires en cours du soir.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Intro */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Parcours Flexibles et Professionnalisants
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nos modules sont conçus pour les professionnels en activité et les étudiants souhaitant acquérir de nouvelles compétences.
            </p>
          </div>

          {/* Modules Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : modules.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-200 overflow-hidden group"
                >
                  {/* Module Card */}
                  <div className="p-8">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {module.titre}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 line-clamp-3">
                      {module.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-slate-700">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="font-medium">{module.duree_heures} heures</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <span>
                          <span className="font-medium">Inscription:</span> {module.frais_inscription?.toLocaleString()} FCFA
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <span>
                          <span className="font-medium">Formation:</span> {module.frais_formation?.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/formations-modulaires/${module.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Découvrir le module
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Aucun module disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Intéressé par une formation modulaire?</h2>
          <p className="text-lg mb-8 text-white/90">
            Contactez notre équipe pour plus d'informations et pour vous inscrire.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-lg"
          >
            Nous Contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
