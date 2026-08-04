'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { studioService, StudioFormData } from '@/lib/api/services/studioService';
import { Studio } from '@/lib/api/studios';
import GalleryUpload from '@/components/ui/galleryUpload';
import toast from 'react-hot-toast';

interface StudioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio?: Studio | null;
  onSuccess: () => void;
}

const emptyForm: StudioFormData = {
  nom: '',
  description: '',
  images: [],
  ordre: 0,
  lien_radio: false,
  est_actif: true,
};

export default function StudioFormModal({ isOpen, onClose, studio, onSuccess }: StudioFormModalProps) {
  const [formData, setFormData] = useState<StudioFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studio) {
      setFormData({
        nom: studio.nom,
        description: studio.description || '',
        images: studio.images || [],
        ordre: studio.ordre,
        lien_radio: studio.lien_radio,
        est_actif: studio.est_actif,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [studio, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (studio) {
        await studioService.update(studio.id, formData);
        toast.success('Studio mis à jour avec succès');
      } else {
        await studioService.create(formData);
        toast.success('Studio créé avec succès');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            {studio ? 'Modifier le studio' : 'Nouveau studio'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nom du studio
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Studio Vidéo François de Sales"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Présentation du studio, son équipement, son usage..."
              />
            </div>

            <GalleryUpload
              label="Images du studio"
              value={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              type="studios"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col justify-center gap-3 pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.lien_radio}
                    onChange={(e) => setFormData({ ...formData, lien_radio: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Lien vers la radio
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.est_actif}
                    onChange={(e) => setFormData({ ...formData, est_actif: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Visible sur le site public
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {studio ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : studio ? (
                  'Mettre à jour'
                ) : (
                  'Créer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
