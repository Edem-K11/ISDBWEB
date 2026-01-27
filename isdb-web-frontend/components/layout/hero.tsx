import Image from 'next/image';
import { lexendDeca } from "../ui/fonts";
import Breadcrumbs from './breadcrumbs';

// Hero Component
export default function HeroSection({
  title = "Titre par défaut",
  description = "Description par défaut",
  color = "blue",
  image_url,
  breadcrumbs = []
}: {
  title?: string;
  description?: string;
  color?: string;
  image_url?: string;
  breadcrumbs?: { label: string; href: string, active?: boolean }[];
}) {
  return (
    <header className="relative text-white py-32 overflow-hidden">
      {/* Background - Image ou Couleur */}
      {image_url ? (
        <>
          {/* Image de fond */}
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient noir à gauche */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </>
      ) : (
        /* Fond de couleur si pas d'image */
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(to right, rgb(30 41 59), ${getColorValue(color)})`
          }}
        />
      )}

      {/* Contenu */}
      <div className="container px-12 text-left relative z-10">
        <h1 className={`${lexendDeca.className} text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight`}>
          {title}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Breadcrumbs */}
      <div className="absolute bottom-5 left-12 z-10">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  );
}

// Fonction helper pour obtenir la valeur de couleur
function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    blue: 'rgb(191 219 254)',      // blue-200
    red: 'rgb(254 202 202)',        // red-200
    green: 'rgb(187 247 208)',      // green-200
    yellow: 'rgb(254 240 138)',     // yellow-200
    purple: 'rgb(233 213 255)',     // purple-200
    pink: 'rgb(251 207 232)',       // pink-200
    teal: 'rgb(153 246 228)',       // teal-200
    orange: 'rgb(254 215 170)',     // orange-200
    indigo: 'rgb(199 210 254)',     // indigo-200
  };
  
  return colors[color] || colors.blue;
}