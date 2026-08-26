'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useStudios } from '@/lib/hooks/useStudios';
import { useInstitutSettings } from '@/lib/hooks/useInstitut';
import { studioService } from '@/lib/api/services/studioService';
import { institutService } from '@/lib/api/services/institutService';
import { Studio } from '@/lib/api/studios';
import { imageService } from '@/lib/api/services/imageService';
import { Plus, Edit, Trash2, ShieldAlert, Radio, EyeOff, ImageOff, Images, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirmModal';
import StudioFormModal from '@/components/dashboard/studios/studioFormModal';
import GalleryUpload from '@/components/ui/galleryUpload';
import toast from 'react-hot-toast';

export default function StudiosPage() {
  const { isAdmin } = useAuth();
  const { studios, mutate, isLoading } = useStudios();
  const { settings: institutSettings, mutate: mutateInstitut } = useInstitutSettings();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<number | null>(null);
  const [studioToEdit, setStudioToEdit] = useState<Studio | null>(null);
  const [galerie, setGalerie] = useState<string[]>([]);
  const [isSavingGalerie, setIsSavingGalerie] = useState(false);

  useEffect(() => {
    if (institutSettings) {
      setGalerie(institutSettings.galerie || []);
    }
  }, [institutSettings]);

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
        <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!studioToDelete) return;

    try {
      await studioService.delete(studioToDelete);
      toast.success('Studio supprimé avec succès');
      mutate();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (studio: Studio) => {
    setStudioToEdit(studio);
    setFormModalOpen(true);
  };

  const handleCreate = () => {
    setStudioToEdit(null);
    setFormModalOpen(true);
  };

  const handleGalerieChange = async (images: string[]) => {
    setGalerie(images);
    setIsSavingGalerie(true);
    try {
      await institutService.update({ galerie: images });
      await mutateInstitut();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la galerie');
    } finally {
      setIsSavingGalerie(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Studios</h1>
          <p className="text-gray-600 mt-1">
            {studios.length} studio{studios.length > 1 ? 's' : ''} — affichés sur la page publique /studios
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouveau studio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studios.map((studio) => (
          <div
            key={studio.id}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
          >
            <div className="relative aspect-[16/9] bg-gray-100">
              {studio.images?.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageService.getUrl(studio.images[0])}
                  alt={studio.nom}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <ImageOff className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(studio)}
                  className="p-2 bg-white/90 text-gray-700 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setStudioToDelete(studio.id);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 bg-white/90 text-gray-700 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {!studio.est_actif && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs rounded-full">
                  <EyeOff className="w-3 h-3" />
                  Masqué
                </span>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900">{studio.nom}</h3>
                {studio.lien_radio && (
                  <Radio className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{studio.description}</p>
              <p className="text-xs text-gray-400 mt-3">
                {studio.images?.length || 0} image{(studio.images?.length || 0) > 1 ? 's' : ''} · Ordre {studio.ordre}
              </p>
            </div>
          </div>
        ))}

        {studios.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-12">Aucun studio pour le moment.</p>
        )}
      </div>

      {/* Galerie Studios */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Images className="text-isdb-green-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Galerie Studios</h2>
          {isSavingGalerie && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Ces images illustrent la page publique « Nos studios » (galerie sous le texte de présentation).
          Pour les photos propres à un studio en particulier, ajoutez-les depuis sa fiche ci-dessus.
        </p>

        <GalleryUpload value={galerie} onChange={handleGalerieChange} type="institut" compact />
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le studio"
        message="Êtes-vous sûr de vouloir supprimer ce studio ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <StudioFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        studio={studioToEdit}
        onSuccess={() => {
          mutate();
          setFormModalOpen(false);
        }}
      />
    </div>
  );
}
