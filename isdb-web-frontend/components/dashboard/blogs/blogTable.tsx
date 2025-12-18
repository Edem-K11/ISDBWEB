'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { blogService } from '@/lib/api/services/blogService';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import ConfirmModal from '../../ui/confirmModal';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import Image from 'next/image';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { BlogFilters } from '@/lib/types/blog';
import { imageService } from '@/lib/api/services/imageService';
import Pagination from '@/components/blog/pagination';

export default function BlogTable({ filters }: { filters: BlogFilters }) {
  const { user, isAdmin } = useAuth();
  const [page, setPage] = useState(filters.page || 1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // Créer une clé unique pour SWR basée sur les filtres
  const swrKey = [
    ENDPOINTS.DASHBOARD_BLOGS,
    filters.statut || '',
    filters.tag || '',
    filters.search || '',
    filters.redacteur_id !== undefined ? filters.redacteur_id : '',
    filters.annee || '',
    page
  ].join('|');

  // Récupérer les blogs avec les filtres
  const { data: blogsData, error, mutate } = useSWR(
    swrKey,
    () =>
      isAdmin()
        ? blogService.getAllAdmin({ ...filters, page })
        : blogService.getAllAdmin({ ...filters, redacteur_id:user?.id , page }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );
  
  
  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await blogService.delete(blogToDelete);
      toast.success('Article supprimé avec succès');
      mutate();
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleChangeStatut = async (id: number, newStatut: 'brouillon' | 'publie') => {
    try {
      await blogService.updateStatut(id, newStatut);
      toast.success(`Article ${newStatut === 'publie' ? 'publié' : 'mis en brouillon'}`);
      mutate();
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-red-600">Erreur lors du chargement des articles</p>
        <button
          onClick={() => mutate()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!blogsData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const blogs = blogsData.data || [];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > blogsData.meta.last_page) return;
    setPage(newPage);
  };


  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">Aucun article trouvé</p>
                      <p className="text-sm">Essayez de modifier vos filtres</p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={imageService.getUrl(blog.coverImage)}
                            fill
                            alt={blog.titre}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {blog.titre}
                          </p>
                          <p className="text-sm text-gray-500">
                            Par {blog.redacteur?.nom || 'Inconnu'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin() ? (
                        <button
                          onClick={() =>
                            handleChangeStatut(
                              blog.id,
                              blog.statut === 'publie' ? 'brouillon' : 'publie'
                            )
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            blog.statut === 'publie'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {blog.statut === 'publie' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Publié
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Brouillon
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            blog.statut === 'publie'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {blog.statut === 'publie' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Publié
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Brouillon
                            </>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 2).map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs rounded-md font-medium"
                            style={{
                              backgroundColor: `${tag.couleur}20`,
                              color: tag.couleur,
                            }}
                          >
                            {tag.nom}
                          </span>
                        ))}
                        {blog.tags?.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.dateCreation}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={ENDPOINTS.BLOG_BY_SLUG(blog.slug)}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={ENDPOINTS.DASHBOARD_BLOG_EDIT(blog.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setBlogToDelete(blog.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (si nécessaire) */}
        {blogsData.meta && blogsData.meta.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {blogsData.meta.current_page} sur {blogsData.meta.last_page}
              </p>
              {/* Ajoutez ici vos boutons de pagination si nécessaire */}
              <Pagination
                currentPage={blogsData.meta.current_page}
                totalPages={blogsData.meta.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer l'article"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}