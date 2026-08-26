// app/(public)/page.tsx

import Image from "next/image";
import Link from "next/link";
import MyNavFloating from "@/components/layout/navbar2";
import Footer from "@/components/layout/footer";
import { getInstitutSettings } from "@/lib/api/institut";
import { getStudios } from "@/lib/api/studios";
import { getRadio } from "@/lib/api/radio";
import { getLatestBlogs } from "@/lib/api/blogs";
import { getMentions } from "@/lib/api/mentions";
import { getFormationsModulaires } from "@/lib/api/formationsModulaires";
import { getMentionThemePalette } from "@/lib/utils/mentionTheme";
import CaurisIcon from "@/components/ui/caurisIcon";
import { boldonse } from "@/components/ui/fonts";
import HeroGlassLogo from "@/components/ui/heroGlassLogo";
import RevealOnScroll from "@/components/ui/revealOnScroll";
import { Clapperboard, Play, ArrowUpRight, Calendar, Layers, Camera, User, GraduationCap } from "lucide-react";
import type { FormationModulaireListItem } from "@/lib/api/formationsModulaires";

// Ordre d'affichage souhaité des filières sur l'accueil (les mentions non listées
// ici s'ajoutent simplement à la fin, sans jamais être masquées).
const MENTION_DISPLAY_ORDER = [
  'philosophie',
  'sciences-et-techniques-de-la-communication',
  'sciences-de-leducation',
];

