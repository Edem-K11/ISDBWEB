
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'indigo' | 'green' | 'yellow' | 'purple' | 'red';
}

const colorVariants = {
  indigo: 'bg-indigo-100 text-indigo-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export default function StatsCard({
  name,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{name}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p
            className={cn(
              'text-sm mt-2 flex items-center gap-1',
              changeType === 'positive' && 'text-green-600',
              changeType === 'negative' && 'text-red-600',
              changeType === 'neutral' && 'text-gray-600'
            )}
          >
            <span>{change}</span>
            <span className="text-gray-500">vs mois dernier</span>
          </p>
        </div>
        <div className={cn('p-4 rounded-full', colorVariants[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
