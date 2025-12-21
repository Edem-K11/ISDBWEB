
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { useForm } from 'react-hook-form';
import { blogService } from '@/lib/api/services/blogService';
import { useTags } from '@/lib/hooks/useTag';
import { useRedacteurs } from '@/lib/hooks/useRedacteur';
import RichTextEditor from '../dashboard/blogs/richTextEditor';
import ImageUpload from '../ui/imageUpload';
import TagSelector from '../dashboard/blogs/tagSelector';
import { Loader2, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { BlogFormData } from '@/lib/types/blog';
import { ENDPOINTS } from '@/lib/api/endpoints';


interface BlogFormProps {
  blog?: any; // Blog existant pour modification
}


export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { tags } = useTags();
  const { redacteurs } = useRedacteurs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contenu, setContenu] = useState(blog?.contenu || '');
  const [selectedTags, setSelectedTags] = useState<number[]>(
    blog?.tags?.map((t: any) => t.id) || []
  );
  const [cover_image, setcover_image] = useState(blog?.cover_image || '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      titre: blog?.titre || '',
      resume: blog?.resume || '',
      contenu: blog?.contenu || '',
      cover_image: blog?.cover_image || '',
      redacteur_id: blog?.redacteur?.id || user?.id,
      tags: blog?.tags?.map((t: any) => t.id) || [],
      statut: blog?.statut || 'brouillon',
    },
  });

  const titre = watch('titre');

  const onSubmit = async (data: BlogFormData) => {
    if (!cover_image) {
      toast.error('Veuillez rajouter l\'image cover du blog');
      return;
    }

    if (selectedTags.length === 0) {
      toast.error('Veuillez sélectionner au moins un tag');
      return;
    }

    if (!user?.id) {
      toast.error('Utilisateur non authentifié');
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData : BlogFormData = {
        ...data,
        contenu,
        cover_image,
        tags: selectedTags,
        redacteur_id: data.redacteur_id || user?.id,
      };

      console.log("Voici le nouveau blog qui sera crée : ",blogData);

      if (blog) {
        await blogService.update(blog.id, blogData);
        toast.success('Article mis à jour avec succès !');
      } else {
        await blogService.create(blogData);
        toast.success('Article créé avec succès !');
      }

      router.push(ENDPOINTS.DASHBOARD_BLOGS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations principales */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Informations Principales</h2>

        <div className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'article <span className="text-red-500">*</span>
            </label>
            <input
              {...register('titre', { required: 'Le titre est obligatoire' })}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Ex: Le Début de l'année scolaire à ISDB"
            />
            {errors.titre && (
              <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
            )}
          </div>

          {/* Résumé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résumé <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('resume', {
                required: 'Le résumé est obligatoire',
                maxLength: {
                  value: 300,
                  message: 'Le résumé ne doit pas dépasser 300 caractères',
                },
              })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Un court résumé de votre article (150-300 caractères)"
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {watch('resume')?.length || 0} / 300 caractères
            </p>
          </div>

          {/* redacteur (Admin only) */}
          {isAdmin() && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                redacteur <span className="text-red-500">*</span>
              </label>
              <select
                {...register('redacteur_id', { required: 'L\'redacteur est obligatoire' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {redacteurs.map((redacteur) => (
                  <option key={redacteur.id} value={isAdmin() ? redacteur.id : user?.id}>
                    {redacteur.nom}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Image principale */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Image de Couverture</h2>
        <ImageUpload
          value={cover_image}
          onChange={setcover_image}
          label="Ajoutez une image de couverture attrayante"
        />
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Catégories</h2>
        <TagSelector
          tags={tags}
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Contenu de l'Article</h2>
        <RichTextEditor value={contenu} onChange={setContenu} />
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => setValue('statut', 'brouillon')}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer en brouillon
              </>
            )}
          </button>

          {isAdmin() && (
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setValue('statut', 'publie')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publication...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Publier l'article
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}