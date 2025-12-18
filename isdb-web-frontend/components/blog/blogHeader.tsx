'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Tag } from '@/lib/types/tag';
import { ENDPOINTS } from '@/lib/api/endpoints';

interface BlogHeaderProps {
  titre: string;
  coverImage: string;
  tags: Tag[];
}

export default function BlogHeader({ titre, coverImage, tags }: BlogHeaderProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={coverImage}
          alt={titre}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
      
      {/* Overlay gradient amélioré */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />

      {/* Contenu par-dessus */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-white transition-colors duration-200"
            >
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={ENDPOINTS.BLOGS}
              className="hover:text-white transition-colors duration-200"
            >
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Article</span>
          </nav>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`${ENDPOINTS.BLOGS}/tag?tag=${tag.slug}`}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md 
                    border border-white/20 text-white text-sm font-medium
                    hover:bg-white/20 hover:border-white/30 
                    transition-all duration-300 hover:scale-105"
                >
                  #{tag.nom}
                </Link>
              ))}
            </div>
          )}

          {/* Titre */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
            font-bold text-white leading-tight 
            drop-shadow-2xl max-w-4xl">
            {titre}
          </h1>
        </div>
      </div>
    </div>
  );
}