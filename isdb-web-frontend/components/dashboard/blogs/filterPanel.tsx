'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Tag } from '@/lib/types/tag';
import { Auteur } from '@/lib/types/redacteur';
import { BlogFilters } from '@/lib/types/blog';

interface FilterPanelProps {
  onFilterChange: (filters: BlogFilters) => void;
  tags: Tag[];
  auteurs: Auteur[];
}

export default function FilterPanel({ onFilterChange, tags, auteurs }: FilterPanelProps) {
  const [filters, setFilters] = useState<BlogFilters>({
    search: '',
    statut: undefined,
    tag: '',
    auteur_id: undefined,
    annee: '',
    page: undefined,
  });

  const currentYear = new Date().getFullYear();
  const annees = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (value === undefined || value === '' || value === null) return count;
      if (Array.isArray(value)) {
        return value.length > 0 ? count + 1 : count;
      }
      return count + 1;
    }, 0);
  }, [filters]);

  const updateFilters = (newFilters: BlogFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof BlogFilters, rawValue: string) => {
    const newFilters = { ...filters };

    if (key === 'auteur_id') {
      newFilters.auteur_id = rawValue === '' ? undefined : Number(rawValue);
    } else if (key === 'page') {
      newFilters.page = rawValue === '' ? undefined : Number(rawValue);
    } else if (key === 'statut') {
      newFilters.statut = rawValue === '' ? undefined : (rawValue as 'publie' | 'brouillon');
    } else if (key === 'tag') {
      newFilters.tag = rawValue === '' ? '' : rawValue;
    } else if (key === 'annee') {
      newFilters.annee = rawValue === '' ? '' : rawValue;
    } else if (key === 'search') {
      newFilters.search = rawValue;
    } else {
      (newFilters as any)[key] = rawValue;
    }

    updateFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: BlogFilters = {
      search: '',
      statut: undefined,
      tag: '',
      auteur_id: undefined,
      page: undefined,
      annee: '',
    };
    updateFilters(emptyFilters);
  };

  return (
    <div className="bg-transparent border-b border-gray-200 pb-4 space-y-3">
      {/* Ligne principale : Recherche + Filtres */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Champ de recherche à gauche */}
        <div className="relative w-full lg:w-auto lg:flex-1 lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search ?? ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filtres à droite */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {/* Statut */}
          <select
            value={filters.statut ?? ''}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white hover:bg-gray-50 cursor-pointer min-w-[120px]"
          >
            <option value="">Statut: Tous</option>
            <option value="publie">Publiés</option>
            <option value="brouillon">Brouillons</option>
          </select>

          {/* Tags */}
          <select
            value={filters.tag ?? ''}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white hover:bg-gray-50 cursor-pointer min-w-[120px]"
          >
            <option value="">Tag: Tous</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.nom}
              </option>
            ))}
          </select>

          {/* Auteurs */}
          <select
            value={filters.auteur_id ?? ''}
            onChange={(e) => handleFilterChange('auteur_id', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white hover:bg-gray-50 cursor-pointer min-w-[120px]"
          >
            <option value="">Auteur: Tous</option>
            {auteurs.map((auteur) => (
              <option key={auteur.id} value={auteur.id}>
                {auteur.nom}
              </option>
            ))}
          </select>

          {/* Année */}
          <select
            value={filters.annee ?? ''}
            onChange={(e) => handleFilterChange('annee', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white hover:bg-gray-50 cursor-pointer min-w-[120px]"
          >
            <option value="">Année: Toutes</option>
            {annees.map((annee) => (
              <option key={annee} value={annee}>
                {annee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ligne inférieure : Boutons et indicateurs */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}</span>
          </div>
          
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}