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
      <ol className={clsx(lexendDeca.className, 'flex flex-wrap md:text-md')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={index}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? 'underline underline-offset-4' : 'hover:text-blue-900 text-lg',
            )}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-2 inline-block">
                <ChevronRight size={16}/>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}