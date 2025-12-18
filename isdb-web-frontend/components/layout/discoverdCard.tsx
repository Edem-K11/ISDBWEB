

// components/layout/discoverCard.tsx
'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface DiscoverCardProps {
  title: string;
  color: string;
  link: string;
}

export default function DiscoverCard({ title, color, link }: DiscoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link}>
      <div
        className={`relative overflow-hidden rounded-lg h-40 flex items-center justify-between cursor-pointer transition-all duration-300 group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ background: color }}
      >
        {/* Effet de vague subtil au survol */}
        <div className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide pl-6 pr-4 z-10 relative">
          {title}
        </h3>
        
        {/* Arrow icon avec animation améliorée */}
        <div className="pr-6 z-10 relative">
          <div className="relative">
            {/* Fond circulaire qui grossit */}
            <div className={`absolute inset-0 bg-white/20 rounded-full transition-transform duration-300 ${isHovered ? 'scale-125' : 'scale-100'}`} />
            
            {/* Flèche avec double animation */}
            <div className={`relative transition-all duration-500 ${isHovered ? 'translate-x-2 -translate-y-2 rotate-12' : ''}`}>
              <ArrowUpRight 
                size={32} 
                className="text-slate-900"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Ligne décorative au bas */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-slate-900/20 transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0 origin-left'}`} />
      </div>
    </Link>
  );
}