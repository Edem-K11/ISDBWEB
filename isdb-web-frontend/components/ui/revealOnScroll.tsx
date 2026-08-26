'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Fait apparaître son contenu (fondu + léger déplacement vers le haut) quand il
// entre dans le viewport, via IntersectionObserver. Se déclenche une seule fois
// (l'observer se désabonne dès l'apparition) : pas de ré-animation au scroll
// arrière. `delay` (ms) sert à décaler les éléments d'une même grille pour un
// effet en cascade.
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
}: Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? 'reveal-on-scroll-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
