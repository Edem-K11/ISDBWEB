

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useTags } from '@/lib/hooks/useTag';
import { tagService } from '@/lib/api/services/tagService';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirmModal';
import TagFormModal from '@/components/dashboard/tags/tagFormModal';
import toast from 'react-hot-toast';

export default function TagsPage() {
  const { isAdmin } = useAuth();
  const { tags, mutate, isLoading } = useTags();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [tagToEdit, setTagToEdit] = useState<any>(null);

  // Protection admin
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
    if (!tagToDelete) return;

    try {
      await tagService.delete(tagToDelete);
      toast.success('Tag supprimé avec succès');
      mutate();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (tag: any) => {
    setTagToEdit(tag);
    setFormModalOpen(true);
  };

  const handleCreate = () => {
    setTagToEdit(null);
    setFormModalOpen(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tags</h1>
          <p className="text-gray-600 mt-1">
            {tags.length} tag{tags.length > 1 ? 's' : ''} disponible{tags.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouveau tag
        </button>
      </div>

      {/* Grille de tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white border border-slate-300 rounded-xl border-2 hover:shadow-lg transition-all p-6 group"
            // style={{ borderColor: tag.couleur }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="px-4 py-2 rounded-full text-sm font-semibold border border-slate-300 bg-slate-100"
                // style={{
                //   backgroundColor: `${tag.couleur}20`,
                //   color: tag.couleur,
                // }}
              >
                {tag.nom}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(tag)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTagToDelete(tag.id);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Slug: <span className="font-mono">{tag.slug}</span></p>
              <p>Couleur: <span className="font-mono">{"tag.couleur"}</span></p>
              {tag.blogsCount !== undefined && (
                <p className="text-indigo-600 font-medium">
                  {tag.blogsCount} article{tag.blogsCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le tag"
        message="Êtes-vous sûr de vouloir supprimer ce tag ? Les articles utilisant ce tag ne seront pas supprimés."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <TagFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        tag={tagToEdit}
        onSuccess={() => {
          mutate();
          setFormModalOpen(false);
        }}
      />
    </div>
  );
}
