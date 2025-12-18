
'use client';

import { useAuth } from '@/lib/auth/useAuth';
import StatsCard from '@/components/dashboard/statsCard';
import { FileText, Users, Tag, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  // Données de stats (à remplacer par des vraies données d'API)
  const stats = [
    {
      name: 'Total Articles',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'indigo' as const,
    },
    {
      name: 'Articles Publiés',
      value: '18',
      change: '+8%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'green' as const,
    },
    {
      name: 'Brouillons',
      value: '6',
      change: '-4%',
      changeType: 'negative' as const,
      icon: FileText,
      color: 'yellow' as const,
    },
    ...(isAdmin() ? [
      {
        name: 'Total rédacteurs',
        value: '8',
        change: '+2',
        changeType: 'positive' as const,
        icon: Users,
        color: 'purple' as const,
      },
    ] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {user?.nom} ! 👋
        </h1>
        <p className="text-indigo-100">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Activité Récente
        </h2>
        <div className="space-y-4">
          <p className="text-gray-500">Aucune activité récente pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
