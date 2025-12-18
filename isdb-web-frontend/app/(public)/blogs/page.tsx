'use client';

import { useState, useMemo } from 'react';
import Head from 'next/head';
import HeroSection from '@/components/layout/hero';
import BlogCard from '@/components/blog/blogCard';
import FilterSidebar from '@/components/blog/filterSidebar';
import Pagination from '@/components/blog/pagination';
import BlogsSkeleton from '@/components/blog/blogSkeletons';
import { useBlogs } from '@/lib/hooks/useBlog';
import { useTags } from '@/lib/hooks/useTag';
import { useDebounce } from '@/lib/hooks/useDebounce';


export default function BlogsPage() {
  const [filters, setFilters] = useState({
    tag: '',
    annee: '',
    motCle: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Blog', href: '/blog', active: true }
  ];

  // Debounce la recherche pour éviter trop de requêtes
  const debouncedSearch = useDebounce(filters.motCle, 500);

  // Récupérer les blogs depuis l'API
  const { blogs, meta, isLoading, isError } = useBlogs({
    page: currentPage,
    tag: filters.tag,
    search: debouncedSearch,
  });

  // Récupérer les tags disponibles
  const { tags, isLoading: isLoadingTags } = useTags();

  // Filtrer par année côté client (car pas dans l'API)
  const filteredBlogs = useMemo(() => {
    if (!filters.annee) return blogs;
    
    return blogs.filter(blog => {
      const blogYear = new Date(blog.dateCreation).getFullYear().toString();
      return blogYear === filters.annee;
    });
  }, [blogs, filters.annee]);

  // Années disponibles (extraites des blogs)
  const annees = useMemo(() => {
    const years = blogs.map(blog => 
      new Date(blog.dateCreation).getFullYear().toString()
    );
    return ['Toutes', ...Array.from(new Set(years)).sort().reverse()];
  }, [blogs]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset à la page 1 quand on filtre
  };

  const resetFilters = () => {
    setFilters({
      tag: '',
      annee: '',
      motCle: ''
    });
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <title>Nos Actualités - Blog</title>
        <meta name="description" content="Découvrez nos dernières actualités et événements" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <HeroSection
          title="Nos Actualités"
          description="Restez informé des dernières nouvelles et événements"
          color="bg-isdb-red-100"
          breadcrumbs={breadcrumbs}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar avec filtres */}
            <div className="lg:w-1/4">
              <FilterSidebar 
                filters={filters}
                tags={tags}
                annees={annees}
                isLoadingTags={isLoadingTags}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>
            
            {/* Liste des actualités */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Toutes nos actualités
                </h2>
                <p className="text-gray-600 mt-2">
                  {meta ? `${meta.total} article${meta.total > 1 ? 's' : ''} trouvé${meta.total > 1 ? 's' : ''}` : 'Chargement...'}
                </p>
              </div>

              {/* États de chargement et erreur */}
              {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  Une erreur est survenue lors du chargement des articles.
                  <button 
                    onClick={() => window.location.reload()} 
                    className="ml-2 underline"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {isLoading ? (
                <BlogsSkeleton count={3} />
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun article trouvé avec ces critères.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {filteredBlogs.map(blog => (
                      <BlogCard key={blog.id} article={blog} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {meta && meta.last_page > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta.last_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
