'use client';

import { useParams } from 'next/navigation';
import { useBlog } from '@/lib/hooks/useBlog';
import BlogHeader from '@/components/blog/blogHeader';
import BlogMeta from '@/components/blog/blogMeta';
import BlogContent from '@/components/blog/blogContent';
import RelatedBlogs from '@/components/blog/relatedBlogs';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import { Loader2 } from 'lucide-react';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { blog, isLoading, isError } = useBlog(slug);

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-isdb-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            Désolé, l'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <a
            href={ENDPOINTS.BLOGS}
            className="inline-flex items-center px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 transition-colors"
          >
            Retour au blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-25 md:py-30">
      <div className="container mx-auto max-w-4xl px-6 md:px-12">
        <div className="text-slate-500 mb-15">
          <Breadcrumbs
            breadcrumbs={[
              { label: 'Accueil', href: '/' },
              { label: 'Blog', href: ENDPOINTS.BLOGS },
              { label: blog.titre, href: ENDPOINTS.BLOG_BY_SLUG(blog.slug), active: true },
            ]}
          />
        </div>

        <BlogHeader
          titre={blog.titre}
          coverImage={blog.coverImage}
          tags={blog.tags}
          dateCreation={blog.dateCreation}
        />

        <div className="mt-10">
          <BlogMeta
            redacteur={blog.redacteur}
            dateCreation={blog.dateCreation}
            dateModification={blog.dateModification}
          />
        </div>

        <BlogContent contenu={blog.contenu} />

        {/* Article suivant */}
        <div className="mt-16">
          <RelatedBlogs currentBlogId={blog.id} tags={blog.tags} />
        </div>
      </div>
    </div>
  );
}
