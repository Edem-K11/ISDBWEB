'use client';

import Image from 'next/image';
import { useRef } from 'react';

// Logo en verre du hero avec reflet lumineux qui suit la souris (glassmorphic
// shine). Le ::before qui porte la lumière vit dans globals.css (.hero-glass-logo)
// et lit les variables --mouse-x/--mouse-y mises à jour ici en pourcentage.
export default function HeroGlassLogo({ className = '' }: Readonly<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`hero-glass-logo relative select-none ${className}`}
    >
      <Image src="/isdb-en-verre.png" alt="" fill className="object-contain opacity-[0.30]" />
    </div>
  );
}
