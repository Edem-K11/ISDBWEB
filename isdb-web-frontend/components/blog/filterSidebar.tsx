
'use client';

import { Filter } from "lucide-react";
import { useState } from "react";


// ============================================
// COMPOSANT FILTRE
// ============================================

type FilterSidebarProps = {
  filters: {
    tag: string;
    annee: string;
    motCle: string;
  };
  tags: Array<{ id: number; nom: string; slug: string; couleur?: string }>;
  annees: string[];
  isLoadingTags: boolean;
  onFilterChange: (filterName: string, value: string) => void;
  onReset: () => void;
};

export default function FilterSidebar({ 
  filters, 
  tags, 
  annees, 
  isLoadingTags,
  onFilterChange, 
  onReset 
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-full lg:h-auto
          w-80 lg:w-full z-40 lg:z-0
          bg-white rounded-2xl shadow-xl lg:shadow-md
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className='p-8'>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Filtrer par :</h3>
            <button 
              onClick={onReset}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Réinitialiser
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Filtre par tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              {isLoadingTags ? (
                <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 animate-pulse h-10" />
              ) : (
                <select 
                  value={filters.tag}
                  onChange={(e) => onFilterChange('tag', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Toutes les catégories</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.slug}>
                      {tag.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {/* Filtre par année */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année de publication
              </label>
              <select 
                value={filters.annee}
                onChange={(e) => onFilterChange('annee', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {annees.map(annee => (
                  <option key={annee} value={annee === 'Toutes' ? '' : annee}>
                    {annee}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre par mot-clé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot clé
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={filters.motCle}
                  onChange={(e) => onFilterChange('motCle', e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <svg 
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>  
  );
}
