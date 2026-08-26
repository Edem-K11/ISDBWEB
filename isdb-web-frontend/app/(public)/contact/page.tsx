import HeroSection from '@/components/layout/hero';
import ContactForm from '@/components/contact/contactForm';
import { getInstitutSettings } from '@/lib/api/institut';
import { SOCIAL_LINKS, getSocialHref } from '@/lib/utils/socialLinks';
import { getMapsHref } from '@/lib/utils/googleMaps';
import { MapPin, Phone, Mail, Printer, Globe, ExternalLink } from 'lucide-react';

const breadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Contact', href: '/contact', active: true },
];

export default async function ContactPage() {
  const institut = await getInstitutSettings();

  const contacts = [
    { icon: MapPin, label: 'Adresse', value: institut?.adresse },
    { icon: Phone, label: 'Téléphone', value: institut?.telephone },
    { icon: Mail, label: 'Email', value: institut?.email },
    { icon: Printer, label: 'Fax', value: institut?.fax },
    { icon: Globe, label: 'Site web', value: institut?.site_web },
  ].filter((c) => c.value);

  const socials = SOCIAL_LINKS.filter((s) => institut?.reseaux_sociaux[s.key]);
  const mapsHref = getMapsHref(institut?.maps_url);

  return (
    <div>
      <HeroSection
        title="Contactez-nous"
        description="Une question, une demande d'information ? Notre équipe est à votre écoute et vous répond dans les plus brefs délais."
        color="brand"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Informations de contact */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-isdb-green-600 px-6 py-5">
                <h2 className="text-white font-bold text-lg">Nos coordonnées</h2>
                <p className="text-isdb-green-100 text-sm mt-1">{institut?.nom}</p>
              </div>

              {contacts.length > 0 ? (
                <div className="px-6 py-6 space-y-5">
                  {contacts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 text-sm">
                      <div className="w-9 h-9 rounded-lg bg-isdb-green-50 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-isdb-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </p>
                        <p className="text-slate-700 break-words">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-6 py-6 text-sm text-slate-500">
                  Les coordonnées seront bientôt disponibles ici.
                </p>
              )}

              {socials.length > 0 && (
                <div className="px-6 py-5 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    Suivez-nous
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {socials.map(({ key, icon: Icon, label }) => {
                      const url = institut!.reseaux_sociaux[key]!;
                      return (
                        <a
                          key={key}
                          href={getSocialHref(key, url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          title={label}
                          className="w-9 h-9 rounded-full bg-isdb-green-50 text-isdb-green-700 flex items-center justify-center hover:bg-isdb-green-600 hover:text-white transition-colors"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl border border-isdb-green-200 bg-isdb-green-50 px-6 py-5 text-isdb-green-700 font-semibold hover:bg-isdb-green-600 hover:text-white hover:border-isdb-green-600 transition-colors shadow-sm"
              >
                <MapPin size={20} />
                Voir l'ISDB sur Google Maps
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Envoyez-nous un message</h2>
              <p className="text-slate-600 mb-6">
                Remplissez le formulaire ci-dessous, nous reviendrons vers vous rapidement.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
