import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/layout/hero';
import { getStudios } from '@/lib/api/studios';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Studios', href: '/studios', active: true },
];

export default async function StudiosPage() {
  const studios = await getStudios();

  return (
    <div>
      <HeroSection
        title="Nos studios"
        description="L'Institut Supérieur Don Bosco dispose de studios professionnels pour la formation des étudiants et l'accueil du public."
        color="green"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto max-w-6xl px-6 py-12 space-y-12">
        {studios.map((studio) => (
          <article
            key={studio.id}
            className="grid lg:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{studio.nom}</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{studio.description}</p>

              {studio.lien_radio && (
                <Link
                  href="/radio"
                  className="inline-flex items-center mt-6 px-6 py-3 bg-isdb-green-600 text-white font-semibold rounded-xl hover:bg-isdb-green-700 transition-colors"
                >
                  Écouter la radio en direct
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {studio.images?.length > 0 ? (
                studio.images.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                    <Image src={image} alt={`${studio.nom} - ${index + 1}`} fill className="object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-isdb-green-100 to-slate-100 flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Images à venir</p>
                </div>
              )}
            </div>
          </article>
        ))}

        {studios.length === 0 && (
          <p className="text-slate-600">Les studios seront bientôt présentés ici.</p>
        )}
      </div>
    </div>
  );
}