const ArrowIcon = ({ className = "w-4 h-4 ml-2" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Carte d'aperçu d'une formation modulaire (grille "Découvrez nos formations
// continues en cours du soir") : badge pastille, filigrane cauris (au lieu
// d'une icône générique) pour rester dans la DA, lien "Découvrir" avec flèche.
function ModulePreviewCard({
  formation,
  className = "",
}: Readonly<{
  formation: FormationModulaireListItem;
  className?: string;
}>) {
  const palette = getMentionThemePalette("green");

  return (
    <Link
      href={`/formations-modulaires/${formation.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 ${palette.hoverBorderStrong} p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-cover bg-center ${className}`}
      style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/motif_background8.jpg')" }}
    >
      {/* Voile clair pour garder le texte lisible par-dessus le motif */}
      <div className="absolute inset-0 bg-white/55" />

      <CaurisIcon
        className={`absolute -right-6 -bottom-8 w-32 rotate-[-12deg] ${palette.decorative} opacity-[0.14] group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
      />

      <div className="relative z-10">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-3">
          {formation.numero_module ? `Module ${formation.numero_module}` : 'Modulaire'}
        </span>
        <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">{formation.titre}</h4>
        {formation.duree_formation && (
          <p className="text-xs text-slate-500 mt-1">{formation.duree_formation}</p>
        )}
      </div>

      <span className={`relative z-10 text-sm font-semibold inline-flex items-center gap-1 mt-3 ${palette.text}`}>
        Découvrir
        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </span>
    </Link>
  );
}

const aboutStats = [
  { value: "35", label: "Ans d'expérience" },
  { value: "98%", label: "Taux de réussite" },
  { value: "20+", label: "Experts enseignants" },
];

const studioFeatures = [
  { icon: Camera, label: "Équipements professionnels" },
  { icon: User, label: "Encadrement qualifié" },
  { icon: Clapperboard, label: "Apprentissage pratique" },
  { icon: GraduationCap, label: "Ouvert aux étudiants" },
];

export default async function HomePage() {
  const [institut, studios, radio, latestBlogs, mentions, formationsModulaires] = await Promise.all([
    getInstitutSettings(),
    getStudios(),
    getRadio(),
    getLatestBlogs(5),
    getMentions(),
    getFormationsModulaires(),
  ]);

  // Collage de photos réelles pour la section Studios de l'accueil : on choisit
  // volontairement quelques clichés représentatifs (studio, console, montage,
  // étudiants) plutôt qu'un simple ordre séquentiel, avec repli si l'un d'eux
  // venait à être retiré du dashboard.
  const findStudioImage = (slug: string) => studios.find((s) => s.slug === slug)?.images?.[0];
  const studioCollage = [
    findStudioImage('studio-enregistrement-manu-dibango') || studios[0]?.images?.[0],
    findStudioImage('studio-alain-foka') || studios[1]?.images?.[0],
    institut?.galerie?.[0] || studios[2]?.images?.[0],
    findStudioImage('studio-video-francois-de-sales') || studios[3]?.images?.[0],
  ].filter((src): src is string => Boolean(src));

  const orderedMentions = [...mentions].sort((a, b) => {
    const indexA = MENTION_DISPLAY_ORDER.indexOf(a.slug);
    const indexB = MENTION_DISPLAY_ORDER.indexOf(b.slug);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  // Nom de l'institut coupé en deux (pour l'effet de profondeur du hero, logo en
  // verre entre les deux lignes) — calculé sur le vrai nom, pas figé en dur.
  const nomMots = (institut?.nom || 'Institut Supérieur Don Bosco').split(' ');
  const heroNomHaut = nomMots.slice(0, Math.ceil(nomMots.length / 2)).join(' ');
  const heroNomBas = nomMots.slice(Math.ceil(nomMots.length / 2)).join(' ');

  const formationsApercu = formationsModulaires.slice(0, 3);

  const [featuredBlog, ...otherBlogs] = latestBlogs;

  return (
    <div className="min-h-screen">
      {/* Essai : motif wavyPattern.jpg en fond de toutes les pages publiques.
          Visible uniquement derrière les sections sans couleur de fond propre. */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-repeat opacity-20"
        style={{ backgroundImage: "url('/motif_background6.jpg')", backgroundSize: '480px 480px' }}
      />
      <MyNavFloating />

      {/* Hero Section — photo floutée/assombrie en fond, nom de l'institut en deux
          lignes avec le logo en verre superposé entre les deux (effet de
          profondeur), accroche + CTA en bas à gauche, description en bas à droite.
          Version statique pour l'instant : la flèche de carrousel viendra quand
          plusieurs slides seront configurables depuis le dashboard. */}
      <section className="relative overflow-hidden bg-slate-950 h-screen flex flex-col">
        <div className="absolute inset-0 scale-110">
          <Image
            src="/immeuble_isdb.png"
            alt="Campus de l'Institut Supérieur Don Bosco"
            fill
            className="object-cover animate-hero-image"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80 animate-hero-overlay" />

        {/* Nom de l'institut en deux lignes + logo en verre : effet de profondeur
            "texte derrière le sujet". Empilement en z-index (du bas vers le haut) :
            1) "Institut Supérieur" (z-10) — 2) le logo (z-20), qui la recouvre donc
            partiellement — 3) "Don Bosco" (z-30), qui passe lui devant le logo.
            Le conteneur qui sert de repère au centrage du logo n'est PAS animé :
            seuls les éléments qu'il contient le sont, individuellement, pour que
            le titre et le logo gardent des trajectoires d'entrée indépendantes. */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="relative flex flex-col items-center">
            <h1 className={`${boldonse.className} relative z-10 animate-hero-drop text-white uppercase tracking-wide leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-8xl`}>
              {heroNomHaut}
            </h1>
            <h1 className={`${boldonse.className} relative z-30 animate-hero-drop text-white uppercase tracking-wide leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-12 md:mt-16`}>
              {heroNomBas}
            </h1>

            {/* Logo : centré sur ce même bloc (donc à la jonction des deux lignes),
                dimensionné en min(vh, vw) pour rester cohérent sur tous les formats,
                et décalé vers le bas pour que ses ~10% inférieurs soient rognés par
                le bas de la section (overflow-hidden). */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-[15%] z-20 select-none"
              style={{ width: 'min(82vh, 85vw)', height: 'min(82vh, 85vw)' }}
            >
              <div className="w-full h-full animate-hero-logo">
                <HeroGlassLogo className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Accroche + CTA (bas gauche) et description (bas droite), au même niveau */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="animate-hero-fade-left">
              <h2 className="text-white font-bold text-xl md:text-2xl leading-snug mb-5 max-w-xs">
                Votre formation d'excellence commence ici
              </h2>
              <Link
                href="/formations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 hover:scale-95 transition-all duration-300"
              >
                Découvrir les formations
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="max-w-xs text-right animate-hero-fade-right">
              <p className="text-white text-base md:text-lg leading-relaxed">
                Des formations innovantes, un encadrement de qualité et des studios
                professionnels pour révéler votre potentiel et construire votre avenir.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Formations Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Nos domaines de <span className={`${boldonse.className} text-isdb-green-600`}>formation</span>
            </h2>
            <p className="text-xl text-slate-600">
              Des programmes conçus pour répondre aux défis d'aujourd'hui et de demain
            </p>
          </RevealOnScroll>

          {orderedMentions.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {orderedMentions.map((mention, index) => {
                const palette = getMentionThemePalette(mention.theme);
                return (
                  <RevealOnScroll key={mention.id} delay={index * 100}>
                    <div
                      className={`group relative overflow-hidden rounded-2xl ${palette.solidBg} p-8 flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300`}
                    >
                      <CaurisIcon
                        className={`absolute -top-10 -right-14 w-64 rotate-[18deg] ${palette.decorative} opacity-40 group-hover:opacity-55 group-hover:rotate-[12deg] transition-all duration-500 pointer-events-none`}
                      />
                      <div className="relative z-10 flex flex-col flex-1 pt-32">
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{mention.titre}</h3>
                        <p className="text-slate-700/90 mb-6 flex-1">
                          {mention.description || 'Découvrez les offres de formation de cette filière.'}
                        </p>
                        <Link
                          href={`/formations/${mention.slug}`}
                          className={`inline-flex items-center font-semibold ${palette.text}`}
                        >
                          Explorer
                          <ArrowIcon className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/formations"
              className="inline-flex items-center px-8 py-3.5 bg-isdb-green-700 text-white font-semibold rounded-full shadow-md hover:bg-isdb-green-800 hover:scale-95 transition-all duration-300"
            >
              Voir toutes nos formations
              <ArrowIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Formations modulaires */}
      {formationsApercu.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <RevealOnScroll>
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-slate-300 text-xs font-semibold uppercase tracking-wide text-slate-600 mb-5">
                  Formation continue
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  Découvrez nos <span className={`${boldonse.className} text-isdb-green-600`}>formations continues</span> en cours du soir
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Envie d'une formation courte, pratique et professionnalisante, conçue pour
                  développer vos compétences et booster votre carrière ?
                </p>
                <Link
                  href="/formations-modulaires"
                  className="inline-flex items-center px-7 py-3.5 bg-isdb-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-isdb-green-800 hover:scale-95 transition-all duration-300"
                >
                  Voir toutes les formations modulaires
                  <ArrowIcon className="w-4 h-4 ml-2" />
                </Link>
              </RevealOnScroll>

              <RevealOnScroll delay={150} className="grid grid-cols-2 gap-4 h-[400px]">
                {/* Première colonne : deux cartes de hauteur égale */}
                <div className="flex flex-col gap-4">
                  {[formationsApercu[0], formationsApercu[2]].map((formation, idx) =>
                    formation ? (
                      <ModulePreviewCard key={formation.id} formation={formation} className="flex-1" />
                    ) : (
                      <div key={`empty-${idx}`} className="flex-1 rounded-2xl bg-slate-50" />
                    )
                  )}
                </div>

                {/* Deuxième colonne : répartition asymétrique 75% / 25% */}
                <div className="flex flex-col gap-4">
                  {formationsApercu[1] ? (
                    <ModulePreviewCard formation={formationsApercu[1]} className="flex-[3]" />
                  ) : (
                    <div className="flex-[3] rounded-2xl bg-slate-50" />
                  )}

                  <Link
                    href="/formations-modulaires"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-isdb-green-700 to-isdb-green-800 p-4 flex items-center justify-between gap-3 flex-1 hover:from-isdb-green-800 hover:to-isdb-green-900 transition-colors duration-300"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-white leading-snug text-sm">Toutes les formations</h4>
                      <span className="text-xs font-semibold text-isdb-green-100 inline-flex items-center gap-1">
                        Voir plus
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <Layers className="text-white" size={14} />
                    </div>
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      )}

      {/* Actualités */}
      {featuredBlog && (
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <RevealOnScroll className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Actualités de <span className={`${boldonse.className} text-isdb-green-600`}>l&apos;ISDB</span>
              </h2>
              <div className="w-16 h-1 bg-isdb-green-600 rounded-full mx-auto mb-5" />
              <p className="text-lg text-slate-600">Restez informé des nouvelles et évènements de l'institut</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
              {/* Article à la une */}
              <RevealOnScroll className="lg:col-span-3">
                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[480px]"
                >
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.titre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  {featuredBlog.tags[0] && (
                    <span
                      className="absolute top-5 left-5 text-xs px-3 py-1.5 rounded-full font-semibold bg-white/90"
                      style={{ color: featuredBlog.tags[0].couleur || '#206b38' }}
                    >
                      {featuredBlog.tags[0].nom}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3 line-clamp-3">
                      {featuredBlog.titre}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-white/80">
                      <Calendar size={14} />
                      {featuredBlog.dateCreation}
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>

              {/* Autres articles récents */}
              {otherBlogs.length > 0 && (
                <RevealOnScroll delay={150} className="lg:col-span-2 flex flex-col lg:h-[480px] justify-between gap-6">
                  {otherBlogs.slice(0, 4).map((blog) => (
                    <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group flex items-start gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <Image
                          src={blog.coverImage}
                          alt={blog.titre}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 group-hover:text-isdb-green-600 transition-colors line-clamp-2 mb-1.5">
                          {blog.titre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar size={12} />
                          {blog.dateCreation}
                        </div>
                      </div>
                    </Link>
                  ))}
                </RevealOnScroll>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center px-8 py-3.5 bg-isdb-green-700 text-white text-lg font-semibold rounded-full shadow-md hover:bg-isdb-green-800 hover:scale-95 transition-all duration-300"
              >
                Voir toutes nos actualités
                <ArrowIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Radio Section : pleine largeur d'écran (pas de container ni de vw, pour éviter
          tout risque de scroll horizontal) — le padding gauche est appliqué directement
          sur le bloc de texte pour rester aligné avec le reste du site. */}
      <section className="relative overflow-hidden bg-[#04140a] min-h-[500px] flex items-center py-14">
        {/* Photo de fond, visible côté droit */}
        {radio?.image && (
          <Image
            src={radio.image}
            alt={radio.nom}
            fill
            className="object-cover"
            style={{ objectPosition: 'right center' }}
            sizes="100vw"
          />
        )}

        {/* Voile sombre côté texte, qui se dissipe vers la photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,20,10,0.98) 0%, rgba(4,20,10,0.92) 40%, rgba(4,20,10,0.45) 65%, rgba(4,20,10,0.05) 88%)',
          }}
        />
        {/* Lueur verte derrière l'antenne */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 72% 40%, rgba(102, 200, 123, 0.36), transparent 55%)' }}
        />

        {/* Points décoratifs, coin haut-gauche */}
        <div
          className="hidden md:block absolute left-8 top-8 w-28 h-20 opacity-30 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
        />

        {/* Onde sonore décorative, entre le texte et l'antenne */}
        <svg
          className="hidden lg:block absolute left-[60%] w-[24%] h-16 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,30 L60,30 L72,8 L84,52 L96,14 L108,46 L120,22 L132,38 L150,30 L300,30"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        {/* Antenne (antenne3.png, déjà verte) : agrandie, base ancrée en bas de la section.
            Les anneaux de signal sont positionnés en % à l'intérieur du même conteneur
            (aligné sur le cercle du haut de l'antenne, ~21% depuis le haut de l'image),
            pour rester bien calés derrière elle si la taille est retouchée plus tard. */}
        <div className="hidden lg:block absolute left-[62%] -bottom-30 h-[320px] xl:h-[480px] aspect-[2/3] pointer-events-none">
          <span className="absolute left-1/2 top-[21%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-isdb-green-400/25" />
          <span className="absolute left-1/2 top-[21%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-isdb-green-400/15 animate-pulse" />
          <span className="absolute left-1/2 top-[21%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-isdb-green-400/10" />
          <Image src="/antenne3.png" alt="" fill className="object-contain object-bottom" sizes="400px" />
        </div>

        {/* Texte : enveloppé dans le même container que les autres sections, pour un
            alignement gauche identique (cette section n'a pas de mx-auto puisqu'elle
            est pleine largeur, donc l'alignement doit être recréé explicitement ici). */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 w-full">
          <RevealOnScroll className="max-w-md">
            {radio?.enDirect && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-isdb-red-500 text-white text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                En direct
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              ISDB est à <span className={`${boldonse.className} text-[#66C87B]`}>l'antenne</span>
            </h2>
            <div className="h-1 w-16 bg-[#66C87B] rounded-full mb-5" />
            <p className="text-lg text-slate-300 mb-8">
              Suivez-nous en direct sur la radio de l'institut et restez connectés à l'actualité,
              la culture et l'éducation.
            </p>
            <Link
              href="/radio"
              className="group inline-flex items-center gap-3 pl-2 pr-6 py-2 bg-white text-slate-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-95 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-full bg-isdb-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-isdb-green-700 transition-colors">
                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
              </span>
              Écouter la radio
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Studios Section */}
      <section className="py-30 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Collage de photos */}
            <RevealOnScroll className="order-2 lg:order-1">
              {studioCollage.length > 0 ? (
                <>
                  {/* Mobile / tablette : grille simple, sans chevauchement */}
                  <div className="grid grid-cols-2 gap-3 lg:hidden">
                    {studioCollage.slice(0, 4).map((src, index) => (
                      <div
                        key={src}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:z-10 ${
                          index === 0 ? 'col-span-2 aspect-video' : ''
                        }`}
                      >
                        <Image src={src} alt="Studios ISDB" fill className="object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Desktop : collage artistique en photos superposées. Chaque carte porte
                      une légère inclinaison au repos ; au survol elle grossit, se redresse
                      et passe devant les autres, puis revient en douceur à l'état initial. */}
                  <div className="hidden lg:block relative h-[440px]">
                    {studioCollage[0] && (
                      <div className="absolute left-0 top-0 w-[62%] aspect-[4/3] rotate-[-3deg] rounded-2xl overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ease-out hover:scale-110 hover:rotate-0 hover:-translate-y-2 hover:shadow-2xl hover:z-30">
                        <Image src={studioCollage[0]} alt="Studios ISDB" fill className="object-cover" sizes="35vw" />
                      </div>
                    )}
                    {studioCollage[1] && (
                      <div className="absolute right-0 top-4 w-[42%] aspect-[4/3] rotate-[3deg] rounded-2xl overflow-hidden border-4 border-white shadow-xl z-10 transition-all duration-500 ease-out hover:scale-110 hover:rotate-0 hover:-translate-y-2 hover:shadow-2xl hover:z-30">
                        <Image src={studioCollage[1]} alt="Studios ISDB" fill className="object-cover" sizes="25vw" />
                      </div>
                    )}
                    {studioCollage[2] && (
                      <div className="absolute left-4 bottom-0 w-[38%] aspect-[4/3] rotate-[-2deg] rounded-2xl overflow-hidden border-4 border-white shadow-xl z-10 transition-all duration-500 ease-out hover:scale-110 hover:rotate-0 hover:-translate-y-2 hover:shadow-2xl hover:z-30">
                        <Image src={studioCollage[2]} alt="Studios ISDB" fill className="object-cover" sizes="22vw" />
                      </div>
                    )}
                    {studioCollage[3] && (
                      <div className="absolute right-2 bottom-4 w-[56%] aspect-[4/3] rotate-[2deg] rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-20 transition-all duration-500 ease-out hover:scale-110 hover:rotate-0 hover:-translate-y-2 hover:shadow-2xl hover:z-30">
                        <Image src={studioCollage[3]} alt="Studios ISDB" fill className="object-cover" sizes="32vw" />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-isdb-green-50 shadow-xl flex items-center justify-center">
                  <Clapperboard className="text-isdb-green-400" size={48} />
                </div>
              )}
            </RevealOnScroll>

            {/* Texte */}
            <RevealOnScroll delay={150} className="order-1 lg:order-2">
              <span className="inline-flex items-center px-3 py-2 rounded-full bg-isdb-green-100 text-isdb-green-700 text-xs font-semibold uppercase tracking-wide mb-5">
                Expérience pratique
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                Des studios professionnels pour apprendre <span className={`${boldonse.className} text-isdb-green-600`}>en pratiquant</span>
              </h2>
              <div className="h-1 w-16 bg-isdb-green-600 rounded-full mb-6" />
              <p className="text-lg text-slate-600 mb-10">
                Au-delà des salles de cours, l'ISDB met à disposition des studios modernes équipés
                pour l'audio, la vidéo, la radio et la production. Un environnement idéal pour
                développer vos compétences et révéler votre talent.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 mb-10">
                {studioFeatures.map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className="w-11 h-11 mx-auto sm:mx-0 rounded-full bg-isdb-green-100 flex items-center justify-center mb-3">
                      <Icon className="text-isdb-green-700" size={18} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
              
              <Link
                href="/studios"
                className="inline-flex items-center px-8 py-4 bg-isdb-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-isdb-green-800 hover:scale-95 transition-all duration-300"
              >
                Découvrir nos studios
                <ArrowIcon className="w-5 h-5 ml-2" />
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* À propos teaser */}
      <section className="relative py-20 md:py-32 bg-isdb-green-50 overflow-hidden group">
        {/* Logo en verre, centré en fond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[420px] h-[420px] md:w-[560px] md:h-[560px]">
            <Image src="/isdb-en-verre.png" alt="" fill className="object-contain opacity-[0.18]" />

            {/* Reflet qui glisse au survol de la section, confiné à la forme du logo
                via un masque CSS (l'image sert de pochoir au dégradé mobile). */}
            <div
              className="absolute inset-0 transition-[background-position] duration-[1400ms] ease-in-out opacity-70 group-hover:opacity-100 [background-position:120%_-20%] group-hover:[background-position:-20%_120%]"
              style={{
                backgroundImage: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)',
                backgroundSize: '300% 300%',
                WebkitMaskImage: 'url(/isdb-en-verre.png)',
                maskImage: 'url(/isdb-en-verre.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <RevealOnScroll className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {institut?.nom || "Institut Supérieur Don Bosco"}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              {institut?.description ||
                "Institution d'excellence dédiée à l'éducation, la recherche et l'innovation, l'ISDB accompagne chaque étudiant dans la construction d'un parcours académique solide et d'un projet professionnel durable."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-10">
              {aboutStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-isdb-green-700">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 bg-white text-isdb-green-600 font-semibold rounded-xl border-2 border-isdb-green-200 hover:border-isdb-green-300 hover:scale-95 shadow-sm transition-all duration-300"
            >
              En savoir plus sur l'ISDB
              <ArrowIcon className="w-5 h-5 ml-2" />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <RevealOnScroll className="max-w-4xl mx-auto text-center bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre <span className={`${boldonse.className} text-isdb-gold-300`}>avenir</span> ?
            </h2>
            <p className="text-xl text-isdb-green-100 mb-8 max-w-2xl mx-auto">
              Rejoignez une communauté d'apprenants passionnés et bénéficiez d'un
              accompagnement d'excellence tout au long de votre parcours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admission"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 hover:scale-95 transition-all duration-300 shadow-lg"
              >
                Postuler maintenant
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 hover:scale-95 transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
}
