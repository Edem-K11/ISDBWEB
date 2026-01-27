

// app/(public)/formations/[mentionSlug]/page.tsx
import FormationCard from '@/components/layout/formationCard';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import DiscoverCard from '@/components/layout/discoverdCard';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PageProps {
  params: Promise<{
    mentionSlug: string;
  }>;
}

async function getMentionData(mentionSlug: string) {
  try {
    const res = await fetch(`${API_URL}/formations/${mentionSlug}`, {
      next: { revalidate: 1800 }, // Cache 30 min
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch mention');
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching mention:', error);
    return null;
  }
}

export default async function MentionPage({ params }: PageProps) {
    const {mentionSlug: slug} = await params;

    const data = await getMentionData(slug);
    
    if (!data) {
        console.log('Mention not found, triggering 404');
        notFound();
    }

    const { mention, content, offres, related_mentions } = data;

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Formations', href: '/formations' },
        { label: mention.titre, href: `/formations/${mention.slug}` }
    ];

    // Thème par défaut si pas de contenu
    const theme = content?.theme || 'green';
    const themeColors = {
        green: {
        gradient: 'from-isdb-green-800 via-isdb-green-600 to-isdb-green-500',
        accent: '#206b38',
        bg: 'bg-isdb-green-50',
        border: 'border-isdb-green-100',
        text: 'text-isdb-green-700',
        hoverBg: 'hover:bg-isdb-green-50',
        },
        red: {
        gradient: 'from-isdb-red-800 via-isdb-red-600 to-isdb-red-500',
        accent: '#dc2c42',
        bg: 'bg-isdb-red-50',
        border: 'border-isdb-red-100',
        text: 'text-isdb-red-700',
        hoverBg: 'hover:bg-isdb-red-50',
        },
        gold: {
        gradient: 'from-isdb-gold-800 via-isdb-gold-600 to-isdb-gold-500',
        accent: '#c8ad7f',
        bg: 'bg-isdb-gold-50',
        border: 'border-isdb-gold-100',
        text: 'text-isdb-gold-700',
        hoverBg: 'hover:bg-isdb-gold-50',
        },
        orange: {
        gradient: 'from-isdb-orange-800 via-isdb-orange-600 to-isdb-orange-500',
        accent: '#fad09c',
        bg: 'bg-isdb-orange-50',
        border: 'border-isdb-orange-100',
        text: 'text-isdb-orange-700',
        hoverBg: 'hover:bg-isdb-orange-50',
        },
    };

    const colors = themeColors[theme as keyof typeof themeColors];

    return (
        <div className={`min-h-screen theme-${theme}`}>
        {/* Header Section */}
        <div className={`relative bg-gradient-to-br ${colors.gradient} text-white py-20 px-6 overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-64 translate-y-64" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
            <div className="mt-2">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
            </div>
            
            <div className="mt-6 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <p className='uppercase tracking-wide'>
                    {content?.hero.title || mention.titre}
                </p> 
                {content?.hero.subtitle && (
                    <span className="block capitalize text-3xl md:text-4xl font-light mt-8 text-white/90">
                    {content.hero.subtitle}
                    </span>
                )}
                </h1>
                
                <p className="text-xl text-white/90 leading-relaxed">
                {content?.hero.description || mention.description}
                </p>
            </div>
            </div>
        </div>

        {/* Introduction */}
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-6 text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
                {content?.section.title || `Formations en ${mention.titre}`}
            </h2>
            <p className="text-lg text-slate-600">
                {content?.section.description || `Découvrez nos parcours de formation en ${mention.titre}.`}
            </p>
            </div>

            {/* Stats (si des offres existent) */}
            {/* {offres.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 mx-auto max-w-6xl px-6">
                <div className={`text-center p-6 ${colors.bg} rounded-lg ${colors.border}`}>
                <div className={`text-3xl font-bold ${colors.text} mb-2`}>{offres.length}</div>
                <div className="text-sm text-slate-600">Offre(s) disponible(s)</div>
                </div>
                <div className={`text-center p-6 ${colors.bg} rounded-lg ${colors.border}`}>
                <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                    {offres.filter((o: any) => o.formation.type === 'PRINCIPALE').length}
                </div>
                <div className="text-sm text-slate-600">Formation(s) principale(s)</div>
                </div>
                <div className={`text-center p-6 ${colors.bg} rounded-lg ${colors.border}`}>
                <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                    {offres.filter((o: any) => o.formation.type === 'MODULAIRE').length}
                </div>
                <div className="text-sm text-slate-600">Formation(s) modulaire(s)</div>
                </div>
            </div>
            )} */}

            {/* Section des offres */}
            <div className="relative w-full">
            <div className="relative z-10 mt-50 mb-8">
                <div className="relative">
                <div className="absolute -top-24 left-8 lg:-top-42 lg:left-16">
                    <h2 
                    className="text-5xl md:text-6xl lg:text-8xl font-black leading-none pointer-events-none select-none"
                    style={{
                        color: 'transparent',
                        WebkitTextStroke: `2px ${colors.accent}`,
                        opacity: 0.8,
                        filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))`
                    }}
                    >
                    OFFRES DE<br />FORMATIONS
                    </h2>
                </div>
                </div>
            </div>

            <div className={`relative py-20 px-6 bg-gradient-to-b ${colors.bg} via-white ${colors.bg} w-full border ${colors.border} shadow-lg`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent`} />
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent`} />
                
                <div className="container mx-auto max-w-6xl relative">
                {offres.length > 0 ? (
                    <div className="space-y-16">
                    {offres.map((offreData: any, index: number) => {
                        const formation = offreData.formation;
                        const offre = offreData.offre;
                        
                        // Construire les highlights
                        const highlights = [
                        formation.duree_formation || null,
                        formation.niveau_sortie || null,
                        formation.credits_ects ? `${formation.credits_ects} crédits ECTS` : null
                        ].filter(Boolean);

                        return (
                        <div key={offreData.id} className="relative group">
                            <FormationCard
                            //   id={formation.id}
                            title={formation.titre}
                            description={formation.description}
                            badge={mention.titre}
                            link={`/formations/${mention.slug}/${formation.slug}`}
                            highlights={highlights}
                            />
                            
                            {/* Highlights supplémentaires */}
                            {offre.chef_parcours && (
                            <div className="mt-4 text-center">
                                <span className="text-sm text-gray-600">
                                <strong>Chef de parcours :</strong> {offre.chef_parcours}
                                </span>
                            </div>
                            )}
                            {offre.animateur && (
                            <div className="mt-4 text-center">
                                <span className="text-sm text-gray-600">
                                <strong>Animateur :</strong> {offre.animateur}
                                </span>
                            </div>
                            )}
                            
                            {index < offres.length - 1 && (
                            <div className="mt-16 flex justify-center">
                                <div className="relative w-2/3">
                                <div className={`h-px bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent opacity-50`} />
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} to-white flex items-center justify-center ${colors.border}`}>
                                    <div className={`w-3 h-3 rounded-full bg-[var(--theme-600)]`}></div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            )}
                        </div>
                        );
                    })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                    <p className="text-gray-500">Aucune offre de formation disponible actuellement pour cette mention.</p>
                    </div>
                )}
                </div>
            </div>

            {/* Découvrir aussi */}
            {related_mentions.length > 0 && (
                <div className="mb-20 mx-auto max-w-6xl px-6 mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    Découvrez aussi
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                    Explorez nos autres mentions pour élargir vos horizons académiques
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {related_mentions.map((item: any) => (
                    <div key={item.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                        <DiscoverCard
                        title={item.titre}
                        color={`bg-gradient-to-r from-${item.theme}-400 to-${item.theme}-300`}
                        link={`/formations/${item.slug}`}
                        />
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* CTA */}
            <div className='px-6'>
                <div className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl ${colors.border} bg-gradient-to-br from-white ${colors.bg} mb-12`}>
                <div className="relative z-10 py-16 px-8 text-center">
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    {content?.cta.title || 'Prêt à commencer votre parcours ?'}
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                    {content?.cta.description || 'Rejoignez une communauté passionnée par la connaissance'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="/contact"
                        className={`px-8 py-4 bg-[var(--theme-600)] text-white font-medium rounded-xl hover:bg-[var(--theme-700)] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        Nous contacter
                    </a>
                    <a 
                        href="/admissions"
                        className={`px-8 py-4 bg-white border-2 border-[var(--theme-600)] text-[var(--theme-600)] font-medium rounded-xl ${colors.hoverBg} transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                        Procédure d'admission
                    </a>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

    // Métadonnées SEO dynamiques
    export async function generateMetadata({ params }: PageProps) {
        const { mentionSlug: slug } = await params;

        const data = await getMentionData(slug);
        
        if (!data) {
            return {
            title: 'Formation non trouvée | ISDB',
            };
        }

        const { mention, content } = data;

        return {
            title: content?.seo.title || `${mention.titre} | ISDB`,
            description: content?.seo.description || mention.description,
            keywords: content?.seo.keywords || [],
        };
    }