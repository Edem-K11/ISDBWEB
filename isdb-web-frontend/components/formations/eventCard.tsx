

// components/EventCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface EventCardProps {
  title: string;
  link: string;
  index: number;
}

export default function EventCard({
  title,
  link,
  index,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

//   Couleurs aléatoires pour les cartes
  const colors = [
    { bg: "from-isdb-green-50 to-isdb-green-100", accent: "bg-isdb-green-600", hover: "group-hover:bg-isdb-green-700", border: " border-isdb-green-200" },
    { bg: "from-isdb-orange-50 to-isdb-orange-100", accent: "bg-isdb-orange-600", hover: "group-hover:bg-isdb-orange-700", border: " border-isdb-orange-200" },
    { bg: "from-isdb-red-50 to-isdb-red-100", accent: "bg-isdb-red-600", hover: "group-hover:bg-isdb-red-700", border: " border-isdb-red-200" },
    { bg: "from-isdb-gold-50 to-isdb-gold-100", accent: "bg-isdb-gold-600", hover: "group-hover:bg-isdb-gold-700", border: " border-isdb-gold-200" }
  ];

  const color = colors[index % colors.length];

  return (
    <Link
      href={link}
      className={`group relative overflow-hidden rounded-3xl border-2 ${color.border} bg-gradient-to-br ${color.bg} p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fond animé avec gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      {/* Accent border en haut */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color.bg} ${color.accent}`}></div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col h-full min-h-64 justify-between">

        {/* Header avec icône */}
        <div className="mb-6">
          <div className={`${color.accent} inline-flex p-3 rounded-2xl mb-4 text-white`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9 3.756 9 7.747m0 0c0 4.244-3.5 7.747-9 7.747m0-13C6.5 6.253 3 9.756 3 14" />
            </svg>
          </div>

          {/* Titre avec animation */}
          <h3 className="text-3xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-950">
            {title}
          </h3>

          {/* Underline animée */}
          <div className={`h-1 bg-gradient-to-r ${color.bg} rounded-full transition-all duration-300 ${isHovered ? 'w-24' : 'w-12'}`}></div>
        </div>

        {/* Description et CTA */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Explorez nos formations spécialisées</p>

          {/* Flèche animée */}
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className={`${color.accent} text-white px-3 py-1 rounded-full text-xs font-semibold`}>Découvrir</span>
            <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'translate-x-1' : 'translate-x-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Décoration d'arrière-plan */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
        <div className={`w-full h-full rounded-full ${color.accent}`}></div>
      </div>
    </Link>
  );
}