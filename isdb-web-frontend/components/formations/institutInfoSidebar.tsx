import Image from 'next/image';
import { MapPin, Phone, Mail, Printer, Globe, Building2 } from 'lucide-react';
import { InstitutSettings } from '@/lib/types/institut';
import { SOCIAL_LINKS, getSocialHref } from '@/lib/utils/socialLinks';

export default function InstitutInfoSidebar({
  institut,
}: {
  institut: InstitutSettings | null;
}) {
  if (!institut) return null;

  const contacts = [
    { icon: MapPin, type: 'text' as const, values: institut.adresse ? [institut.adresse] : [] },
    {
      icon: Phone,
      type: 'tel' as const,
      values: [institut.telephone, institut.telephone_2].filter(
        (value): value is string => Boolean(value)
      ),
    },
    {
      icon: Mail,
      type: 'mailto' as const,
      values: [institut.email, institut.email_2].filter(
        (value): value is string => Boolean(value)
      ),
    },
    { icon: Printer, type: 'text' as const, values: institut.fax ? [institut.fax] : [] },
    { icon: Globe, type: 'text' as const, values: institut.site_web ? [institut.site_web] : [] },
  ].filter((c) => c.values.length > 0);

  const socials = SOCIAL_LINKS.filter((s) => institut.reseaux_sociaux[s.key]);

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-isdb-green-600 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-isdb-green-100 mb-3">
            Fournisseur de la formation
          </p>
          <div className="flex items-center gap-3">
            {institut.logo ? (
              <div className="relative w-12 h-12 rounded-lg bg-white flex-shrink-0 overflow-hidden">
                <Image
                  src={institut.logo}
                  alt={institut.nom}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="text-white" size={22} />
              </div>
            )}
            <h3 className="text-white font-bold leading-tight">{institut.nom}</h3>
          </div>
        </div>

        {contacts.length > 0 && (
          <div className="px-6 py-5 space-y-4 border-b border-slate-100">
            {contacts.map(({ icon: Icon, type, values }, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <Icon size={18} className="text-isdb-green-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 space-y-0.5">
                  {values.map((value) =>
                    type === 'tel' ? (
                      <a
                        key={value}
                        href={`tel:${value.replace(/\s+/g, '')}`}
                        className="block text-slate-700 hover:text-isdb-green-600 transition-colors break-words"
                      >
                        {value}
                      </a>
                    ) : type === 'mailto' ? (
                      <a
                        key={value}
                        href={`mailto:${value}`}
                        className="block text-slate-700 hover:text-isdb-green-600 transition-colors break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <span key={value} className="block text-slate-700 break-words">
                        {value}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {socials.length > 0 && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Suivez-nous
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ key, icon: Icon, label }) => {
                const url = institut.reseaux_sociaux[key]!;
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
    </aside>
  );
}
