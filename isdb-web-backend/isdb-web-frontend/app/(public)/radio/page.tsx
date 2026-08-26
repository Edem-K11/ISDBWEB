'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download, Apple, Smartphone } from 'lucide-react';
import MyNavFloating from '@/components/layout/navbar2';
import Footer from '@/components/layout/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Radio {
  nom: string;
  url_stream: string;
  image: string;
  description: string;
  en_direct: boolean;
  message_app_mobile: string;
  app_store_url: string;
  play_store_url: string;
}

export default function RadioPage() {
  const [radio, setRadio] = useState<Radio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchRadio = async () => {
      try {
        const res = await fetch(`${API_URL}/radio`);
        const data = await res.json();
        setRadio(data.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRadio();
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!radio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Radio non disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <MyNavFloating />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-32 translate-x-32 blur-3xl" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">{radio.nom}</h1>
          <p className="text-xl text-blue-200">{radio.description}</p>

          {/* Live Badge */}
          {radio.en_direct && (
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-semibold">EN DIRECT</span>
            </div>
          )}
        </div>
      </section>

      {/* Player Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Player Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 text-center text-white">
            <div className="mb-8">
              {radio.image && (
                <img
                  src={radio.image}
                  alt={radio.nom}
                  className="w-32 h-32 mx-auto rounded-full mb-6 border-4 border-blue-400/50"
                />
              )}
            </div>

            <h2 className="text-3xl font-bold mb-2">{radio.nom}</h2>
            <p className="text-blue-200 mb-8">{radio.description}</p>

            {/* Audio Element (hidden) */}
            <audio
              ref={audioRef}
              src={radio.url_stream}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Play Button */}
            <button
              onClick={togglePlay}
              className="mx-auto flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-2xl hover:shadow-blue-500/50 mb-8"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </button>

            <p className="text-blue-200">
              {isPlaying ? 'En lecture...' : 'Cliquez pour écouter'}
            </p>
          </div>
        </div>
      </section>

      {/* App Mobile Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 text-white">
            <h2 className="text-4xl font-bold mb-4">Écoutez partout, anytime</h2>
            <p className="text-xl text-blue-200">
              Téléchargez notre application mobile pour une expérience de streaming optimisée
            </p>
          </div>

          {/* App Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* iOS */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-white hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <Apple className="w-12 h-12 text-gray-300" />
                <h3 className="text-2xl font-bold">iOS</h3>
              </div>
              <p className="text-blue-200 mb-6">
                Écoutez la radio ISDB directement depuis votre iPhone et iPad.
              </p>
              {radio.app_store_url && (
                <a
                  href={radio.app_store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger sur App Store
                </a>
              )}
            </div>

            {/* Android */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-white hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <Smartphone className="w-12 h-12 text-green-400" />
                <h3 className="text-2xl font-bold">Android</h3>
              </div>
              <p className="text-blue-200 mb-6">
                Écoutez la radio ISDB sur votre téléphone et tablette Android.
              </p>
              {radio.play_store_url && (
                <a
                  href={radio.play_store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger sur Google Play
                </a>
              )}
            </div>
          </div>

          {/* App Message */}
          {radio.message_app_mobile && (
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-2xl p-8 text-center text-white">
              <h3 className="text-xl font-bold mb-4">Contenu exclusif</h3>
              <p className="text-blue-100">{radio.message_app_mobile}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
