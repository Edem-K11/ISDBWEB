

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Globe,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { domaineService } from '@/lib/api/services/domaineService';
import { useDomaines } from '@/lib/hooks/useDomaine';
import ConfirmModal from '@/components/ui/confirmModal';

export default function DomainesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaines, setSelectedDomaines] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [domaineToDelete, setDomaineToDelete] = useState<number | null>(null);


  const { domaine: domaines, isLoading, mutate } = useDomaines();

  // Filtrer les domaines
  const filteredDomaines = domaines.filter(domaine =>
    domaine.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if(!domaineToDelete) return;

    try {
      await domaineService.delete(domaineToDelete);
      toast.success('Domaine supprimé avec succès');
      // Revalider les données SWR
      mutate();
      setDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setDomaineToDelete(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedDomaines.length === filteredDomaines.length) {
      setSelectedDomaines([]);
    } else {
      setSelectedDomaines(filteredDomaines.map(d => d.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDomaines.length === 0) {
      toast.error('Aucun domaine sélectionné');
      return;
    }

    if (!confirm(`Supprimer ${selectedDomaines.length} domaine(s) ?`)) {
      return;
    }

    try {
      // Supprimer tous les domaines sélectionnés
      await Promise.all(
        selectedDomaines.map(id => domaineService.delete(id))
      );
      
      toast.success(`${selectedDomaines.length} domaine(s) supprimé(s)`);
      setSelectedDomaines([]);
      
      // Revalider les données
      mutate();
    } catch (error) {
      toast.error('Erreur lors de la suppression multiple');
    }
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec titre et boutons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domaines de formation</h1>
          <p className="text-gray-600 mt-1">
            Gérez les domaines de formation de l'institut
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDelete}
            disabled={selectedDomaines.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedDomaines.length > 0
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 size={18} />
            Supprimer ({selectedDomaines.length})
          </button>
          
          <Link
            href="/dashboard/domaines/create"
            className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nouveau domaine
          </Link>
        </div>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un domaine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter size={20} />
            Filtres
          </button>
        </div>
      </div>

      {/* Tableau des domaines */}
      {filteredDomaines.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDomaines.length === filteredDomaines.length && filteredDomaines.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-isdb-green-600 rounded border-gray-300 focus:ring-isdb-green-500"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domaine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formations associées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentions associées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDomaines.map((domaine) => (
                  <tr 
                    key={domaine.id} 
                    className={`hover:bg-gray-50 ${
                      selectedDomaines.includes(domaine.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDomaines.includes(domaine.id)}
                        onChange={() => {
                          setSelectedDomaines(prev =>
                            prev.includes(domaine.id)
                              ? prev.filter(id => id !== domaine.id)
                              : [...prev, domaine.id]
                          );
                        }}
                        className="h-4 w-4 text-isdb-green-600 rounded border-gray-300 focus:ring-isdb-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-isdb-green-50 rounded-lg">
                          <Globe className="text-isdb-green-600" size={20} />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{domaine.nom}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Actif
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domaine.nombreFormations ?? 0}</span>
                        <span className="text-gray-500">formations</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domaine.nombreMentions ?? 0}</span>
                        <span className="text-gray-500">mentions</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {domaine.createdAt ? new Date(domaine.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/domaines/${domaine.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDomaineToDelete(domaine.id);
                            setDeleteModalOpen(true);
                          }}
                          disabled={domaineToDelete === domaine.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pied de tableau */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {filteredDomaines.length} domaine(s) trouvé(s)
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="text-gray-400" size={40} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun domaine trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier domaine.'}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/domaines/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
            >
              <Plus size={20} />
              Créer un domaine
            </Link>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDomaineToDelete(null);
        }}
        onConfirm={() => handleDelete}
        title="Supprimer le domaine"
        message="Êtes-vous sûr de vouloir supprimer ce domaine ? Cette action est irréversible."
        confirmText='Supprimer le domaine'
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}