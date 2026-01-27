

// app/(public)/page.tsx
import Image from "next/image";
import Link from "next/link";
import MyNavFloating from "@/components/layout/navbar2";
import Footer from "@/components/layout/footer";
import RelatedBlogs from "@/components/blog/relatedBlogs";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MyNavFloating />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-isdb-green-50 via-white to-slate-50 pt-28 pb-20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="container relative mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Votre formation d'excellence <span className="text-isdb-green-600">commence ici</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                L'ISDB vous accompagne dans votre parcours académique avec des formations 
                innovantes, un accompagnement personnalisé et des opportunités uniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/formations" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-isdb-green-700 hover:to-isdb-green-800 transition-all duration-300"
                >
                  Découvrir nos formations
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/admission" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-isdb-green-600 font-semibold rounded-xl border-2 border-isdb-green-200 hover:border-isdb-green-300 hover:bg-isdb-green-50 transition-all duration-300"
                >
                  Postuler maintenant
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/isdb_img1.png"
                  alt="Campus ISDB"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
              
              {/* Stats overlay */}
              <div className="absolute -bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-isdb-green-600">98%</div>
                    <div className="text-sm text-slate-600">Taux de réussite</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-isdb-green-600">20+</div>
                    <div className="text-sm text-slate-600">Experts enseignants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-isdb-green-600">10+</div>
                    <div className="text-sm text-slate-600">Années d'expérience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-slate-600">
            Lancer au TOGO depuis 1975
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-slate-600">
              Un accompagnement complet de l'inscription à l'insertion professionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-isdb-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Formations certifiantes</h3>
              <p className="text-slate-600 mb-6">
                Des programmes reconnus par l'État et les professionnels du secteur, 
                conçus pour répondre aux besoins du marché.
              </p>
              <Link href="/formations" className="text-isdb-green-600 font-semibold inline-flex items-center">
                Explorer les formations
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-isdb-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Accompagnement personnalisé</h3>
              <p className="text-slate-600 mb-6">
                Un suivi individualisé avec des tuteurs dédiés et un accès à notre 
                plateforme d'apprentissage en ligne 24h/24.
              </p>
              <Link href="/about" className="text-isdb-green-600 font-semibold inline-flex items-center">
                Découvrir notre méthode
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-isdb-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Insertion professionnelle</h3>
              <p className="text-slate-600 mb-6">
                Partenariats avec des entreprises leaders et accompagnement vers 
                l'emploi avec notre réseau de professionnels.
              </p>
              <Link href="/admission" className="text-isdb-green-600 font-semibold inline-flex items-center">
                Préparer votre avenir
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Modes Section
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Étudiez à votre rythme, où que vous soyez
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Que vous préfériez les cours en présentiel pour l'échange direct, 
                ou l'apprentissage à distance pour plus de flexibilité, l'ISDB s'adapte 
                à vos contraintes et aspirations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-isdb-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Cours en présentiel</h4>
                    <p className="text-slate-600">Sur notre campus moderne avec des équipements de pointe</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-isdb-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Formation à distance</h4>
                    <p className="text-slate-600">Accédez à tous vos cours depuis notre plateforme en ligne</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-isdb-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-isdb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Hybride</h4>
                    <p className="text-slate-600">Combine présentiel et distance selon vos disponibilités</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/images/online-learning.jpg"
                    alt="Apprentissage en ligne"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Notre plateforme d'apprentissage</h3>
                  <p className="text-slate-600 mb-6">
                    Accédez à vos cours, échangez avec vos professeurs et collègues, 
                    et gérez votre progression académique en toute simplicité.
                  </p>
                  <Link 
                    href="/formations" 
                    className="inline-flex items-center text-isdb-green-600 font-semibold"
                  >
                    Découvrir la plateforme
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Nos domaines de formation
            </h2>
            <p className="text-xl text-slate-600">
              Des programmes conçus pour répondre aux défis d'aujourd'hui et de demain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Philosophie</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Développez votre esprit critique et votre capacité d'analyse 
                avec nos programmes de philosophie approfondis.
              </p>
              <Link 
                href="/formations/philosophie" 
                className="inline-flex items-center text-purple-600 font-semibold relative z-10"
              >
                Explorer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Sciences de l'éducation</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Formez-vous aux méthodes pédagogiques innovantes et devenez 
                un acteur du changement éducatif.
              </p>
              <Link 
                href="/formations/science-education" 
                className="inline-flex items-center text-blue-600 font-semibold relative z-10"
              >
                Explorer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Communication</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Maîtrisez les outils de communication moderne et développez 
                votre influence dans un monde connecté.
              </p>
              <Link 
                href="/formations/communication" 
                className="inline-flex items-center text-green-600 font-semibold relative z-10"
              >
                Explorer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/formations" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-isdb-green-700 hover:to-isdb-green-800 transition-all duration-300"
            >
              Voir toutes nos formations
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ils témoignent de leur expérience
            </h2>
            <p className="text-xl text-slate-300">
              Découvrez les parcours inspirants de nos anciens étudiants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-white">Marie Dubois</h4>
                  <p className="text-slate-300 text-sm">Promotion 2023 - Philosophie</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "La formation en philosophie a transformé ma façon de penser et d'analyser 
                le monde. Les professeurs sont exceptionnels et l'encadrement personnalisé 
                fait toute la différence."
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-white">Thomas Martin</h4>
                  <p className="text-slate-300 text-sm">Promotion 2022 - Communication</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Grâce à la formation en communication, j'ai pu créer ma propre agence 
                dès l'obtention de mon diplôme. L'approche pratique et les stages m'ont 
                donné toutes les clés du succès."
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-white">Sophie Lambert</h4>
                  <p className="text-slate-300 text-sm">Promotion 2024 - Sciences de l'éducation</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Le programme de sciences de l'éducation est parfaitement adapté aux 
                réalités du terrain. J'ai pu immédiatement appliquer les concepts 
                appris dans mon travail d'enseignante."
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre avenir ?
            </h2>
            <p className="text-xl text-isdb-green-100 mb-8 max-w-2xl mx-auto">
              Rejoignez une communauté d'apprenants passionnés et bénéficiez d'un 
              accompagnement d'excellence tout au long de votre parcours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/admission" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 transition-all duration-300 shadow-lg"
              >
                Postuler maintenant
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Dernières actualités
              </h2>
              <p className="text-xl text-slate-600">
                Restez informé des dernières nouvelles et événements de l'ISDB
              </p>
            </div>
            <Link 
              href="/blogs" 
              className="inline-flex items-center px-6 py-3 text-isdb-green-600 font-semibold rounded-xl border border-isdb-green-200 hover:border-isdb-green-300 hover:bg-isdb-green-50 transition-all duration-300 mt-4 lg:mt-0"
            >
              Voir tous les articles
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* <RelatedBlogs currentBlogId={8} tags={} /> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}