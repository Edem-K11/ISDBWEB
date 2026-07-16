'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRadio } from '@/lib/hooks/useRadio';
import { Radio } from '@/lib/types/radio';
import RadioPlayer from '@/components/layout/radioPlayer';

interface RadioPlayerContextValue {
  radio: Radio | undefined;
  isLoading: boolean;
  isError: unknown;
  showPlayer: boolean;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
  closePlayer: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

/**
 * Fournit l'état de lecture de la radio à toute l'application, monté une seule
 * fois dans le layout racine. Ainsi le flux continue de jouer même en changeant
 * de page (le lecteur n'est plus démonté quand on quitte /radio).
 */
export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const { radio, isLoading, isError } = useRadio();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = useCallback(() => {
    if (!radio?.urlStream) {
      toast.error('Le flux radio n\'est pas disponible');
      return;
    }
    if (!radio?.enDirect) {
      toast.error('La radio est actuellement hors ligne');
      return;
    }
    setShowPlayer(true);
    setIsPlaying((prev) => !prev);
  }, [radio?.urlStream, radio?.enDirect]);

  const closePlayer = useCallback(() => {
    setShowPlayer(false);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    setIsMuted((wasMuted) => (newVolume > 0 ? false : wasMuted));
  }, []);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  return (
    <RadioPlayerContext.Provider
      value={{
        radio,
        isLoading,
        isError,
        showPlayer,
        isPlaying,
        volume,
        isMuted,
        togglePlay,
        closePlayer,
        setVolume,
        toggleMute,
      }}
    >
      {children}
      {showPlayer && radio && (
        <RadioPlayer
          radio={radio}
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onClose={closePlayer}
          volume={volume}
          onVolumeChange={setVolume}
          isMuted={isMuted}
          onMuteToggle={toggleMute}
        />
      )}
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayerContext() {
  const context = useContext(RadioPlayerContext);
  if (!context) {
    throw new Error('useRadioPlayerContext doit être utilisé à l\'intérieur de RadioPlayerProvider');
  }
  return context;
}
