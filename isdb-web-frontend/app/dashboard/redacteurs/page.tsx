'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRedacteursPage } from '@/lib/hooks/useRedacteur';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mutate as globalMutate } from 'swr';
import { redacteurService } from '@/lib/api/services/redacteurService';
import { Plus, Edit, Trash2, Mail, User, ShieldAlert, Shield, Building2 } from 'lucide-react';
import Image from 'next/image';
import ConfirmModal from '@/components/ui/confirmModal';
import RedacteurFormModal from '@/components/dashboard/redacteurs/redacteurFormModal';
import toast from 'react-hot-toast';

export default function RedacteursPage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const { redacteurs, meta, mutate: mutatePage, isLoading } = useRedacteursPage(page);

  // Rafraîchit la page courante ET les autres consommateurs de la liste complète
  // (formulaire d'article, tableau de bord, filtre des articles).
  const mutate = () => {
    mutatePage();
    globalMutate('redacteurs');
  };
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [redacteurToDelete, setRedacteurToDelete] = useState<any>(null);
  const [redacteurToEdit, setRedacteurToEdit] = useState<any>(null);

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
    if (!redacteurToDelete) return;

    try {
      const { message } = await redacteurService.delete(redacteurToDelete.id);
      toast.success(message || 'Rédacteur supprimé avec succès');
      mutate();
      setDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = (redacteur: any) => {
    setRedacteurToEdit(redacteur);
    setFormModalOpen(true);
  };

  const handleCreate = () => {
    setRedacteurToEdit(null);
    setFormModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des rédacteurs</h1>
          <p className="text-gray-600 mt-1">
            {meta?.total ?? redacteurs.length} rédacteur{(meta?.total ?? redacteurs.length) > 1 ? 's' : ''} enregistré{(meta?.total ?? redacteurs.length) > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-isdb-green-500 via-isdb-green-700 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-isdb-green-500 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouveau rédacteur
        </button>
      </div>

      {/* Grille de rédacteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redacteurs.map((redacteur) => (
          <div
            key={redacteur.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 group border border-gray-200 relative overflow-hidden"
          >
            {/* Header de la carte */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {redacteur.avatar ? (
                  <Image
                    src={redacteur.avatar}
                    alt={redacteur.nom}
                    width={56}  
                    height={56}
                    className="rounded-full ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-isdb-green-500 to-slate-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-gray-200">
                    {redacteur.nom.charAt(0)}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg">{redacteur.nom}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Badge de statut actif/inactif */}
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${redacteur.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {redacteur.est_actif ? 'Actif' : 'Inactif'}
                    </div>
                    
                    {redacteur.role === 'admin' && (
                      <div className="px-2 py-1 bg-isdb-green-100 text-isdb-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </div>
                    )}

                    {redacteur.est_systeme && (
                      <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Système
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-3">
              {!redacteur.est_systeme && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${redacteur.email}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {redacteur.email}
                  </a>
                </div>
              )}

              {redacteur.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {redacteur.bio}
                </p>
              )}

              {/* Statistiques */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Articles publiés</span>
                  <span className="font-bold text-indigo-600">
                    {redacteur.blogsPubliesCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Overlay avec boutons au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-6">
              <div className=" flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <button
                  onClick={() => handleEdit(redacteur)}
                  className="p-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </button>

                {redacteur.role !== 'admin' && !redacteur.est_systeme && (
                  <>
                    {/* Séparateur vertical */}
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <button
                      onClick={() => {
                        setRedacteurToDelete(redacteur);
                        setDeleteModalOpen(true);
                      }}
                      className="p-4 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {meta.current_page} sur {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            aria-label="Page suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le rédacteur"
        message={
          redacteurToDelete?.blogsPubliesCount > 0
            ? `Êtes-vous sûr de vouloir supprimer "${redacteurToDelete?.nom}" ? Ses ${redacteurToDelete.blogsPubliesCount} article(s) seront automatiquement réaffecté(s) à "La Rédaction".`
            : `Êtes-vous sûr de vouloir supprimer "${redacteurToDelete?.nom}" ?`
        }
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <RedacteurFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        redacteur={redacteurToEdit}
        onSuccess={() => {
          mutate();
          setFormModalOpen(false);
        }}
      />
    </div>
  );
}