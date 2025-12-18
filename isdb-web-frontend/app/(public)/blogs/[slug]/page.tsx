'use client';

import { useParams } from 'next/navigation';
import { useBlog } from '@/lib/hooks/useBlog';
import BlogHeader from '@/components/blog/blogHeader';
import BlogMeta from '@/components/blog/blogMeta';
import BlogContent from '@/components/blog/blogContent';
import RelatedBlogs from '@/components/blog/relatedBlogs';
import { Loader2 } from 'lucide-react';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { blog, isLoading, isError } = useBlog(slug);

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            Désolé, l'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <a
            href={ENDPOINTS.BLOGS}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retour au blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de couverture */}
      <BlogHeader
        titre={blog.titre}
        coverImage={blog.coverImage}
        tags={blog.tags}
      />

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Métadonnées (redacteur, dates, tags) */}
        <BlogMeta
          redacteur={blog.redacteur}
          dateCreation={blog.dateCreation}
          dateModification={blog.dateModification}
        />

        {/* Contenu du blog (Markdown) */}
        <BlogContent contenu={blog.contenu} />

        {/* Séparateur */}
        <div className="my-12 border-t border-gray-200" />

        {/* Articles similaires (optionnel) */}
        <RelatedBlogs
          currentBlogId={blog.id}
          tags={blog.tags}
        />
      </div>
    </div>
  );
}
