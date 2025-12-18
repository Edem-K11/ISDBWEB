'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Upload, Check, X as XIcon, Eye, EyeOff } from 'lucide-react';
import { redacteurService } from '@/lib/api/services/redacteurService';
import { RedacteurFormData } from '@/lib/types/redacteur';
import { imageService } from '@/lib/api/services/imageService';
import toast from 'react-hot-toast';

interface RedacteurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  redacteur?: any;
  onSuccess: () => void;
}

export default function RedacteurFormModal({
  isOpen,
  onClose,
  redacteur,
  onSuccess,
}: RedacteurFormModalProps) {
  const [formData, setFormData] = useState<(RedacteurFormData & { est_actif: boolean }) & { password: string }>({
    nom: '',
    email: '',
    bio: '',
    avatar: '',
    password: '',
    role: 'redacteur',
    est_actif: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nouvel état pour afficher/masquer le mot de passe

  useEffect(() => {
    if (redacteur) {
      setFormData({
        nom: redacteur.nom || '',
        email: redacteur.email || '',
        bio: redacteur.bio || '',
        avatar: redacteur.avatar || '',
        password: '',
        role: redacteur.role || 'redacteur',
        est_actif: redacteur.est_actif !== undefined ? redacteur.est_actif : true,
      });
    } else {
      setFormData({
        nom: '',
        email: '',
        bio: '',
        avatar: '',
        password: '',
        role: 'redacteur',
        est_actif: true,
      });
    }
  }, [redacteur, isOpen]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const { url } = await imageService.upload(file, 'redacteurs');
      setFormData({ ...formData, avatar: url });
      toast.success('Avatar uploadé !');
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = { ...formData };
      // Ne pas envoyer le password s'il est vide en mode édition
      const payload = redacteur && !dataToSend.password
        ? (({ password, ...rest }: typeof dataToSend) => rest)(dataToSend)
        : dataToSend;
      console.log('Rédacteur enregistré :', payload);

      if (redacteur) {
        await redacteurService.update(redacteur.id, payload);
        toast.success('Rédacteur mis à jour avec succès');
      } else {
        await redacteurService.create(payload);
        toast.success('Rédacteur créé avec succès');
      }
      onSuccess();
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 z-10 my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {redacteur ? 'Modifier le rédacteur' : 'Nouveau rédacteur'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <img
                  src={imageService.getUrl(formData.avatar)}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-gray-200">
                  {formData.nom.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploadingAvatar ? 'Upload...' : 'Changer l\'avatar'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF (max 5MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Courte biographie..."
              />
            </div>

            {/* Toggle est_actif */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Statut du rédacteur</h4>
                <p className="text-sm text-gray-500">
                  {formData.est_actif 
                    ? 'Le rédacteur peut créer et modifier des articles' 
                    : 'Le rédacteur est désactivé et ne peut pas publier'
                  }
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, est_actif: !formData.est_actif })}
                className={`
                  relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${formData.est_actif 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              >
                <span className="sr-only">est_actif</span>
                <span className={`
                  inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300
                  ${formData.est_actif ? 'translate-x-9' : 'translate-x-1'}
                `}>
                  {formData.est_actif ? (
                    <Check className="w-4 h-4 mx-auto mt-1 text-green-500" />
                  ) : (
                    <XIcon className="w-4 h-4 mx-auto mt-1 text-gray-400" />
                  )}
                </span>
              </button>
            </div>

            {/* Badge de statut */}
            <div className="flex items-center gap-2">
              <div className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                ${formData.est_actif 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }
              `}>
                {formData.est_actif ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Actif
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Inactif
                  </>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {formData.est_actif 
                  ? 'Ce rédacteur est actuellement actif' 
                  : 'Ce rédacteur est actuellement inactif'
                }
              </span>
            </div>

            {/* Mot de passe avec toggle de visibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe {!redacteur && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!redacteur}
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                  placeholder={redacteur ? 'Laisser vide pour ne pas changer' : 'Min. 8 caractères'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {formData.password.length > 0 && `${formData.password.length} caractères`}
                </p>
                {formData.password.length > 0 && formData.password.length < 8 && (
                  <p className="text-xs text-red-500">Mot de passe trop court</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {redacteur ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  redacteur ? 'Mettre à jour' : 'Créer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}