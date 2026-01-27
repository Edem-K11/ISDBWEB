

// app/(public)/formations/[mentionSlug]/[formationSlug]/page.tsx
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import InfoCard from '@/components/formations/infoCard';
import TabsContent from '@/components/formations/tabsContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PageProps {
  params: {
    mentionSlug: string;
    formationSlug: string;
  };
}

async function getOffreData(mentionSlug: string, formationSlug: string) {
  try {
    const res = await fetch(`${API_URL}/formations/${mentionSlug}/${formationSlug}`, {
      next: { revalidate: 1800 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch offre');
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching offre:', error);
    console.log('Mention Slug:', mentionSlug, 'Formation Slug:', formationSlug);
    return null;
  }
}

export default async function FormationDetailPage({ params }: PageProps) {
  const { mentionSlug, formationSlug } = await params;
  
  const data = await getOffreData(mentionSlug, formationSlug);
  
  if (!data) {
    notFound();
  }

  const { mention, formation, offre, autres_formations } = data;

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Formations', href: '/formations' },
    { label: mention.titre, href: `/formations/${mention.slug}` },
    { label: formation.titre, href: `/formations/${mention.slug}/${formation.slug}` }
  ];

  // Thème
  const theme = mention.theme || 'green';
  const themeColors = {
    green: {
      gradient: 'from-isdb-green-800 via-isdb-green-600 to-isdb-green-500',
      accent: 'bg-isdb-green-600',
      border: 'border-isdb-green-200',
      text: 'text-isdb-green-700',
    },
    red: {
      gradient: 'from-isdb-red-800 via-isdb-red-600 to-isdb-red-500',
      accent: 'bg-isdb-red-600',
      border: 'border-isdb-red-200',
      text: 'text-isdb-red-700',
    },
    gold: {
      gradient: 'from-isdb-gold-800 via-isdb-gold-600 to-isdb-gold-500',
      accent: 'bg-isdb-gold-600',
      border: 'border-isdb-gold-200',
      text: 'text-isdb-gold-700',
    },
    orange: {
      gradient: 'from-isdb-orange-800 via-isdb-orange-600 to-isdb-orange-500',
      accent: 'bg-isdb-orange-600',
      border: 'border-isdb-orange-200',
      text: 'text-isdb-orange-700',
    },
  };

  const colors = themeColors[theme as keyof typeof themeColors];

  // Déterminer le diplôme lisible
  const diplomeMap: Record<string, string> = {
    'LICENCE_PROFESSIONNELLE': 'Licence Professionnelle',
    'LICENCE_FONDAMENTALE': 'Licence Fondamentale',
    'MASTER': 'Master',
    'CERTIFICAT_MODULE': 'Certificat',
  };
  const diplomeLabel = diplomeMap[formation.diplome] || formation.diplome;

  return (
    <div className={`min-h-screen bg-gray-50 theme-${theme}`}>
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br ${colors.gradient} text-white p-6 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        
        <div className="container mx-auto max-w-6xl mt-20 relative z-10">          
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {diplomeLabel}
              </span>
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {formation.type === 'PRINCIPALE' ? 'Formation Principale' : 'Formation Modulaire'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {formation.titre}
            </h1>
            
            {formation.description && (
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
                {formation.description}
              </p>
            )}

            <div className="mt-10 text-sm font-medium ">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Info */}
          <InfoCard 
            formation={formation}
            offre={offre}
            mention={mention}
            colors={colors}
          />

          {/* Tabs Content */}
          <TabsContent 
            formation={formation}
            offre={offre}
            colors={colors}
          />
        </div>

        {/* Autres formations */}
        {autres_formations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Autres formations en {mention.titre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {autres_formations.map((f: any) => (
                <a
                  key={f.id}
                  href={`/formations/${f.mention_slug}/${f.slug}`}
                  className={`block p-6 bg-white rounded-xl border-2 ${colors.border} hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 ${colors.accent} text-white text-xs rounded-full`}>
                      {f.type === 'PRINCIPALE' ? 'Principale' : 'Modulaire'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{f.titre}</h3>
                  <p className={`text-sm ${colors.text}`}>Découvrir →</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`mt-16 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 ${colors.border}`}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Prêt à vous inscrire ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Rejoignez notre communauté d'étudiants et bénéficiez d'une formation d'excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className={`px-8 py-4 ${colors.accent} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg`}
              >
                Nous contacter
              </a>
              <a
                href="/admissions"
                className={`px-8 py-4 bg-white border-2 ${colors.border} ${colors.text} font-medium rounded-xl hover:bg-gray-50 transition-all`}
              >
                Procédure d'admission
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Métadonnées SEO
export async function generateMetadata({ params }: PageProps) {
  const {mentionSlug, formationSlug} = await params;
  const data = await getOffreData(mentionSlug, formationSlug);
  
  if (!data) {
    return {
      title: 'Formation non trouvée | ISDB',
    };
  }

  const { formation, mention } = data;

  return {
    title: `${formation.titre} - ${mention.titre} | ISDB`,
    description: formation.description || `Formation en ${mention.titre} à ISDB`,
  };
}