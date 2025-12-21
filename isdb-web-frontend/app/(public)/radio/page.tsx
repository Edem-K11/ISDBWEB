'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRadio } from '@/lib/hooks/useRadio';
import RadioPlayer from '@/components/layout/radioPlayer';
import { Calendar, Loader2, Radio as RadioIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RadioPage() {
  const { radio, isLoading, isError } = useRadio();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayClick = () => {
    console.log('Play button clicked'); 
    if (!radio?.urlStream) {
      toast.error('Le flux radio n\'est pas disponible');
      return;
    }

    if (!radio?.enDirect) {
      toast.error('La radio est actuellement hors ligne');
      return;
    }

    setShowPlayer(true);
    console.log('show player set to true');
    setIsPlaying(true);
    console.log('isPlaying set to', isPlaying);

  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!radio?.enDirect) {
      toast.error('La radio est actuellement hors ligne');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f3ef] to-[#e8e4dd] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-isdb-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la radio...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f3ef] to-[#e8e4dd] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RadioIcon className="text-red-600" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Radio non disponible</h2>
          <p className="text-gray-600 mb-6">
            La radio de l'institut est temporairement indisponible. Veuillez réessayer plus tard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-red-500 text-white rounded-lg hover:bg-isdb-red-600 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3ef] to-[#e8e4dd]">
      <div className="p-6 lg:p-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-8 lg:mt-12 mb-12 lg:mb-16">
          {/* Hero Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-isdb-red-500/10 rounded-lg">
                <RadioIcon className="w-4 h-4 text-isdb-red-500" />
              </div>
              <span className="text-isdb-red-500 text-sm font-medium opacity-70">Radio en diffusion</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Écoutez la <span className="text-isdb-red-500">Radio ISDB</span> en direct
            </h1>
          
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {radio?.description || 'La radio officielle de l\'Institut Supérieur, diffusez nos émissions éducatives, culturelles et informatives en continu.'}
            </p>
            
            {/* Bouton Play Principal avec oscillations intégrées */}
            <div className="relative flex flex-col items-start gap-3 mt-4">
              {/* Conteneur des oscillations */}
              <div className="absolute w-full h-32 flex items-center justify-center -top-6">
                {isPlaying ? (
                  /* Oscillations en courbes animées */
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 800 120" 
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Courbe 1 - Plus épaisse */}
                    <path
                      d="M0,60 Q100,20 200,60 T400,60 T600,60 T800,60"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="3"
                      className="animate-wave-path"
                    />
                    {/* Courbe 2 - Moyenne */}
                    <path
                      d="M0,60 Q100,80 200,60 T400,60 T600,60 T800,60"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      className="animate-wave-path-2"
                    />
                    {/* Courbe 3 - Fine */}
                    <path
                      d="M0,60 Q100,50 200,60 T400,60 T600,60 T800,60"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      className="animate-wave-path-3"
                    />
                    
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  /* Ligne rouge fine statique quand la radio ne joue pas */
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-isdb-red-500 to-transparent opacity-30" />
                )}
              </div>

              {/* Bouton Play/Pause - Déplacé vers le bas */}
              <div className="relative z-10 mt-10">
                <button
                  onClick={handlePlayClick}
                  disabled={!radio?.enDirect || !radio?.urlStream}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    radio?.enDirect && radio?.urlStream
                      ? 'bg-gradient-to-br from-isdb-red-500 to-isdb-red-600 hover:scale-110 shadow-2xl cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {/* Anneaux concentriques animés */}
                  {isPlaying && (
                    <>
                      <div className="absolute w-24 h-24 rounded-full border-2 border-white/30 animate-ping" />
                      <div className="absolute w-24 h-24 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  
                  {/* Icône Play/Pause en BLANC */}
                  {isPlaying ? (
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Message indicatif */}
                <p className="text-gray-600 text-sm ml-2 mt-3">
                  {radio?.enDirect 
                    ? 'Cliquez pour lancer la diffusion' 
                    : 'Radio actuellement hors ligne'}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image - Section droite rapprochée du bord */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-6 lg:-mr-10">
            {/* Statut Badge - AU DESSUS DE L'IMAGE */}
            <div className={`px-6 py-3 rounded-full flex items-center gap-3 ${
              radio?.enDirect 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                : 'bg-gray-300 text-gray-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${radio?.enDirect ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
              <span className="font-semibold">
                {radio?.enDirect ? 'ON AIR' : 'HORS LIGNE'}
              </span>
            </div>

            {/* Microphone Container - Image collée au bord droit */}
            <div className="flex items-center justify-center relative">
              <div className="absolute w-64 h-64 lg:w-100 lg:h-100 bg-gradient-to-br from-isdb-green-400 to-isdb-green-500 rounded-full opacity-80 blur-xl" />
              <div className="relative w-64 h-64 lg:w-100 lg:h-100 bg-gradient-to-br from-isdb-green-400 to-isdb-green-500 rounded-full flex items-center justify-center">
                  <Image
                    src="/mic.png"
                    alt="Microphone"
                    width={500}
                    height={500}
                    className="object-contain z-10"
                    priority
                  />
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-isdb-red-500/20 rounded-full blur-md" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-isdb-green-500/20 rounded-full blur-md" />
            </div>
          </div>
        </div>

        {/* Programmation Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Calendar className="text-isdb-red-500" size={24} />
            Programmation de la journée
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { time: '08:00 - 10:00', title: 'Le réveil musical', host: 'DJ Kader', live: false },
              { time: '10:00 - 12:00', title: 'Les nouveautés', host: 'Sarah M.', live: false },
              { time: '12:00 - 14:00', title: 'Le journal de midi', host: 'La rédaction', live: true },
              { time: '14:00 - 16:00', title: 'Afternoon chill', host: 'DJ Peace', live: false },
              { time: '16:00 - 18:00', title: 'Talk show éducatif', host: 'Prof. Diallo', live: false },
              { time: '18:00 - 20:00', title: 'Hit parade', host: 'Moussa', live: false },
            ].map((show, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border transition-all hover:shadow-md ${
                  show.live 
                    ? 'border-isdb-red-500 bg-gradient-to-r from-red-50 to-red-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{show.title}</h3>
                    <p className="text-sm text-gray-600">{show.host}</p>
                  </div>
                  {show.live && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{show.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-isdb-green-500 to-isdb-green-600 text-white rounded-2xl p-8 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">À propos de Radio ISDB</h2>
            <p className="mb-6 opacity-90 leading-relaxed">
              La Radio ISDB est la voix officielle de l'Institut Supérieur. Notre mission est d'éduquer, 
              informer et divertir notre communauté étudiante. Nous diffusons 24h/24 une programmation variée 
              incluant des émissions éducatives, des débats, de la musique et des nouvelles de l'institut.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-80">Diffusion continue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">HQ</div>
                <div className="text-sm opacity-80">Haute qualité audio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-80">Contenu éducatif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Étudiants</div>
                <div className="text-sm opacity-80">Animateurs étudiants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Comment écouter</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-isdb-red-500/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-isdb-red-500 text-sm font-bold">1</span>
                  </div>
                  <span>Cliquez sur le bouton rouge pour lancer la diffusion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-isdb-red-500/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-isdb-red-500 text-sm font-bold">2</span>
                  </div>
                  <span>Le lecteur s'affichera en bas de la page</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-isdb-red-500/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-isdb-red-500 text-sm font-bold">3</span>
                  </div>
                  <span>Utilisez les contrôles pour ajuster le volume ou mettre en pause</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Support technique</h3>
              <p className="text-gray-600 mb-4">
                En cas de problème de lecture, vérifiez votre connexion internet ou rafraîchissez la page.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Format audio:</span>
                  <span className="font-semibold">MP3 (128 kbps)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compatibilité:</span>
                  <span className="font-semibold">Tous les navigateurs modernes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support:</span>
                  <a href="mailto:tech@isdb.local" className="text-isdb-red-500 hover:underline">
                    tech@isdb.local
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            © {new Date().getFullYear()} {radio?.nom || 'Radio ISDB'}. Tous droits réservés.
          </p>
          <p>
            <Link href="/dashboard" className="text-isdb-red-500 hover:underline mr-4">
              Administration
            </Link>
            •
            <Link href="/" className="text-isdb-red-500 hover:underline ml-4">
              Accueil
            </Link>
          </p>
        </div>
      </div>

      {/* Radio Player (conditionnel) */}
      {showPlayer && radio && (
        <RadioPlayer
          radio={radio}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onClose={handleClosePlayer}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
        />
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes wave-path {
          0% {
            d: path("M0,60 Q100,20 200,60 T400,60 T600,60 T800,60");
          }
          50% {
            d: path("M0,60 Q100,100 200,60 T400,60 T600,60 T800,60");
          }
          100% {
            d: path("M0,60 Q100,20 200,60 T400,60 T600,60 T800,60");
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-wave-path {
          animation: wave-path-1 3s ease-in-out infinite;
        }
        
        .animate-wave-path-2 {
          animation: wave-path-2 2.5s ease-in-out infinite;
        }
        
        .animate-wave-path-3 {
          animation: wave-path-3 3.5s ease-in-out infinite;
        }
        
        @keyframes wave-path-1 {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          75% {
            transform: translateY(8px);
          }
        }
        
        @keyframes wave-path-2 {
          0%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(10px);
          }
          70% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes wave-path-3 {
          0%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          80% {
            transform: translateY(5px);
          }
        }
      `}</style>
    </div>
  );
}