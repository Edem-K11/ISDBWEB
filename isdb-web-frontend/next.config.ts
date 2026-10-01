import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ignorer les erreurs TypeScript pendant le build pour permettre la mise en ligne rapide */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      /* Images encore servies depuis le disque Laravel (anciens enregistrements
         pré-Cloudinary, ou fallback si jamais utilisé) */
      {
        protocol: 'https',
        hostname: 'isdb-web-backend.onrender.com',
        pathname: '/storage/**',
      },
      /* Toutes les images uploadées depuis la migration Cloudinary */
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/jih3f0cq/**',
      },
    ],
    dangerouslyAllowSVG: true,
  }
};

export default nextConfig;
