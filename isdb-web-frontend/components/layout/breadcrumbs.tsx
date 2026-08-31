import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { lexendDeca } from '../ui/fonts';

// Breadcrumb Component
interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lexendDeca.className, 'flex flex-wrap text-sm md:text-md')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={index}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? 'underline underline-offset-4' : 'hover:text-isdb-green-200 text-sm md:text-md transition-colors duration-200',
            )}
          >
            <Link
              href={breadcrumb.href}
              title={breadcrumb.label}
              className="inline-block max-w-[140px] sm:max-w-[220px] md:max-w-xs truncate align-bottom"
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-2 inline-block">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}