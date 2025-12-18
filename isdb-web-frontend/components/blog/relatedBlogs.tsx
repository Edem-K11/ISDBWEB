
'use client';

import { useBlogs } from '@/lib/hooks/useBlog';
import { Tag } from '@/lib/types/tag';
import Link from 'next/link';
import Image from 'next/image';
import { ENDPOINTS } from '@/lib/api/endpoints';

interface RelatedBlogsProps {
  currentBlogId: number;
  tags: Tag[];
}

export default function RelatedBlogs({ currentBlogId, tags }: RelatedBlogsProps) {
  // Récupérer les blogs avec le premier tag
  const { blogs, isLoading } = useBlogs({
    tag: tags[0]?.slug,
  });

  // Filtrer pour exclure l'article actuel et limiter à 3
  const relatedBlogs = blogs
    .filter(blog => blog.id !== currentBlogId)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedBlogs.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedBlogs.map(blog => (
          <Link
            key={blog.id}
            href={ENDPOINTS.BLOG_BY_SLUG(blog.slug)}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.titre}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                {blog.tags.slice(0, 1).map(tag => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {tag.nom}
                  </span>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {blog.titre}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {blog.dateCreation}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}