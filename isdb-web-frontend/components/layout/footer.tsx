import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getInstitutSettings } from '@/lib/api/institut';
import { SOCIAL_LINKS, getSocialHref } from '@/lib/utils/socialLinks';
import { boldonse } from '@/components/ui/fonts';

interface FooterColumn {
  title: string;
  items: {
    href: string;
    label: string;
  }[];
}

const footerData: FooterColumn[] = [
  {
    title: 'Formations',
    items: [
      { href: '/formations/philosophie', label: 'Philosophie' },
      { href: '/formations/sciences-de-leducation', label: "Sciences de l'éducation" },
      { href: '/formations/sciences-et-techniques-de-la-communication', label: 'Communication' },
      { href: '/formations-modulaires', label: 'Formations modulaires' },
    ],
  },
  {
    title: 'Découvrir',
    items: [
      { href: '/studios', label: 'Studios' },
      { href: '/blogs', label: 'Blog' },
      { href: '/radio', label: 'Radio ISDB' },
      { href: '/admission', label: 'Admission' },
    ],
  },
  {
    title: 'Institut',
    items: [
      { href: '/', label: 'Accueil' },
      { href: '/about', label: 'À propos' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

const FooterColumn = ({ title, items }: FooterColumn) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-600 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-sm text-slate-500 hover:text-isdb-green-600 transition-colors duration-200">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default async function Footer() {
  const institut = await getInstitutSettings();

  const nom = institut?.nom || 'Institut Supérieur Don Bosco';
  const description =
    institut?.description ||
    "Institution d'excellence dédiée à l'éducation, la recherche et l'innovation.";
  const logo = institut?.logo || '/logo_isdb.png';
  const socials = institut ? SOCIAL_LINKS.filter((s) => institut.reseaux_sociaux[s.key]) : [];

  // Un ou deux numéros / emails selon ce qui est renseigné dans les paramètres.
  const telephones = [institut?.telephone, institut?.telephone_2].filter(
    (value): value is string => Boolean(value)
  );
  const emails = [institut?.email, institut?.email_2].filter(
    (value): value is string => Boolean(value)
  );
  const hasContactColumn = Boolean(institut?.adresse) || telephones.length > 0 || emails.length > 0;

  return (
    <footer className="bg-slate-200 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:items-start">
          {/* Logo, description & réseaux sociaux */}
          <div className="max-w-sm text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Image
                src={logo}
                alt={nom}
                width={36}
                height={36}
                className="rounded object-contain"
              />
              <span className={`${boldonse.className} text-base sm:text-xl text-slate-800`}>{nom}</span>
            </div>
            <p className="text-[15px] sm:text-sm text-slate-500 mb-6">{description}</p>

            {socials.length > 0 && (
              <div className="flex justify-center md:justify-start gap-4">
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
                      className="rounded-full bg-isdb-green-700 hover:bg-isdb-green-600 p-3 transition-colors duration-300"
                    >
                      <Icon className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Colonnes de navigation. Grille à 2 colonnes dès le mobile (plutôt
              qu'un flex-wrap qui centrait des blocs de largeur inégale), et
              seulement 3-4 colonnes à partir de md : passer à 4 colonnes dès
              640px (comme avant) ne laissait qu'une grosse centaine de pixels
              pour "Contact" — trop peu pour une adresse ou un email complet,
              d'où le texte à l'étroit et qui débordait. */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 w-full md:w-auto md:gap-12 ${
              hasContactColumn ? 'md:grid-cols-4' : 'md:grid-cols-3'
            }`}
          >
            {footerData.map((column) => (
              <FooterColumn key={column.title} title={column.title} items={column.items} />
            ))}

            {hasContactColumn && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Contact</h3>
                <div className="space-y-3 text-sm text-slate-500">
                  {institut?.adresse && (
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5 text-isdb-green-600" />
                      {institut.maps_url ? (
                        <a
                          href={institut.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-isdb-green-600 transition-colors duration-200"
                        >
                          {institut.adresse}
                        </a>
                      ) : (
                        <span>{institut.adresse}</span>
                      )}
                    </div>
                  )}

                  {telephones.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Phone size={16} className="flex-shrink-0 mt-0.5 text-isdb-green-600" />
                      <div className="space-y-1">
                        {telephones.map((telephone) => (
                          <a
                            key={telephone}
                            href={`tel:${telephone.replace(/\s+/g, '')}`}
                            className="block hover:text-isdb-green-600 transition-colors duration-200"
                          >
                            {telephone}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {emails.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Mail size={16} className="flex-shrink-0 mt-0.5 text-isdb-green-600" />
                      <div className="space-y-1">
                        {emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="block hover:text-isdb-green-600 transition-colors duration-200 break-all"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500 border-t mt-12 pt-6">
          <p>
            &copy; {new Date().getFullYear()} {nom} — Tous droits réservés
          </p>
          <div className="flex gap-6">
            <Link href="/politique-de-confidentialite" className="hover:text-isdb-green-600 transition-colors duration-200">
              Politique de confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-isdb-green-600 transition-colors duration-200">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
