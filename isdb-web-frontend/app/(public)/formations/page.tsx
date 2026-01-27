

// app/(public)/formations/page.tsx
import EventCard from "@/components/formations/eventCard";
import HeroSection from "@/components/layout/hero";
import { Mention } from "@/lib/types/Mention";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMentions(): Promise<Mention[]> {
  try {
    const res = await fetch(`${API_URL}/formations`, {
      next: { revalidate: 3600 } // Cache 1 heure
    });

    
    if (!res.ok) {
        throw new Error('Failed to fetch mentions');
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return [];
  }
}

const breadcrumbs = [
  { label: "Accueil", href: "/" },
  { label: "Formations", href: "/formations", active: true },
];

export default async function FormationsPage() {
  const mentions = await getMentions();
  
  return (
    <div>
      <HeroSection
        title="Découvrez les formations de ISDB"
        description="ISDB propose des formations menant à des diplômes reconnus par le Ministère de l'Enseignement supérieur et de la Recherche (via Parcoursup), à des titres inscrits au Répertoire National des Certifications Professionnelles (RNCP)."
        color="red"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-12 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Nos domaines de formation
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">
          Notre équipe pédagogique est à votre écoute pour vous orienter vers le parcours le plus adapté à votre projet professionnel.
        </p>
        
        {mentions.length > 0 ? (
          <div className="grid gap-8 lg:gap-10 md:grid-cols-2">
            {mentions.map((mention, index) => (
              <EventCard
                key={mention.id}
                title={mention.titre}
                link={`/formations/${mention.slug}`}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
          </div>
        )}
      </div>

      {/* Section CTA bas de page */}
      <div className="px-20 py-10">
        <div className="mt-20 bg-gray-800 rounded-2xl p-10 md:p-12 text-white text-center shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Vous ne trouvez pas la formation idéale ?
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Notre équipe pédagogique est à votre écoute pour vous orienter vers le parcours le plus adapté à votre projet professionnel.
          </p>
          <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
}

// Métadonnées SEO
export const metadata = {
  title: 'Formations | ISDB',
  description: 'Découvrez les formations de ISDB menant à des diplômes reconnus.',
};