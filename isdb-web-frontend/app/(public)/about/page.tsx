import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/layout/hero';
import { getInstitutSettings } from '@/lib/api/institut';
import { GraduationCap, Target, Eye, HeartHandshake, Clapperboard, Radio, BookOpen } from 'lucide-react';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/about', active: true },
];

const stats = [
  { value: '1975', label: 'Année de création' },
  { value: '98%', label: 'Taux de réussite' },
  { value: '20+', label: 'Experts enseignants' },
  { value: '10+', label: "Années d'expérience" },
];

const valeurs = [
  {
    icon: Target,
    titre: 'Notre mission',
    texte:
      "Former des professionnels compétents et responsables, capables de répondre aux défis du monde du travail, à travers un enseignement exigeant et un accompagnement personnalisé.",
  },
  {
    icon: Eye,
    titre: 'Notre vision',
    texte:
      "Être une référence en Afrique de l'Ouest dans la formation supérieure, reconnue pour la qualité de son encadrement académique et la réussite de ses diplômés.",
  },
  {
    icon: HeartHandshake,
    titre: 'Nos valeurs',
    texte:
      "Excellence académique, rigueur, respect de la personne et esprit d'ouverture guident chaque enseignement dispensé au sein de l'institut.",
  },
];

const atouts = [
  {
    icon: GraduationCap,
    titre: 'Formations reconnues',
    texte: "Des licences et masters dans des domaines porteurs, encadrés par des enseignants expérimentés.",
    href: '/formations',
    cta: 'Voir les formations',
  },
  {
    icon: Clapperboard,
    titre: 'Studios professionnels',
    texte: "Des espaces de production audiovisuelle pour s'initier concrètement aux métiers de la communication.",
    href: '/studios',
    cta: 'Découvrir les studios',
  },
  {
    icon: Radio,
    titre: 'Une radio étudiante',
    texte: "Radio ISDB, animée par nos étudiants, diffuse des émissions éducatives et culturelles en continu.",
    href: '/radio',
    cta: 'Écouter la radio',
  },
  {
    icon: BookOpen,
    titre: 'Vie académique active',
    texte: "Actualités, événements et vie de campus relayés régulièrement sur notre blog.",
    href: '/blogs',
    cta: 'Lire le blog',
  },
];

export default async function AboutPage() {
  const institut = await getInstitutSettings();
  const heroImage = institut?.galerie?.[0];

  return (
    <div>
      <HeroSection
        title="À propos de l'ISDB"
        description="Une institution d'enseignement supérieur engagée pour la réussite académique et professionnelle de ses étudiants."
        color="brand"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Présentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {institut?.nom || 'Institut Supérieur Don Bosco'}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {institut?.description ||
                "Institution d'excellence dédiée à l'éducation, la recherche et l'innovation, l'ISDB accompagne chaque étudiant dans la construction d'un parcours académique solide et d'un projet professionnel durable."}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-4">
              Depuis sa création, l'institut forme des étudiants dans des filières exigeantes,
              en combinant rigueur académique, encadrement personnalisé et ouverture sur le monde
              professionnel.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-isdb-green-50 shadow-sm">
            {heroImage ? (
              <Image src={heroImage} alt={institut?.nom || 'ISDB'} fill className="object-cover" />
            ) : (
              <Image src="/isdb_img1.png" alt="Campus ISDB" fill className="object-cover" />
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 bg-isdb-green-50 rounded-3xl p-8 md:p-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-isdb-green-700 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission / Vision / Valeurs */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Notre mission, notre vision, nos valeurs
            </h2>
            <p className="text-lg text-slate-600">
              Les principes qui guident l'ISDB dans la formation de ses étudiants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valeurs.map(({ icon: Icon, titre, texte }) => (
              <div
                key={titre}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-isdb-green-300 hover:shadow-[0_10px_18px_-10px_rgba(15,23,42,0.15)] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-isdb-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-isdb-green-600" size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{titre}</h3>
                <p className="text-slate-600 leading-relaxed">{texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pourquoi choisir l'ISDB */}
        <div className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir l'ISDB ?
            </h2>
            <p className="text-lg text-slate-600">
              Un institut résolument tourné vers la pratique et la vie de campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {atouts.map(({ icon: Icon, titre, texte, href, cta }) => (
              <div
                key={titre}
                className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:border-isdb-green-300 transition-colors duration-300"
              >
                <div className="w-11 h-11 bg-isdb-green-100 rounded-lg flex items-center justify-center mb-5">
                  <Icon className="text-isdb-green-600" size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{titre}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{texte}</p>
                <Link
                  href={href}
                  className="text-sm font-semibold text-isdb-green-600 hover:text-isdb-green-700 inline-flex items-center"
                >
                  {cta}
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 md:px-12 pb-20">
        <div className="bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 rounded-3xl p-10 md:p-12 text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Prêt à rejoindre l'ISDB ?</h2>
          <p className="text-isdb-green-100 max-w-xl mx-auto mb-8">
            Découvrez nos formations et démarrez votre candidature dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admission"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 transition-colors"
            >
              Faire une demande d'admission
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
