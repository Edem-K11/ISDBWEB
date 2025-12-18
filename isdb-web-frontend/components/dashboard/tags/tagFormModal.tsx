

'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { tagService } from '@/lib/api/services/tagService';
import toast from 'react-hot-toast';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: any;
  onSuccess: () => void;
}

export default function TagFormModal({ isOpen, onClose, tag, onSuccess }: TagFormModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    couleur: '#3B82F6',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tag) {
      setFormData({
        nom: tag.nom,
        couleur: tag.couleur,
      });
    } else {
      setFormData({
        nom: '',
        couleur: '#3B82F6',
      });
    }
  }, [tag, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (tag) {
        await tagService.update(tag.id, formData);
        toast.success('Tag mis à jour avec succès');
      } else {
        await tagService.create(formData);
        toast.success('Tag créé avec succès');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {tag ? 'Modifier le tag' : 'Nouveau tag'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du tag
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Technologie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, couleur: color })}
                    className={`w-12 h-12 rounded-lg transition-all  border border-slate-300  bg-slate-100 ${
                      formData.couleur === color
                        ? 'ring-4 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    // style={{
                    //   backgroundColor: color,
                    //   ringColor: color,
                    // }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={formData.couleur}
                onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                className="mt-3 w-full h-12 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {tag ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  tag ? 'Mettre à jour' : 'Créer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
