'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, BookOpen, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import RichTextEditor from '@/components/dashboard/blogs/richTextEditor';
import { mutate } from 'swr';

export default function CreateFormationModulairePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    duree_heures: '',
    frais_inscription: '',
    frais_formation: '',
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      errors.titre = 'Le titre de la formation est requis';
    }

    if (formData.duree_heures && Number.isNaN(Number(formData.duree_heures))) {
      errors.duree_heures = 'La durée doit être un nombre d\'heures';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    try {
      await formationModulaireService.create({
        titre: formData.titre.trim(),
        description: formData.description.trim() || undefined,
        contenu: formData.contenu.trim() || undefined,
        duree_heures: formData.duree_heures ? Number(formData.duree_heures) : undefined,
        frais_inscription: formData.frais_inscription ? Number(formData.frais_inscription) : undefined,
        frais_formation: formData.frais_formation ? Number(formData.frais_formation) : undefined,
      });

      await mutate(
        key => Array.isArray(key) && key[0] === 'formations-modulaires-dashboard',
        undefined,
        { revalidate: true }
      );

      toast.success('Formation modulaire créée avec succès');
      router.push('/dashboard/formations');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/formations"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux formations
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-isdb-green-600 rounded-xl">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Créer une formation modulaire</h1>
            <p className="text-gray-600 mt-1">
              Remplissez les informations essentielles de l'atelier/formation courte
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la formation modulaire <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Ex: Animation Radio / TV..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent ${
                formErrors.titre ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.titre && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.titre}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez brièvement le contenu de l'atelier/formation..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none"
              maxLength={300}
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.description.length}/300 caractères
            </p>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de la formation
            </label>
            <RichTextEditor
              value={formData.contenu}
              onChange={(value) => handleChange('contenu', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (heures)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={1}
                  value={formData.duree_heures}
                  onChange={(e) => handleChange('duree_heures', e.target.value)}
                  placeholder="Ex: 144"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent ${
                    formErrors.duree_heures ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.duree_heures && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.duree_heures}
                </p>
              )}
            </div>

            {/* Frais d'inscription */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais d'inscription
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.frais_inscription}
                  onChange={(e) => handleChange('frais_inscription', e.target.value)}
                  placeholder="Ex: 10000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Frais de formation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de formation
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.frais_formation}
                  onChange={(e) => handleChange('frais_formation', e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Créer la formation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Aide */}
      <div className="mt-8 space-y-6">
        <div className="bg-isdb-green-50 border border-isdb-green-200 rounded-xl p-6">
          <h3 className="font-medium text-isdb-green-900 mb-3 flex items-center gap-2">
            <BookOpen size={20} />
            À propos des formations modulaires
          </h3>
          <ul className="text-isdb-green-800 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-isdb-green-500 rounded-full mt-2 shrink-0" />
              <span>Ateliers pratiques, séminaires, ou formations courtes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-isdb-green-500 rounded-full mt-2 shrink-0" />
              <span>Indépendantes des domaines et mentions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-isdb-green-500 rounded-full mt-2 shrink-0" />
              <span>Vous pourrez compléter le programme détaillé depuis la page de modification</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
