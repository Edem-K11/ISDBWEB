

// app/dashboard/mentions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen,
  Eye,
  Building
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mentionService } from '@/lib/api/services/mentionService';
import { useMentions } from '@/lib/hooks/useMention';
import { useDomaines } from '@/lib/hooks/useDomaine';
import ConfirmModal from '@/components/ui/confirmModal';
import { Badge } from '@/components/ui/badge';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function MentionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaineId, setSelectedDomaineId] = useState<number | ''>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mentionToDelete, setMentionToDelete] = useState<number | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<number[]>([]);

  const { mentions, isLoading, mutate } = useMentions();
  const { domaine: domaines, mutate: mutateDomaines } = useDomaines();

  // Revalider à chaque montage : sans ça, revenir sur cette page après une
  // modification/suppression ailleurs pouvait réafficher des données mises en
  // cache un peu plus tôt dans la session (avant que le changement n'ait eu lieu).
  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrer les mentions
  const filteredMentions = mentions.filter(mention => {
    const matchesSearch = mention.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mention.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomaine = !selectedDomaineId || mention.domaine_id === selectedDomaineId;
    return matchesSearch && matchesDomaine;
  });

  const handleDelete = async () => {
    if (!mentionToDelete) return;

    try {
      await mentionService.delete(mentionToDelete);
      toast.success('Mention supprimée avec succès');
      await Promise.all([mutate(), mutateDomaines()]);
      setDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setMentionToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMentions.length === 0) {
      toast.error('Aucune mention sélectionnée');
      return;
    }

    if (!confirm(`Supprimer ${selectedMentions.length} mention(s) ?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedMentions.map(id => mentionService.delete(id))
      );
      
      toast.success(`${selectedMentions.length} mention(s) supprimée(s)`);
      setSelectedMentions([]);
      await Promise.all([mutate(), mutateDomaines()]);
    } catch (error) {
      toast.error('Erreur lors de la suppression multiple');
    }
  };

  // Options pour le select des domaines
  const domaineOptions = [
    { value: '', label: 'Tous les domaines' },
    ...domaines.map(domaine => ({
      value: domaine.id,
      label: domaine.nom
    }))
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentions</h1>
          <p className="text-gray-600 mt-1">
            Gérez les mentions des formations de l'institut
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDelete}
            disabled={selectedMentions.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedMentions.length > 0
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 size={18} />
            Supprimer ({selectedMentions.length})
          </button>
          
          <Link
            href="/dashboard/mentions/create"
            className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle mention
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une mention..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <SelectWithSearch
              options={domaineOptions}
              value={selectedDomaineId}
              onChange={(value) => setSelectedDomaineId(value as number | '')}
              placeholder="Filtrer par domaine"
              label=""
            />
          </div>
        </div>
      </div>

      {/* Liste des mentions */}
      {filteredMentions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentions.map((mention, index) => {
            // Couleur associée au thème de la mention, mais en version douce :
            // teintes claires partout, jamais de bloc plein très saturé.
            const colors = [
              { icon: 'bg-isdb-green-50 text-isdb-green-700', border: 'border-isdb-green-100', button: 'bg-isdb-green-50 text-isdb-green-700 hover:bg-isdb-green-100' },
              { icon: 'bg-isdb-orange-50 text-isdb-orange-700', border: 'border-isdb-orange-100', button: 'bg-isdb-orange-50 text-isdb-orange-700 hover:bg-isdb-orange-100' },
              { icon: 'bg-isdb-red-50 text-isdb-red-700', border: 'border-isdb-red-100', button: 'bg-isdb-red-50 text-isdb-red-700 hover:bg-isdb-red-100' },
              { icon: 'bg-isdb-gold-50 text-isdb-gold-700', border: 'border-isdb-gold-100', button: 'bg-isdb-gold-50 text-isdb-gold-700 hover:bg-isdb-gold-100' },
            ];
            const color = colors[index % colors.length];

            return (
              <div
                key={mention.id}
                className={`group relative overflow-hidden rounded-2xl border ${color.border} bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`${color.icon} p-2.5 rounded-lg`}>
                        <BookOpen size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-950 transition-colors">
                          {mention.titre}
                        </h3>
                        <Badge variant="info" size="sm" className="mt-1">
                          {mention.domaine?.nom || 'Sans domaine'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {mention.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {mention.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-2 mb-4 pt-4 border-t border-gray-100">
                    <Building className="text-gray-500" size={16} />
                    <span className="text-sm font-medium text-gray-600">
                      {mention.nombre_formations || 0} formation(s)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(ENDPOINTS.DASHBOARD_MENTION_EDIT(mention.id))}
                        className={`p-2 rounded-lg transition-colors ${color.button}`}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setMentionToDelete(mention.id);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/mentions/${mention.id}`)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${color.button}`}
                    >
                      <Eye size={12} />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="text-gray-400" size={40} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune mention trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedDomaineId 
              ? 'Aucun résultat pour votre recherche.' 
              : 'Commencez par créer votre première mention.'}
          </p>
          {!searchTerm && !selectedDomaineId && (
            <Link
              href="/dashboard/mentions/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
            >
              <Plus size={20} />
              Créer une mention
            </Link>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setMentionToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer la mention"
        message="Êtes-vous sûr de vouloir supprimer cette mention ? Cette action est irréversible et affectera les formations associées."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}