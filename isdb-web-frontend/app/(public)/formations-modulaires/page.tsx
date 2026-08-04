import HeroSection from '@/components/layout/hero';
import ModuleCard from '@/components/formations/moduleCard';
import { getFormationsModulaires } from '@/lib/api/formationsModulaires';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Formations modulaires', href: '/formations-modulaires', active: true },
];

export default async function FormationsModulairesPage() {
  const modules = await getFormationsModulaires();

  return (
    <div>
      <HeroSection
        title="Formations modulaires en cours du soir"
        description="Des modules professionnalisants en audiovisuel, communication, journalisme et création musicale, accessibles en parallèle de votre activité."
        color="brand"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        <p className="text-lg text-gray-600 mb-10 max-w-3xl">
          Chaque module est indépendant. Les frais comprennent une inscription et des frais de formation.
        </p>

        {modules.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2 items-stretch">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                titre={module.titre}
                description={module.description}
                dureeHeures={module.duree_heures}
                link={`/formations-modulaires/${module.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Aucun module disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}
