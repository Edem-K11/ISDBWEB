import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/layout/hero';
import { getStudios } from '@/lib/api/studios';
import { getInstitutSettings } from '@/lib/api/institut';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Studios', href: '/studios', active: true },
];

// Motif de mise en page pour la galerie artistique (façon mosaïque) : répété en boucle
// quel que soit le nombre d'images ajoutées depuis le dashboard.
const GALLERY_SPAN_PATTERN = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
];

export default async function StudiosPage() {
  const [studios, institut] = await Promise.all([getStudios(), getInstitutSettings()]);
  const galerie = institut?.galerie || [];

  return (
    <div>
      <HeroSection
        title="Nos studios"
        description="L'Institut Supérieur Don Bosco dispose de studios professionnels pour la formation des étudiants et l'accueil du public."
        color="brand"
        image_url={galerie[0]}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Texte de présentation + galerie : une seule grille bento où le texte occupe une tuile
            et les images comblent automatiquement tout l'espace restant, y compris sous le texte
            (grid-auto-flow dense), façon habillage de texte autour d'une image. */}
        {galerie.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[180px] gap-4 grid-flow-row-dense mb-20">
            <div className="col-span-2 row-span-2 flex flex-col justify-center">
              <p className="text-lg text-slate-700 leading-relaxed">
                À l'ISDB, nos studios sont bien plus que de simples salles de cours : ce sont de
                véritables espaces de création où les étudiants s'initient aux métiers de
                l'audiovisuel, de la radio et de la production musicale, dans des conditions
                professionnelles.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mt-4">
                Ouverts également au grand public pour des besoins de production, ils incarnent
                notre volonté de conjuguer exigence pédagogique et pratique concrète.
              </p>
            </div>

            {galerie.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-2xl bg-slate-100 ${GALLERY_SPAN_PATTERN[index % GALLERY_SPAN_PATTERN.length]}`}
              >
                <Image src={image} alt={`Studios ISDB - ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-20">
            <p className="text-lg text-slate-700 leading-relaxed">
              À l'ISDB, nos studios sont bien plus que de simples salles de cours : ce sont de
              véritables espaces de création où les étudiants s'initient aux métiers de
              l'audiovisuel, de la radio et de la production musicale, dans des conditions
              professionnelles.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-4">
              Ouverts également au grand public pour des besoins de production, ils incarnent notre
              volonté de conjuguer exigence pédagogique et pratique concrète.
            </p>
          </div>
        )}

        {/* Studios, en alternance image/texte */}
        <div className="space-y-16">
          {studios.map((studio, index) => {
            const isReversed = index % 2 === 1;
            return (
              <article
                key={studio.id}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-isdb-green-50 shadow-sm">
                    {studio.images?.length > 0 ? (
                      <Image src={studio.images[0]} alt={studio.nom} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-isdb-green-100 to-slate-100">
                        <p className="text-slate-500 text-sm">Images à venir</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{studio.nom}</h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{studio.description}</p>

                  {studio.lien_radio && (
                    <Link
                      href="/radio"
                      className="inline-flex items-center mt-8 px-6 py-3 border-2 border-isdb-green-600 text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-600 hover:text-white transition-colors"
                    >
                      Écouter la radio en direct
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}

          {studios.length === 0 && (
            <p className="text-slate-600">Les studios seront bientôt présentés ici.</p>
          )}
        </div>
      </div>
    </div>
  );
}
