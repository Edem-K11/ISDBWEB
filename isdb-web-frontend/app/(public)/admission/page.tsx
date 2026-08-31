

// app/(public)/admission/page.tsx
import Link from 'next/link';
import { getInstitutSettings } from '@/lib/api/institut';
import FeesAccordion from '@/components/admission/feesAccordion';

// Formate une date "YYYY-MM-DD" façon "1er septembre 2026" (ordinal français
// pour le 1er du mois), ou renvoie un texte de repli si la date n'est pas
// encore renseignée dans les paramètres de l'institut.
function formatAdmissionDate(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDate();
  const dayLabel = day === 1 ? '1er' : String(day);
  const month = date.toLocaleDateString('fr-FR', { month: 'long' });
  return `${dayLabel} ${month} ${date.getFullYear()}`;
}

export default async function AdmissionPage() {
  const institut = await getInstitutSettings();

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-isdb-green-600 via-isdb-green-700 to-isdb-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative mx-auto px-6 md:px-12 pt-22 pb-12 sm:pb-20 lg:py-28">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rejoignez l'excellence académique
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-isdb-green-100 mb-8">
              Votre avenir commence ici. Découvrez notre processus d'admission et lancez votre parcours vers le succès.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 sm:px-8 sm:py-4 bg-white text-isdb-green-600 font-semibold rounded-xl hover:bg-isdb-green-50 transition-all duration-300 shadow-lg text-sm sm:text-lg"
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
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-isdb-green-600 mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base md:text-lg text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
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
          </div>
        </div>
      </section>

      {/* Fees Section with Accordion */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frais de scolarité
            </h2>
            <p className="text-xl text-gray-600">
              Des frais transparents et adaptés pour chaque programme
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FeesAccordion items={faqItems} />

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

      

      {/* Info Section */}
      <section className="py-12 bg-isdb-green-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dates importantes</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-700">Ouverture des inscriptions</span>
                  <span className="font-semibold text-isdb-green-600">
                    {formatAdmissionDate(institut?.date_ouverture_inscriptions, '1er septembre')}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-700">Clôture des inscriptions</span>
                  <span className="font-semibold text-isdb-green-600">
                    {formatAdmissionDate(institut?.date_cloture_inscriptions, '30 novembre')}
                  </span>
                </li>
                <li className="flex justify-between items-center pb-3">
                  <span className="text-gray-700">Rentrée des cours</span>
                  <span className="font-semibold text-isdb-green-600">
                    {formatAdmissionDate(institut?.date_rentree, '15 janvier')}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h3>
              <p className="text-gray-600 mb-6">
                Pour toute question concernant l'admission, notre équipe est à votre disposition.
              </p>
              <div className="space-y-3">
                {[institut?.telephone, institut?.telephone_2].filter(Boolean).map((telephone) => (
                  <div key={telephone} className="flex items-center">
                    <svg className="w-5 h-5 text-isdb-green-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${telephone!.replace(/\s+/g, '')}`} className="text-gray-700 hover:text-isdb-green-600 transition-colors">
                      {telephone}
                    </a>
                  </div>
                ))}
                {[institut?.email, institut?.email_2].filter(Boolean).map((email) => (
                  <div key={email} className="flex items-center">
                    <svg className="w-5 h-5 text-isdb-green-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${email}`} className="text-gray-700 hover:text-isdb-green-600 transition-colors break-all">
                      {email}
                    </a>
                  </div>
                ))}
                {institut?.adresse && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-isdb-green-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{institut.adresse}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}