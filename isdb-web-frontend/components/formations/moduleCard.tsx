import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { truncateText } from '@/lib/utils/truncateText';

interface ModuleCardProps {
  titre: string;
  description: string | null;
  dureeHeures: number | null;
  link: string;
}

const DESCRIPTION_MAX_LENGTH = 140;

export default function ModuleCard({ titre, description, dureeHeures, link }: ModuleCardProps) {
  return (
    <article className="flex h-full w-full max-w-[720px] flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="line-clamp-2 text-[22px] font-bold leading-7 text-slate-900">{titre}</h3>

      {/* Hauteur réservée fixe : la description est tronquée, toutes les cards s'alignent pareil */}
      <div className="mt-5 min-h-[72px]">
        {description && (
          <p className="text-base leading-6 text-gray-800">
            {truncateText(description, DESCRIPTION_MAX_LENGTH)}
          </p>
        )}
      </div>

      {/* Poussé en bas de la card, quelle que soit la hauteur du bloc au-dessus */}
      <div className="mt-auto pt-5">
        <div className="border-t border-gray-200" />

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Durée formation
            </p>
            {dureeHeures != null && (
              <span className="mt-2 inline-block rounded-full bg-isdb-green-50 px-3 py-1 text-sm font-semibold text-isdb-green-700">
                {dureeHeures} h
              </span>
            )}
          </div>

          <Link
            href={link}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-isdb-green-50 px-4 py-2.5 text-sm font-semibold text-isdb-green-700 transition-colors hover:bg-isdb-green-100 hover:text-isdb-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-isdb-green-500 focus-visible:ring-offset-2"
          >
            Voir le détail
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
