

// app/(public)/admission/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdmissionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: 'Licence Philosophie ou Sciences de l\'Éducation',
      answer: (
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de dossier à la première inscription en Licence</span>
            <span className="font-semibold text-isdb-green-600">10 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription annuelle non remboursables</span>
            <span className="font-semibold text-isdb-green-600">25 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais divers (Assurances ; Carte ; activités para académique ; uniforme)</span>
            <span className="font-semibold text-isdb-green-600">50 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de jury (Licences Semestre 6)</span>
            <span className="font-semibold text-isdb-green-600">50 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription pédagogique en Licence 1 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">565 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription pédagogique en Licence 2 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">555 000 F CFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Frais d'inscription pédagogique en Licence 3 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">615 000 F CFA</span>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Total approximatif pour les 3 ans :</strong> 1 735 000 F CFA
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      question: 'Licence Sciences et Techniques de la Communication',
      answer: (
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de dossier à la première inscription de la licence</span>
            <span className="font-semibold text-isdb-green-600">10 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription annuelle non remboursables</span>
            <span className="font-semibold text-isdb-green-600">25 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais divers (Assurances ; Carte ; activités para académique ; uniforme)</span>
            <span className="font-semibold text-isdb-green-600">50 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de jury (Licences 6)</span>
            <span className="font-semibold text-isdb-green-600">50 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription pédagogique Licence 1 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">635 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription pédagogique Licence 2 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">625 000 F CFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Frais d'inscription pédagogique Licence 3 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">675 000 F CFA</span>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Total approximatif pour les 3 ans :</strong> 1 955 000 F CFA
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      question: 'Master recherche Philosophie ou Master Professionnel Sciences de l\'Éducation',
      answer: (
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de dossier à la première inscription de Master</span>
            <span className="font-semibold text-isdb-green-600">15 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription annuelle non remboursables</span>
            <span className="font-semibold text-isdb-green-600">30 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais divers (Assurances ; Carte ; activités para académique ; uniforme)</span>
            <span className="font-semibold text-isdb-green-600">40 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de stage</span>
            <span className="font-semibold text-isdb-green-600">25 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais de jury (Soutenance) (non inclus dans les frais d'inscription pédagogiques)</span>
            <span className="font-semibold text-isdb-green-600">150 000 F CFA</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-700">Frais d'inscription pédagogique en Master 1 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">750 000 F CFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Frais d'inscription pédagogique en Master 2 (60 ECTS)</span>
            <span className="font-semibold text-isdb-green-600">895 000 F CFA</span>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Total approximatif pour les 2 ans :</strong> 1 895 000 F CFA
            </p>
          </div>
        </div>
      )
    }
  ];

  const documents = [
    'Une lettre adressée au Directeur académique précisant le parcours sollicité',
    'Deux copies de l\'attestation de BAC ou d\'un titre équivalent (dont une légalisée)',
    'Deux copies du relevé du BAC (dont une légalisée)',
    'Deux photos d\'identité',
    'Une copie légalisée de l\'acte de naissance',
    'Une copie légalisée du certificat de nationalité',
    'Une fiche d\'inscription (à retirer au secrétariat de l\'ISDB) dûment remplie'
  ];

  const stats = [
    { value: '100%', label: 'Étudiants prêts à l\'emploi' },
    { value: '126', label: 'Travailleurs' },
    { value: '2480', label: 'Étudiants enregistrés' },
    { value: '35', label: 'Ans d\'expérience' },
    { value: '7856', label: 'Apprenants satisfaits' }
  ];

  const successStories = [
    {
      name: 'Marie Kaboré',
      role: 'Diplômée en Communication 2022',
      quote: 'L\'ISDB m\'a donné toutes les clés pour réussir dans le monde professionnel. Aujourd\'hui, je dirige ma propre agence de communication.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Abdoulaye Traoré',
      role: 'Diplômé en Philosophie 2021',
      quote: 'La formation en philosophie à l\'ISDB a transformé ma vision du monde. Je suis maintenant enseignant-chercheur à l\'université.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Aïcha Diallo',
      role: 'Diplômée en Sciences de l\'Éducation 2023',
      quote: 'Grâce à l\'accompagnement personnalisé, j\'ai pu développer un projet éducatif innovant qui bénéficie maintenant à des centaines d\'enfants.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-isdb-green-600 via-isdb-green-700 to-isdb-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rejoignez l'excellence académique
            </h1>
            <p className="text-xl md:text-2xl text-isdb-green-100 mb-8">
              Votre avenir commence ici. Découvrez notre processus d'admission et lancez votre parcours vers le succès.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 transition-all duration-300 shadow-lg text-lg"
            >
              Commencer votre inscription
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-isdb-green-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-isdb-green-600 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comment s'inscrire à l'ISDB ?
            </h2>
            <p className="text-xl text-gray-600">
              Un processus simple et transparent pour commencer votre parcours académique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative">
              <div className="w-12 h-12 bg-isdb-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Préparation du dossier</h3>
              <p className="text-gray-600">
                Rassemblez tous les documents nécessaires selon la liste fournie ci-dessous.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-isdb-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dépôt au secrétariat</h3>
              <p className="text-gray-600">
                Présentez votre dossier complet au secrétariat de l'ISDB pour examen.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-isdb-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Validation et inscription</h3>
              <p className="text-gray-600">
                Après validation, procédez au paiement des frais et finalisez votre inscription.
              </p>
            </div>
          </div>

          {/* Documents Required */}
          <div className="bg-gradient-to-r from-isdb-green-50 to-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Pièces à fournir</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-isdb-green-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white rounded-lg border border-isdb-green-200">
              <p className="text-gray-600">
                <strong>Note :</strong> Tous les documents doivent être présentés en original pour vérification. 
                Les copies doivent être certifiées conformes aux originaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fees Section with Accordion */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frais de scolarité
            </h2>
            <p className="text-xl text-gray-600">
              Des frais transparents et adaptés pour chaque programme
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-isdb-green-600 transform transition-transform duration-200 ${
                        openFaq === item.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      openFaq === item.id ? 'max-h-96 pb-5' : 'max-h-0'
                    }`}
                  >
                    <div className="pt-2">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 rounded-2xl p-8 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Des facilités de paiement disponibles</h3>
                  <p className="text-isdb-green-100">
                    Possibilité de paiement en plusieurs fois. Contactez-nous pour plus d'informations.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 lg:mt-0 inline-flex items-center px-6 py-3 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 transition-all duration-300"
                >
                  En savoir plus
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les parcours inspirants de nos anciens étudiants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative p-8">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.color} mb-4`} />
                    <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                    <p className="text-isdb-green-600 font-medium">{story.role}</p>
                  </div>
                  <blockquote className="text-gray-600 italic border-l-4 border-isdb-green-300 pl-4">
                    "{story.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à écrire votre propre success story ?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'apprenants et bénéficiez d'un accompagnement d'excellence 
              tout au long de votre parcours académique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-isdb-green-700 hover:to-isdb-green-800 transition-all duration-300"
              >
                Commencer mon inscription
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/formations"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                Explorer nos formations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-isdb-green-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dates importantes</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-700">Ouverture des inscriptions</span>
                  <span className="font-semibold text-isdb-green-600">1er Septembre</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-700">Clôture des inscriptions</span>
                  <span className="font-semibold text-isdb-green-600">30 Novembre</span>
                </li>
                <li className="flex justify-between items-center pb-3">
                  <span className="text-gray-700">Début des cours</span>
                  <span className="font-semibold text-isdb-green-600">15 Janvier</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h3>
              <p className="text-gray-600 mb-6">
                Pour toute question concernant l'admission, notre équipe est à votre disposition.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-isdb-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">+226 XX XX XX XX</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-isdb-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">admission@isdb.edu</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-isdb-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">Ouagadougou, Burkina Faso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}