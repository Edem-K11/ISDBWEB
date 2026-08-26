'use client';

import Image from 'next/image';
import { Tag } from '@/lib/types/tag';

interface BlogHeaderProps {
  titre: string;
  coverImage: string;
  tags: Tag[];
  dateCreation?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';

  try {
    if (dateStr.includes('/')) return dateStr;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function BlogHeader({ titre, coverImage, tags, dateCreation }: BlogHeaderProps) {
  return (
    <div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${tag.couleur || '#206b38'}1A`,
                color: tag.couleur || '#206b38',
              }}
            >
              {tag.nom}
            </span>
          ))}
        </div>
      )}

      {dateCreation && <p className="text-sm text-slate-500 mb-3">{formatDate(dateCreation)}</p>}

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
        {titre}
      </h1>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
        <Image
          src={coverImage}
          alt={titre}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>
  );
}
