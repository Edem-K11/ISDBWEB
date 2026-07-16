

// components/layout/formationCard.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getMentionThemePalette } from '@/lib/utils/mentionTheme';

interface FormationCardProps {
  title: string;
  description: string;
  badge: string;
  link: string;
  highlights?: string[];
  theme?: string;
}

export default function FormationCard({ title, description, badge, link, highlights, theme }: FormationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = getMentionThemePalette(theme);

  return (
    <Link href={link}>
      <div
        className={cn(
          'relative py-8 px-6 cursor-pointer group border-2 border-gray-400 bg-white rounded-xl transition-all duration-500 ease-out mb-8 overflow-hidden hover:shadow-xl',
          colors.hoverBorderStrong
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Effet de fond animé au survol */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-0 transition-all duration-700',
            colors.cardGradient,
            isHovered ? 'opacity-60 translate-x-0' : '-translate-x-full'
          )}
        />

        {/* badge avec icône */}
        <div className="relative flex items-center gap-2 mb-6">
          <div className={cn('p-2 rounded-lg transition-colors', isHovered ? colors.bg : 'bg-slate-100')}>
            <BookOpen className={cn('w-4 h-4', colors.text)} />
          </div>
          <span
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300',
              isHovered ? cn(colors.accentBg, 'text-white scale-105') : cn(colors.bg, colors.text)
            )}
          >
            {badge}
          </span>
        </div>

        {/* Title avec effet de soulignement */}
        <div className="relative mb-6">
          <h3
            className={cn(
              'text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 relative inline-block',
              isHovered ? colors.text : 'text-slate-900'
            )}
          >
            {title}
            <span
              className={cn(
                'absolute -bottom-2 left-0 h-1 transition-all duration-500',
                colors.accentBg,
                isHovered ? 'w-full' : 'w-0'
              )}
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
              className={cn(
                'text-sm font-medium transition-all duration-400 flex items-center gap-2',
                isHovered ? cn(colors.text, 'translate-x-2 font-semibold') : 'text-slate-700'
              )}
            >
              <div className={cn('p-1.5 rounded transition-colors', isHovered ? colors.bg : 'bg-slate-100')}>
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
        <div className={cn('absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500', colors.bg)} />
        <div className={cn('absolute -left-2 -bottom-2 w-10 h-10 rounded-full transition-colors duration-500', colors.bg)} />
      </div>
    </Link>
  );
}
