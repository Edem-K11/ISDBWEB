'use client';

import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Redacteur } from '@/lib/types/redacteur';

interface BlogMetaProps {
  redacteur: Redacteur;
  dateCreation?: string;
  dateModification?: string;
}

export default function BlogMeta({ 
  redacteur, 
  dateCreation, 
  dateModification,
}: BlogMetaProps) {

  // Fonction pour formater la date (au cas où formatDate ne marche pas)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Date non disponible';
    
    try {
      // Si c'est déjà au format "dd/mm/yyyy"
      if (dateStr.includes('/')) {
        return dateStr;
      }
      
      // Sinon, parser la date ISO
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const showModificationDate = dateModification && dateModification !== dateCreation;

  return (
    <div className="mb-12 pb-8 border-b border-gray-200">
      {/* Container principal avec flex responsive */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        
        {/* Section redacteur */}
        <div className="flex items-center gap-4">
          {redacteur?.avatar ? (
            <Image
              src={redacteur.avatar}
              alt={redacteur.nom}
              width={56}
              height={56}
              className="rounded-full ring-2 ring-gray-200 object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-gray-200 flex-shrink-0">
              {redacteur?.nom.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Écrit par</p>
            <p className="font-semibold text-gray-900 text-lg">{redacteur?.nom}</p>
            <p className="text-xs text-gray-500 mt-1">Chef éditeur ISDB</p>
          </div>
        </div>

        {/* Séparateur vertical (visible sur desktop) */}
        <div className="hidden md:block w-px h-16 bg-gray-300" />

        {/* Section Dates */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Date de publication */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Publié le</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(dateCreation)}
              </p>
            </div>
          </div>

          {/* Date de modification (si différente) */}
          {showModificationDate && (
            <>
              {/* Séparateur vertical mobile */}
              <div className="hidden sm:block w-px h-12 bg-gray-300" />
              
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Modifié le</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(dateModification)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}