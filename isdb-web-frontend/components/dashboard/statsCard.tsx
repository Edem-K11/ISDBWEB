
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  name: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'indigo' | 'green' | 'yellow' | 'purple' | 'red' | 'blue' | 'orange';
}

// Fond clair de la carte + bordure dans une teinte plus foncée de la même
// couleur pour la délimiter (l'icône n'a plus de badge de fond, juste sa
// couleur propre).
const colorVariants = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-300', icon: 'text-indigo-600' },
  green: { bg: 'bg-green-50', border: 'border-green-300', icon: 'text-green-600' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', icon: 'text-yellow-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-300', icon: 'text-purple-600' },
  red: { bg: 'bg-red-50', border: 'border-red-300', icon: 'text-red-600' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-300', icon: 'text-blue-600' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-300', icon: 'text-orange-600' },
};

// Carte compacte et verticale (icône, valeur, libellé empilés), fond teinté
// et bordure de la même couleur, sans ombre.
export default function StatsCard({
  name,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: Readonly<StatsCardProps>) {
  const variant = colorVariants[color];

  return (
    <div className={cn('rounded-2xl border p-5', variant.bg, variant.border)}>
      <Icon className={cn('w-6 h-6 mb-4', variant.icon)} />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-gray-600">{name}</p>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold px-1.5 py-0.5 rounded-full',
              changeType === 'positive' && 'bg-green-100 text-green-700',
              changeType === 'negative' && 'bg-red-100 text-red-700',
              changeType === 'neutral' && 'bg-gray-100 text-gray-600'
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
