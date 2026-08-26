'use client';

import { useRef } from 'react';
import { useBlogs } from '@/lib/hooks/useBlog';
import { Tag } from '@/lib/types/tag';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ENDPOINTS } from '@/lib/api/endpoints';

interface RelatedBlogsProps {
  currentBlogId: number;
  tags: Tag[];
}

export default function RelatedBlogs({ currentBlogId, tags }: RelatedBlogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Récupérer les blogs avec le premier tag
  const { blogs, isLoading } = useBlogs({
    tag: tags[0]?.slug,
  });

  // Filtrer pour exclure l'article actuel
  const relatedBlogs = blogs.filter((blog) => blog.id !== currentBlogId).slice(0, 6);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Lire notre prochain article</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-200 h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedBlogs.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Lire notre prochain article</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Article précédent"
            className="w-10 h-10 rounded-full border-2 border-isdb-green-600 text-isdb-green-600 flex items-center justify-center hover:bg-isdb-green-600 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Article suivant"
            className="w-10 h-10 rounded-full bg-isdb-green-600 text-white flex items-center justify-center hover:bg-isdb-green-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {relatedBlogs.map((blog) => (
          <Link
            key={blog.id}
            href={ENDPOINTS.BLOG_BY_SLUG(blog.slug)}
            className="group flex-shrink-0 w-64 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.titre}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="256px"
              />
              {blog.tags[0] && (
                <span
                  className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold bg-white/90"
                  style={{ color: blog.tags[0].couleur || '#206b38' }}
                >
                  {blog.tags[0].nom}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 group-hover:text-isdb-green-600 transition-colors line-clamp-2">
                {blog.titre}
              </h3>
              <p className="text-sm text-slate-500 mt-2">{blog.dateCreation}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
