import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
        pathname: "/storage/**", // autorise seulement ce dossier si tu veux
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
    dangerouslyAllowSVG: true, // option sans importance pour toi
    unoptimized: true,         // ⬅️ IMPORTANT POUR DÉSACTIVER LE PROXY D'IMAGES EN LOCAL
  }
};

export default nextConfig;
