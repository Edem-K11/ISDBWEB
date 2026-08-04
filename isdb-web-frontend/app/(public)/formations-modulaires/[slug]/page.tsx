import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/layout/hero';
import InstitutInfoSidebar from '@/components/formations/institutInfoSidebar';
import { formatFcfa } from '@/lib/api/formationsModulaires';
import { getInstitutSettings } from '@/lib/api/institut';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getModule(slug: string) {
  const res = await fetch(`${API_URL}/formations-modulaires/${slug}`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function FormationModulaireDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const [formation, institut] = await Promise.all([
    getModule(slug),
    getInstitutSettings(),
  ]);

  if (!formation) notFound();

  return (
    <div>
      <HeroSection
        title={formation.titre}
        description="Formation modulaire"
        color="brand"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Formations modulaires', href: '/formations-modulaires' },
          { label: formation.titre, href: `/formations-modulaires/${slug}`, active: true },
        ]}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {formation.contenu && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Contenu du module</h2>
                <ul className="space-y-2 text-slate-700">
                  {formation.contenu.split('\n').filter(Boolean).map((line: string) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-isdb-green-600">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500 mb-1">Durée</p>
                <p className="font-semibold">{formation.duree_heures ? `${formation.duree_heures}h` : '—'}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500 mb-1">Inscription</p>
                <p className="font-semibold">{formatFcfa(formation.frais_inscription)}</p>
              </div>
              <div className="rounded-xl bg-isdb-green-50 p-5">
                <p className="text-sm text-slate-500 mb-1">Frais de formation</p>
                <p className="font-semibold text-isdb-green-700">{formatFcfa(formation.frais_formation)}</p>
              </div>
            </section>

            <Link
              href="/formations-modulaires"
              className="text-isdb-green-600 font-semibold hover:underline"
            >
              ← Retour aux formations modulaires
            </Link>
          </div>

          <div className="lg:col-span-1">
            <InstitutInfoSidebar institut={institut} />
          </div>
        </div>
      </div>
    </div>
  );
}
