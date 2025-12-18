

// components/layout/formationCard.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'lucide-react';

interface FormationCardProps {
  title: string;
  description: string;
  badge: string;
  link: string;
  highlights?: string[];
}

export default function FormationCard({ title, description, badge, link, highlights }: FormationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link}>
      <div
        className="relative py-8 px-6 cursor-pointer group border-2 border-gray-400 bg-white rounded-xl transition-all duration-500 ease-out mb-8 overflow-hidden hover:border-emerald-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Effet de fond animé au survol */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 transition-all duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}
        />
        
        {/* badge avec icône */}
        <div className="relative flex items-center gap-2 mb-6">
          <div className={`p-2 rounded-lg ${isHovered ? 'bg-emerald-100' : 'bg-slate-100'} transition-colors`}>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <span 
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isHovered ? 'bg-emerald-600 text-white scale-105' : 'bg-emerald-100 text-emerald-700'}`}
          >
            {badge}
          </span>
        </div>
        
        {/* Title avec effet de soulignement */}
        <div className="relative mb-6">
          <h3 
            className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 relative inline-block ${isHovered ? 'text-emerald-800' : 'text-slate-900'}`}
          >
            {title}
            <span 
              className={`absolute -bottom-2 left-0 h-1 bg-emerald-500 transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`}
            />
          </h3>
        </div>

        {/* Description avec effet d'apparition */}
        <p 
          className={`text-slate-700 text-base leading-relaxed mb-8 transition-all duration-500 ${isHovered ? 'translate-x-2 opacity-100' : 'translate-x-0 opacity-90'}`}
        >
          {description}
        </p>

        {/* Action avec effets avancés */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 relative">
          <div className="flex items-center gap-2">
            <span 
              className={`text-sm font-medium transition-all duration-400 flex items-center gap-2 ${isHovered ? 'text-emerald-700 translate-x-2 font-semibold' : 'text-slate-700'}`}
            >
              <div className={`p-1.5 rounded ${isHovered ? 'bg-emerald-100' : 'bg-slate-100'} transition-colors`}>
                <ArrowRight className="w-4 h-4" />
              </div>
              En savoir plus
            </span>
          </div>
          
          {/* Icônes d'highlights */}
          {highlights && (
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="flex items-center gap-1 text-sm text-slate-600">
                  {index === 0 && <Clock className="w-3 h-3" />}
                  {index === 1 && <GraduationCap className="w-3 h-3" />}
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points décoratifs */}
        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-100/50 group-hover:bg-emerald-100/80 transition-colors duration-500" />
        <div className="absolute -left-2 -bottom-2 w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors duration-500" />
      </div>
    </Link>
  );
}