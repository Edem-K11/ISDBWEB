
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import BlogForm from '@/components/forms/blogForm'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NouveauBlogPage() {
  const router = useRouter();
  const { user } = useAuth();

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
          <h1 className="text-3xl font-bold text-gray-900">Nouvel Article</h1>
          <p className="text-gray-600 mt-1">Créez un nouveau contenu pour votre blog</p>
        </div>
      </div>

      {/* Formulaire */}
      <BlogForm />
    </div>
  );
}