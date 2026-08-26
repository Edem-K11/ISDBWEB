'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import MyNavFloating from '@/components/layout/navbar2';
import Footer from '@/components/layout/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Module {
  id: number;
  titre: string;
  slug: string;
  description: string;
  contenu: string;
  condition_admission: string;
  objectifs: string;
  competences_visees: string;
  debouches: string;
  profile_sortie: string;
  evaluation: string;
  programme: string;
  duree_heures: number;
  frais_inscription: number;
  frais_formation: number;
  statut_formation: string;
}

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
}

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    email: '',
    telephone: '',
    message: '',
  });

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`${API_URL}/formations-modulaires/${slug}`);
        const data = await res.json();
        setModule(data.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchModule();
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simule l'envoi du formulaire
      console.log('Inscription au module:', formData);
      alert(`Merci ${formData.nom}! Votre demande a été reçue. Nous vous contacterons bientôt.`);
      setFormData({ nom: '', email: '', telephone: '', message: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Module non trouvé</h1>
          <Link href="/formations-modulaires" className="text-amber-600 hover:text-amber-700">
            Retour aux modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MyNavFloating />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-black/20" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link href="/formations-modulaires" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">{module.titre}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{module.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Informations pratiques</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm text-slate-600 font-medium">Durée</div>
                      <div className="text-lg font-semibold text-slate-900">{module.duree_heures} heures</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <DollarSign className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm text-slate-600 font-medium">Frais d'inscription</div>
                      <div className="text-lg font-semibold text-slate-900">{module.frais_inscription?.toLocaleString()} FCFA</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <DollarSign className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm text-slate-600 font-medium">Frais de formation</div>
                      <div className="text-lg font-semibold text-slate-900">{module.frais_formation?.toLocaleString()} FCFA</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              {module.contenu && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Contenu du module</h3>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{module.contenu}</p>
                </div>
              )}

              {/* Objectifs */}
              {module.objectifs && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Objectifs</h3>
                  <p className="text-slate-700 leading-relaxed">{module.objectifs}</p>
                </div>
              )}

              {/* Compétences */}
              {module.competences_visees && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Compétences visées</h3>
                  <div className="flex flex-col gap-3">
                    {module.competences_visees.split(',').map((comp, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                        <span className="text-slate-700">{comp.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Débouchés */}
              {module.debouches && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Débouchés professionnels</h3>
                  <p className="text-slate-700 leading-relaxed">{module.debouches}</p>
                </div>
              )}
            </div>

            {/* Right: Registration Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 sticky top-24">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">S'inscrire au module</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+228..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Envoi...' : 'S\'inscrire maintenant'}
                  </button>
                </form>

                <p className="text-sm text-slate-600 mt-4 text-center">
                  * Champs obligatoires
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
