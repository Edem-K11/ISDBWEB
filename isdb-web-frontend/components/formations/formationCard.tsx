

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, ChevronDown, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { Formation } from '@/lib/types/Formation';

interface FormationCardProps {
  formation: Formation;
  onDelete: (id: number) => void;
}

type HoverState = 'none' | 'view' | 'edit' | 'delete';

export function FormationCard({ formation, onDelete }: FormationCardProps) {
  const router = useRouter();
  const [hoverState, setHoverState] = useState<HoverState>('none');

  const getCardBackground = () => {
    switch (hoverState) {
      case 'view':
        return 'bg-blue-50 border-blue-200';
      case 'edit':
        return 'bg-purple-50 border-purple-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getActionIconColor = (action: HoverState) => {
    if (hoverState === action) {
      switch (action) {
        case 'view':
          return 'text-blue-600 bg-blue-100';
        case 'edit':
          return 'text-purple-600 bg-purple-100';
        case 'delete':
          return 'text-red-600 bg-red-100';
      }
    }
    return 'text-gray-600 bg-gray-100 hover:bg-gray-200';
  };

  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-6 transition-all duration-300 ease-in-out',
        getCardBackground(),
        'hover:shadow-lg'
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Contenu principal */}
        <div className="flex-1 space-y-4">
          {/* En-tête */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {formation.titre}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <Badge 
                  variant={formation.statut_formation === 'ACTIVE' ? 'success' : 'warning'}
                  size="sm"
                >
                  {formation.statut_formation === 'ACTIVE' ? 'Active' : 'Archivée'}
                </Badge>
                <Badge 
                  variant={formation.type_formation === 'PRINCIPALE' ? 'info' : 'success'}
                  size="sm"
                >
                  {formation.type_formation === 'PRINCIPALE' ? 'Principale' : 'Modulaire'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {formation.description && (
              <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                {formation.description}
              </p>
            )}
          </div>

          {/* Bouton "Voir plus d'information" */}
          <button
            onClick={() => router.push(`/dashboard/formations/${formation.id}`)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-isdb-green-600 transition-colors group"
          >
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Voir plus d'information
          </button>
        </div>

        {/* Informations et Actions */}
        <div className="lg:w-80 space-y-4">
          {/* Informations clés */}
          <div className="space-y-2.5 text-sm">
            {formation.diplome && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-600 font-medium">📚 Diplôme</span>
                <span className="text-gray-900 font-semibold">
                  {formation.diplome.replace(/_/g, ' ').split(' ').map(w => 
                    w.charAt(0) + w.slice(1).toLowerCase()
                  ).join(' ')}
                </span>
              </div>
            )}

            {formation.mention && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-600 font-medium">🎓 Mention</span>
                <span className="text-gray-900 font-semibold line-clamp-1">
                  {formation.mention.titre}
                </span>
              </div>
            )}

            {formation.duree_formation && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-600 font-medium">⏱️ Durée</span>
                <span className="text-gray-900 font-semibold">
                  {formation.duree_formation}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5">
              <span className="text-gray-600 font-medium">📋 Offre de formation</span>
              <span className="text-gray-900 font-semibold">
                {formation.offresFormations?.length || 0}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => router.push(`/dashboard/formations/${formation.id}`)}
              onMouseEnter={() => setHoverState('view')}
              onMouseLeave={() => setHoverState('none')}
              className={cn(
                'flex-1 p-3 rounded-xl transition-all duration-200',
                getActionIconColor('view'),
                'hover:scale-105'
              )}
              title="Voir les détails"
            >
              <Eye size={20} className="mx-auto" />
            </button>

            <button
              onClick={() => router.push(`/dashboard/formations/${formation.id}/edit`)}
              onMouseEnter={() => setHoverState('edit')}
              onMouseLeave={() => setHoverState('none')}
              className={cn(
                'flex-1 p-3 rounded-xl transition-all duration-200',
                getActionIconColor('edit'),
                'hover:scale-105'
              )}
              title="Modifier"
            >
              <Edit size={20} className="mx-auto" />
            </button>

            <button
              onClick={() => onDelete(formation.id)}
              onMouseEnter={() => setHoverState('delete')}
              onMouseLeave={() => setHoverState('none')}
              className={cn(
                'flex-1 p-3 rounded-xl transition-all duration-200',
                getActionIconColor('delete'),
                'hover:scale-105'
              )}
              title="Supprimer"
            >
              <Trash2 size={20} className="mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}