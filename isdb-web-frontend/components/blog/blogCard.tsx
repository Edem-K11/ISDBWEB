'use client';

import { ENDPOINTS } from "@/lib/api/endpoints";
import { Blog } from "@/lib/types/blog";
import { truncateText } from "@/lib/utils/truncateText";
import Link from "next/link";
import Image from "next/image";


// ============================================
// COMPOSANT CARTE BLOG
// ============================================

export default function BlogCard({ article }: { article: Blog }) {
  // Tronquer le titre après 100 caractères
  const truncatedTitre = truncateText(article.titre, 100);

  return (
    <Link href={ENDPOINTS.BLOG_BY_SLUG(article.slug)}>
      <article className="group cursor-pointer bg-white hover:shadow-md rounded-xl border border-slate-300 mb-10 hover:border-slate-400 overflow-hidden transition-all duration-300 h-full">
        <div className="flex flex-col md:flex-row gap-10 px-6 py-8 h-full">
          {/* Contenu textuel */}
          <div className="flex flex-1 flex-col justify-between">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 2).map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border border-slate-400 text-slate-700 bg-slate-50"
                >
                  {tag.nom}
                </span>
              ))}
              {article.tags.length > 2 && (
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 border border-gray-300 text-gray-600">
                  +{article.tags.length - 2}
                </span>
              )}
            </div>

            {/* Titre */}
            <h3
              className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors"
              title={article.titre}
            >
              {truncatedTitre}
            </h3>

            {/* Résumé */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.resume}
            </p>

            {/* redacteur et date */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {article.redacteur?.avatar ? (
                  <Image
                    src={article.redacteur.avatar}
                    alt={article.redacteur.nom}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {article.redacteur?.nom.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-700 font-medium">
                  {article.redacteur?.nom ?? "Rédacteur inconnu"}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {article.dateModification}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-80 h-48 md:h-58 relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
            <Image
              src={article.coverImage}
              alt={article.titre}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}
