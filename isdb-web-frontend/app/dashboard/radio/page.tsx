

'use client';

import { useState, useEffect } from 'react';
import { useRadio } from '@/lib/hooks/useRadio';
import { radioService } from '@/lib/api/services/radioService';
import ImageUpload from '@/components/ui/imageUpload';
import { toast } from 'react-hot-toast';
import {
  Radio as RadioIcon,
  Volume2,
  Globe,
  Music,
  Edit,
  Save,
  Power,
  Play,
  Pause,
  Loader2,
  RefreshCw,
  AlertCircle,
  Eye,
  Upload,
  Trash2
} from 'lucide-react';
import { mutate } from 'swr';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function RadioDashboardPage() {
  const { radio, isLoading, mutate: mutateRadio } = useRadio();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(typeof Audio !== 'undefined' ? new Audio() : null);
  const [volume, setVolume] = useState(0.7);

  const [formData, setFormData] = useState({
    nom: '',
    urlStream: '',
    description: '',
    image: ''
  });

  // Charger les données de la radio
  useEffect(() => {
    if (radio) {
      setFormData({
        nom: radio.nom || '',
        urlStream: radio.urlStream || '',
        description: radio.description || '',
        image: radio.image || ''
      });
      
      // Configurer l'audio pour le preview
      if (audio && radio.urlStream) {
        audio.src = radio.urlStream;
        audio.volume = volume;
        audio.preload = 'none';
        
        audio.onplaying = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          toast.error('Erreur de lecture du flux radio');
        };
      }
    }
  }, [radio, audio, volume]);

  // Gérer la lecture audio
  useEffect(() => {
    if (!audio) return;
    
    audio.volume = volume;
  }, [volume, audio]);

  const handlePlayPause = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Erreur de lecture:', error);
        toast.error('Impossible de lire le flux radio');
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleLive = async () => {
    if (!radio) return;
    
    setIsToggling(true);
    try {
      await radioService.toggleLive();
      await mutateRadio();
      toast.success(
        radio.enDirect 
          ? 'La radio est maintenant hors ligne' 
          : 'La radio est maintenant en direct !'
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de statut');
    } finally {
      setIsToggling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      toast.error('Le nom de la radio est requis');
      return;
    }
    
    if (!formData.urlStream.trim()) {
      toast.error('L\'URL du flux est requise');
      return;
    }

    setIsUpdating(true);
    try {
      await radioService.update({
        nom: formData.nom.trim(),
        urlStream: formData.urlStream.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image || null
      });

      await mutateRadio();
      await mutate('radio');
      
      toast.success('Paramètres de la radio mis à jour avec succès');
      setIsEditing(false);
      
      // Recharger l'audio avec la nouvelle URL
      if (audio && formData.urlStream) {
        audio.src = formData.urlStream;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const resetToDefaults = () => {
    if (radio) {
      setFormData({
        nom: radio.nom || '',
        urlStream: radio.urlStream || '',
        description: radio.description || '',
        image: radio.image || ''
      });
    }
    setIsEditing(false);
  };

  const testStream = () => {
    if (!formData.urlStream) {
      toast.error('Veuillez d\'abord saisir une URL de flux');
      return;
    }
    
    const testAudio = new Audio();
    testAudio.src = formData.urlStream;
    testAudio.volume = 0.1;
    testAudio.preload = 'none';
    
    testAudio.oncanplaythrough = () => {
      toast.success('Flux radio testé avec succès !');
      testAudio.play().then(() => {
        setTimeout(() => testAudio.pause(), 2000);
      }).catch(() => {
        toast.error('Flux détecté mais erreur de lecture');
      });
    };
    
    testAudio.onerror = () => {
      toast.error('Impossible de se connecter au flux radio');
    };
    
    testAudio.load();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Radio</h1>
          <p className="text-gray-600 mt-1">
            Gérez les paramètres et le statut de la radio de l'institut
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href={ENDPOINTS.RADIO}
            target="_blank"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            Voir la page publique
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Carte de statut et contrôle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statut de la radio */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${radio?.enDirect ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <RadioIcon className={`h-6 w-6 ${radio?.enDirect ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{radio?.nom || 'Radio ISDB'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      radio?.enDirect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {radio?.enDirect ? '● En direct' : 'Hors ligne'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dernière mise à jour: {radio ? new Date(radio.updatedAt).toLocaleTimeString('fr-FR') : '...'}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleToggleLive}
                disabled={isToggling}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  radio?.enDirect
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {isToggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Power size={16} />
                    {radio?.enDirect ? 'Mettre hors ligne' : 'Mettre en direct'}
                  </>
                )}
              </button>
            </div>

            {radio?.description && (
              <div className="mb-6">
                <p className="text-gray-600">{radio.description}</p>
              </div>
            )}

            {/* Contrôle audio de test */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Test du flux radio</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  disabled={!radio?.urlStream}
                  className="px-4 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Pause' : 'Écouter'}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 size={20} className="text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 w-10">{Math.round(volume * 100)}%</span>
                  </div>
                </div>

                <button
                  onClick={testStream}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Tester
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>URL actuelle: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{radio?.urlStream || 'Non définie'}</code></p>
              </div>
            </div>
          </div>

          {/* Formulaire d'édition */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuration de la radio</h2>
              <button
                onClick={() => isEditing ? resetToDefaults() : setIsEditing(true)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Trash2 size={16} />
                    Annuler
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Modifier
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom de la radio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la radio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="Ex: Radio ISDB, Studio FM..."
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* URL du flux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du flux audio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Globe className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="url"
                    value={formData.urlStream}
                    onChange={(e) => handleChange('urlStream', e.target.value)}
                    placeholder="https://exemple.com/radio-stream.mp3"
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Format supporté: MP3, AAC, OGG. Utilisez une URL stable et permanente.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez votre radio, sa programmation, ses animateurs..."
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.description.length}/500 caractères
                </p>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de la radio
                </label>
                <div className={!isEditing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url: string) => handleChange('image', url)}
                    label="Télécharger un logo"
                    type="radio"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Format recommandé: PNG ou JPG, 500×500 pixels. Maximum 2MB.
                </p>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar avec informations et aide */}
        <div className="space-y-6">
          {/* Informations techniques */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Music size={18} />
              Informations techniques
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut actuel:</span>
                <span className={`font-medium ${
                  radio?.enDirect ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {radio?.enDirect ? 'En direct' : 'Hors ligne'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flux disponible:</span>
                <span className={radio?.urlStream ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {radio?.urlStream ? '✓ Connecté' : '✗ Non défini'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Logo uploadé:</span>
                <span className={radio?.image ? 'text-green-600 font-medium' : 'text-gray-600'}>
                  {radio?.image ? '✓ Oui' : 'Non'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Créée le:</span>
                <span>{radio ? new Date(radio.createdAt).toLocaleDateString('fr-FR') : '...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière modification:</span>
                <span>{radio ? new Date(radio.updatedAt).toLocaleDateString('fr-FR') : '...'}</span>
              </div>
            </div>
          </div>

          {/* Aide et conseils */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-4">💡 Conseils techniques</h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                <span>Utilisez un flux MP3 stable (bitrate recommandé: 128kbps)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                <span>Testez toujours le flux avant de le mettre en direct</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                <span>Le logo doit être carré pour un affichage optimal</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                <span>Mettez "Hors ligne" pendant la maintenance</span>
              </li>
            </ul>
          </div>

          {/* Statut rapide */}
          {/* <div className="bg-gradient-to-r from-purple-400 to-purple-300 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <RadioIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Radio en ligne</h3>
                <p className="text-blue-100 text-sm">Statut de diffusion</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white-100">Auditeurs connectés:</span>
                <span className="font-bold">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white-100">Qualité audio:</span>
                <span className="font-bold">HD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white-100">Uptime:</span>
                <span className="font-bold">99.8%</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${radio?.enDirect ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm">
                  {radio?.enDirect ? 'Diffusion en cours' : 'En pause'}
                </span>
              </div>
            </div>
          </div> */}

          {/* Liens rapides */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">Liens rapides</h3>
            <div className="space-y-2">
              <a
                href={ENDPOINTS.RADIO}
                target="_blank"
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center transition-colors text-sm"
              >
                Voir la page publique
              </a>
              <a
                href="https://icecast.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center transition-colors text-sm"
              >
                Documentation Icecast
              </a>
              <button
                onClick={() => window.open('https://www.streamsolutions.co.uk/resources/free-radio-streaming-servers/', '_blank')}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center transition-colors text-sm"
              >
                Serveurs de streaming gratuits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec avertissements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">Important - Droits de diffusion</h4>
            <p className="text-yellow-800 text-sm">
              Assurez-vous de posséder les droits de diffusion de tout le contenu diffusé sur cette radio.
              L'institut est responsable du respect des droits d'auteur et des licences de diffusion.
              En cas de doute, consultez un expert en droit des médias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}