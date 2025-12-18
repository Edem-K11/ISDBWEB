
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import BlogForm from '@/components/forms/blogForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { blogService } from '@/lib/api/services/blogService';

export default function ModifierBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const blogId = parseInt(params.id as string);

  // Récupérer le blog
  const { data: blog, error, isLoading } = useSWR(
    blogId ? ['blog', blogId] : null,
    () => blogService.getById(blogId)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Article introuvable</p>
        <Link href="/dashboard/blogs" className="text-indigo-600 hover:underline mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/blogs"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'Article</h1>
          <p className="text-gray-600 mt-1">{blog.titre}</p>
        </div>
      </div>

      {/* Formulaire */}
      <BlogForm blog={blog} />
    </div>
  );
}
