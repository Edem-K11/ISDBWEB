import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
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
              <span className={`${boldonse.className} text-xl text-slate-800`}>{nom}</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">{description}</p>

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
                      <Icon size={18} className="text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Colonnes de navigation */}
          <div
            className={`flex flex-wrap justify-center gap-10 sm:grid sm:gap-12 ${
              institut?.adresse ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
            }`}
          >
            {footerData.map((column) => (
              <FooterColumn key={column.title} title={column.title} items={column.items} />
            ))}

            {institut?.adresse && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Adresse</h3>
                <div className="flex items-start gap-2 text-sm text-slate-500">
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
