// app/formations/philosophie/page.tsx
import FormationCard from '@/components/layout/formationCard';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import DiscoverCard from '@/components/layout/discoverdCard';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

export default function PhilosophiePage() {
  const formations = [
    {
      id: 1,
      title: "Licence Fondamentale en Science de l'Homme et de la Société",
      description: "Une formation complète en philosophie qui explore les grands courants de pensée, de l'Antiquité à la philosophie contemporaine. Développez votre esprit critique et votre capacité d'analyse à travers l'étude des textes fondamentaux et des concepts majeurs.",
      badge: "Philosophie",
      link: "/formations/philosophie/licence-fondamentale",
      highlights: ["3 années", "Bac+3", "180 crédits ECTS"]
    },
    {
      id: 2,
      title: "Master Recherche en Philosophie Contemporaine",
      description: "Spécialisez-vous dans les courants philosophiques modernes et contemporains. Ce programme avancé vous prépare à la recherche académique avec une approche rigoureuse des méthodologies philosophiques et une ouverture aux enjeux actuels.",
      badge: "Philosophie",
      link: "/formations/philosophie/master-recherche",
      highlights: ["2 années", "Bac+5", "120 crédits ECTS"]
    },
    {
      id: 3,
      title: "Certificat d'Éthique Appliquée",
      description: "Formation professionnalisante centrée sur les applications pratiques de l'éthique dans divers domaines : santé, environnement, technologie et entreprise. Acquérez des outils concrets pour analyser et résoudre les dilemmes éthiques.",
      badge: "Philosophie",
      link: "/formations/philosophie/certificat-ethique",
      highlights: ["1 année", "Certification", "60 crédits ECTS"]
    }
  ];

  const discoverItems = [
    {
      title: "Science de l'éducation",
      color: "bg-gradient-to-r from-red-400 to-red-300",
      link: "/formations/science-education"
    },
    {
      title: "Communication",
      color: "bg-gradient-to-r from-lime-400 to-lime-300",
      link: "/formations/communication"
    },
    {
      title: "Marketing",
      color: "bg-gradient-to-r from-amber-400 to-amber-300",
      link: "/formations/marketing"
    }
  ];

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Formations', href: '/formations' },
    { label: 'Philosophie', href: '/formations/philosophie' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-isdb-green-800 via-isdb-green-600 to-isdb-green-500 text-white py-20 px-6 overflow-hidden">
        {/* Effet de fond */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-isdb-green-400/20 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-isdb-green-300/10 rounded-full -translate-x-64 translate-y-64" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <Breadcrumbs breadcrumbs={breadcrumbItems} />
          
          <div className="mt-8 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <p className='uppercase tracking-wide'>Philosophie</p> 
              <span className="block capitalize text-3xl md:text-4xl font-light mt-8 text-isdb-green-100">
                Penser le monde, comprendre l'humain
              </span>
            </h1>
            
            <p className="text-xl text-isdb-green-100 leading-relaxed">
              Nos formations en philosophie vous invitent à explorer les grandes questions de l'existence, 
              à développer votre esprit critique et à acquérir des outils précieux pour comprendre notre époque.
            </p>
          </div>
        </div>
      </div>

      {/* Introduction concise */}
      <div className=" py-12"> {/* Ajouter le margin et l'auto-center mx-auto max-w-6xl */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Formations en Philosophie
          </h2>
          <p className="text-lg text-slate-600">
            Découvrez nos parcours de formation conçus pour développer votre esprit critique et votre 
            capacité d'analyse, de la licence fondamentale aux spécialisations avancées.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-58 md:mb-70 mx-auto max-w-6xl px-6">
          <div className="text-center p-6 bg-isdb-green-50 rounded-lg border border-isdb-green-100">
            <div className="text-3xl font-bold text-isdb-green-700 mb-2">3</div>
            <div className="text-sm text-slate-600">Parcours de formation</div>
          </div>
          <div className="text-center p-6 bg-isdb-green-50 rounded-lg border border-isdb-green-100">
            <div className="text-3xl font-bold text-isdb-green-700 mb-2">180</div>
            <div className="text-sm text-slate-600">Crédits ECTS en licence</div>
          </div>
          <div className="text-center p-6 bg-isdb-green-50 rounded-lg border border-isdb-green-100">
            <div className="text-3xl font-bold text-isdb-green-700 mb-2">100%</div>
            <div className="text-sm text-slate-600">Enseignants experts</div>
          </div>
        </div>

        {/* Section des formations avec background différent */}
        <div className="relative w-full">
          {/* Titre outline positionné au-dessus de la section */}
          <div className="relative z-10 mb-8">
            <div className="relative">
              <div className="absolute -top-24 left-8 lg:-top-42 lg:left-16">
                {/* Texte outline qui dépasse vers le haut */}
                <h2 
                  className="text-5xl md:text-6xl lg:text-8xl font-black leading-none pointer-events-none select-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #206b38',
                    // textStroke: '2px #206b38',
                    opacity: 0.8,
                    filter: 'drop-shadow(0 4px 6px rgba(32, 107, 56, 0.1))'
                  }}
                >
                  OFFRES DE<br />FORMATIONS
                </h2>
                
                {/* Petits éléments décoratifs autour du texte */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-isdb-green-400/30"></div>
                </div>
                <div className="absolute bottom-8 -left-2">
                  <div className="w-2 h-2 rounded-full bg-isdb-beige-400/40"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section avec fond différent qui commence APRÈS le texte outline */}
          <div className="relative py-20 px-6 bg-gradient-to-b from-isdb-green-50 via-white to-isdb-green-50 w-full border border-isdb-green-100/50 shadow-lg">
            {/* Effets décoratifs dans la section */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-isdb-green-300 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-isdb-green-300 to-transparent" />
            
            {/* Points décoratifs flottants */}
            <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-isdb-green-300/30 blur-sm"></div>
            <div className="absolute bottom-1/3 left-8 w-3 h-3 rounded-full bg-isdb-beige-400/40 blur-sm"></div>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-isdb-green-400/20 blur-sm"></div>
            
            <div className="container mx-auto max-w-6xl relative">
              <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                {/* Colonne droite avec les cartes de formations */}
                <div className="">
                  <div className="space-y-16">
                    {formations.map((formation, index) => (
                      <div key={formation.id} className="relative group">
                        {/* Indicateur numérique flottant */}
                        {/* <div className="absolute -left-8 top-0 lg:-left-12 flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 animate-ping bg-isdb-green-400/30 rounded-full"></div>
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-isdb-green-500 to-isdb-green-700 text-white font-bold text-lg shadow-lg z-10">
                              {index + 1}
                            </div>
                          </div>
                          <div className="h-px w-8 bg-gradient-to-r from-isdb-green-500 to-transparent" />
                        </div> */}
                        
                        <FormationCard {...formation} />
                        
                        {/* Highlights */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                          {formation.highlights.map((highlight, idx) => (
                            <span 
                              key={idx} 
                              className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-isdb-green-100 text-isdb-green-700 text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        {/* Ligne de séparation décorative */}
                        {index < formations.length - 1 && (
                          <div className="mt-16 flex justify-center">
                            <div className="relative w-2/3">
                              <div className="h-px bg-gradient-to-r from-transparent via-isdb-green-300/50 to-transparent" />
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-isdb-green-50 to-white flex items-center justify-center border border-isdb-green-200">
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-isdb-green-500 to-isdb-green-600"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Espace après la section */}
          <div className="h-20"></div>

          {/* Discover Section */}
          <div className="mb-20 mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Découvrez aussi
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Explorez nos autres domaines de formation pour élargir vos horizons académiques
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {discoverItems.map((item, index) => (
                <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <DiscoverCard {...item} />
                </div>
              ))}
            </div>
          </div>

          {/* CTA simple */}
          <div className='px-6'>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-isdb-green-200 bg-gradient-to-br from-white to-isdb-green-50 mb-12">
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23206b38' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              <div className="relative z-10 py-16 px-8 text-center">
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                  Prêt à commencer votre parcours philosophique ?
                </h3>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                  Rejoignez une communauté passionnée par la connaissance et l'excellence intellectuelle
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact"
                    className="px-8 py-4 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white font-medium rounded-xl hover:from-isdb-green-700 hover:to-isdb-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Nous contacter
                  </a>
                  <a 
                    href="/admissions"
                    className="px-8 py-4 bg-white border-2 border-isdb-green-600 text-isdb-green-600 font-medium rounded-xl hover:bg-isdb-green-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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