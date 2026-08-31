

// components/EventCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { getMentionThemePalette } from "@/lib/utils/mentionTheme";

interface EventCardProps {
  title: string;
  link: string;
  theme?: string;
}

export default function EventCard({
  title,
  link,
  theme,
}: Readonly<EventCardProps>) {
  const [isHovered, setIsHovered] = useState(false);

  // Couleur alignée sur le thème de la mention (identique à sa page de détail)
  const color = getMentionThemePalette(theme);

  return (
    <Link
      href={link}
      className= {`group relative block p-8 border bg-gradient-to-br ${color.cardGradient} ${color.cardHover} ${color.borderStrong} hover:-translate-y-[2px] hover:shadow-lg transition-shadow duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenu principal */}
      <div className="space-y-8">

        {/* Titre avec animation de soulignement */}
        <div className="relative">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-10 transition-all duration-300 group-hover:text-black">
            {title}
          </h3>
          <div
            className={`absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300 ${
              isHovered ? "w-full" : "w-0"
            }`}
          />
        </div>

        <p className="text-[12px] sm:text-sm font-medium">Découvrez les offres de formations</p>

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