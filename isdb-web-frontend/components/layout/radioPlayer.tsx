'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Radio } from '@/lib/types/radio';
import { imageService } from '@/lib/api/services/imageService';

interface RadioPlayerProps {
  radio: Radio;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose?: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export default function RadioPlayer({
  radio,
  isPlaying,
  onPlayPause,
  onClose,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle
}: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'audio
  useEffect(() => {
    if (!radio?.urlStream) return;

    // Créer l'élément audio s'il n'existe pas
    if (!audioRef.current) {
      audioRef.current = new Audio(radio.urlStream);
    } else {
      audioRef.current.src = radio.urlStream;
    }

    // Configurer l'audio
    audioRef.current.preload = 'none';
    audioRef.current.volume = isMuted ? 0 : volume / 100;

    // Nettoyer à la destruction
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [radio?.urlStream]);

  // Gérer lecture/pause
  useEffect(() => {
    if (!audioRef.current || !radio?.urlStream) return;

    const handleAudioError = () => {
      console.error('Erreur de lecture audio');
    };

    audioRef.current.addEventListener('error', handleAudioError);

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Erreur de lecture:', error);
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.removeEventListener('error', handleAudioError);
    };
  }, [isPlaying, radio?.urlStream]);

  // Mettre à jour le volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
    if (newVolume > 0 && isMuted) {
      onMuteToggle();
    }
  };

  if (!radio?.urlStream) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
      {/* Fond flouté avec gradient */}
      <div className="absolute inset-0 backdrop-blur-xl bg-[#1a2f1a]/90 opacity-95"></div>      
      <div className="relative px-6 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          
          {/* Left Section - Image & Info */}
          <div className="flex items-center gap-4">
            {/* Image avec bordure décorative */}
            <div className="relative group">
              <div className="relative">
                <Image
                  src={radio?.image ? imageService.getUrl(radio.image) : '/logo_isdb.png'}
                  alt={radio?.nom || 'Radio ISDB'}
                  width={68}
                  height={68}
                  className="rounded-lg object-cover shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Radio Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">
                  {radio?.nom?.toUpperCase() || 'RADIO ISDB'}
                </h3>
                
                {/* Badge en direct */}
                {radio?.enDirect && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/30 blur-sm rounded-full"></div>
                    <span className="relative flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white text-xs font-semibold shadow-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        EN DIRECT
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white/80 text-sm mt-1 font-light tracking-wide">
                {radio?.description || 'Écoutez notre programmation exclusive'}
              </p>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-8">
            {/* Bouton Fermer (X) */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-2"
                title="Fermer le lecteur"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Play/Pause Button amélioré */}
            <button
              onClick={onPlayPause}
              className="relative group"
              disabled={!radio?.enDirect}
            >
              <div className={`relative w-14 h-14 ${
                radio?.enDirect 
                  ? 'bg-gradient-to-br from-[#8a9a5b] to-[#d4c9b8] hover:opacity-90' 
                  : 'bg-gray-400 cursor-not-allowed'
              } rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl`}>
                {isPlaying ? (
                  // Pause Icon
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  // Play Icon
                  <svg 
                    className="w-6 h-6 text-white ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
              {!radio?.enDirect && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">OFF</span>
                </div>
              )}
            </button>

            {/* Volume Control amélioré */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/10">
              {/* Volume Icon */}
              <button
                onClick={onMuteToggle}
                className="text-white hover:text-[#d4c9b8] transition-all duration-300 transform hover:scale-110"
                disabled={!radio?.enDirect}
              >
                {isMuted || volume === 0 ? (
                  // Muted Icon
                  <svg 
                    className="w-7 h-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
                    />
                  </svg>
                ) : volume < 50 ? (
                  // Low Volume Icon
                  <svg 
                    className="w-7 h-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                    />
                  </svg>
                ) : (
                  // High Volume Icon
                  <svg 
                    className="w-7 h-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                    />
                  </svg>
                )}
              </button>

              {/* Volume Slider */}
              <div className="w-40 relative">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8a9a5b] to-[#d4c9b8] rounded-full transition-all duration-200"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  disabled={!radio?.enDirect}
                  className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {/* Volume Percentage */}
              <span className="text-white font-bold text-sm min-w-[45px] text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Style personnalisé pour le range input */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: white;
          border: 3px solid #8a9a5b;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }

        input[type="range"]::-webkit-slider-thumb:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: white;
          border: 3px solid #8a9a5b;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }

        input[type="range"]::-moz-range-thumb:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}