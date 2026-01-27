

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
      className= {`group relative block p-8 border bg-gradient-to-br ${color.bg} ${color.hover} ${color.border} hover:-translate-y-[2px] hover:shadow-lg transition-shadow duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenu principal */}
      <div className="space-y-8">
        
        {/* Titre avec animation de soulignement */}
        <div className="relative">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 transition-all duration-300 group-hover:text-black">
            {title}
          </h3>
          <div
            className={`absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300 ${
              isHovered ? "w-full" : "w-0"
            }`}
          />
        </div>

        <p className="text-sm font-medium">Découvrez les offres de formations</p>

      </div>

      {/* Flèche animée en bas à droite */}
      <div className="absolute bottom-4 right-4">
        <div className="relative h-6 w-6">
          {/* Queue de la flèche */}
          <div
            className={`absolute right-0 bottom-0 h-[4px] rotate-45 -translate-x-[1px] -translate-y-[1px] bg-black transition-all duration-300 ${
              isHovered ? "w-4" : "w-6"
            }`}
            style={{ transformOrigin: "right bottom" }}
          />

          {/* Points des branches pour l'effet d'allongement */}
          <div
            className={`absolute right-0 bottom-0 h-[4px] translate-y-[1px] bg-black rotate-90 transition-all duration-300 ${
              isHovered ? "w-8 " : "w-6"
            }`}
            style={{ transformOrigin: "right center" }}
          />
          <div
            className={`absolute right-0 bottom-0 h-[4px] translate-x-[1px] bg-black transition-all duration-300 ${
              isHovered ? "w-8" : "w-6"
            }`}
            style={{ transformOrigin: "right center" }}
          />
        </div>
      </div>
    </Link>
  );
}