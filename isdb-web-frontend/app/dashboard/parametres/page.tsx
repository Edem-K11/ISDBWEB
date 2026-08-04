'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useInstitutSettings } from '@/lib/hooks/useInstitut';
import { institutService } from '@/lib/api/services/institutService';
import { InstitutSettingsFormData } from '@/lib/types/institut';
import ImageUpload from '@/components/ui/imageUpload';
import GalleryUpload from '@/components/ui/galleryUpload';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import {
  Save,
  Loader2,
  ShieldAlert,
  Building2,
  Phone,
  Share2,
  Images,
} from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm: InstitutSettingsFormData = {
  nom: '',
  logo: '',
  galerie: [],
  description: '',
  adresse: '',
  telephone: '',
  email: '',
  fax: '',
  site_web: '',
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
  youtube_url: '',
  tiktok_url: '',
  whatsapp: '',
};

export default function ParametresPage() {
  const { isAdmin } = useAuth();
  const { settings, isLoading, mutate } = useInstitutSettings();
  const [formData, setFormData] = useState<InstitutSettingsFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        nom: settings.nom || '',
        logo: settings.logo || '',
        galerie: settings.galerie || [],
        description: settings.description || '',
        adresse: settings.adresse || '',
        telephone: settings.telephone || '',
        email: settings.email || '',
        fax: settings.fax || '',
        site_web: settings.site_web || '',
        facebook_url: settings.reseaux_sociaux.facebook || '',
        twitter_url: settings.reseaux_sociaux.twitter || '',
        linkedin_url: settings.reseaux_sociaux.linkedin || '',
        instagram_url: settings.reseaux_sociaux.instagram || '',
        youtube_url: settings.reseaux_sociaux.youtube || '',
        tiktok_url: settings.reseaux_sociaux.tiktok || '',
        whatsapp: settings.reseaux_sociaux.whatsapp || '',
      });
    }
  }, [settings]);

  const handleChange = (field: keyof InstitutSettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      toast.error('Le nom de l\'institut est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await institutService.update(formData);
      await mutate();
      toast.success('Informations de l\'institut mises à jour avec succès');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
        <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Gérez les informations générales et les réseaux sociaux de l'institut.
          Ces informations apparaissent sur le site public (ex : pages de formations).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-isdb-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Identité de l'institut</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <ImageUpload
                value={formData.logo}
                onChange={(url) => handleChange('logo', url)}
                label="Télécharger le logo de l'institut"
                type="institut"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'institut <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="Institut Supérieur Don Bosco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                value={formData.site_web}
                onChange={(e) => handleChange('site_web', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://isdb.edu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="Courte présentation de l'institut..."
              />
            </div>
          </div>
        </div>

        {/* Galerie Studios */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Images className="text-isdb-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Galerie Studios</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Ces images illustrent la page publique « Nos studios » (galerie sous le texte de présentation).
            Pour les photos propres à chaque studio, gérez-les depuis l'onglet Studios.
          </p>

          <GalleryUpload
            value={formData.galerie}
            onChange={(galerie) => setFormData((prev) => ({ ...prev, galerie }))}
            type="institut"
          />
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="text-isdb-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Coordonnées</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="Ex: GTA, 322 R.P.T., Lomé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="text"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="+228 22 50 78 56"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fax
              </label>
              <input
                type="text"
                value={formData.fax}
                onChange={(e) => handleChange('fax', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="+228 22 50 78 57"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="contact@isdb.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="+228 90 00 00 00"
              />
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Share2 className="text-isdb-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Réseaux sociaux</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://facebook.com/isdb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter / X</label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://twitter.com/isdb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/isdb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://instagram.com/isdb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://youtube.com/@isdb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
              <input
                type="url"
                value={formData.tiktok_url}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                placeholder="https://tiktok.com/@isdb"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
