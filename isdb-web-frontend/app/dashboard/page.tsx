
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { useAuth } from '@/lib/auth/useAuth';
import { useRedacteurs } from '@/lib/hooks/useRedacteur';
import { useContactMessages } from '@/lib/hooks/useContactMessages';
import { useFormations } from '@/lib/hooks/useFormation';
import { useFormationModulaires } from '@/lib/hooks/useFormationModulaire';
import { useAnneeActuelle } from '@/lib/hooks/useAnneeAcademique';
import { useOffresFormations } from '@/lib/hooks/useOffreFormation';
import { useRadio } from '@/lib/hooks/useRadio';
import { blogService } from '@/lib/api/services/blogService';
import { StatutFormation, TypeFormation } from '@/lib/types/Formation';
import StatsCard from '@/components/dashboard/statsCard';
import {
  FileText,
  CheckCircle2,
  PenLine,
  Users,
  Mail,
  PlusCircle,
  Radio as RadioIcon,
  Clapperboard,
  Settings,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowRight,
  ListChecks,
} from 'lucide-react';

const STATUT_LABELS: Record<'publie' | 'brouillon', { label: string; className: string }> = {
  publie: { label: 'Publié', className: 'bg-green-100 text-green-700' },
  brouillon: { label: 'Brouillon', className: 'bg-yellow-100 text-yellow-700' },
};

const AVATAR_TONES = [
  'bg-isdb-green-100 text-isdb-green-700',
  'bg-isdb-gold-100 text-isdb-gold-700',
  'bg-isdb-red-100 text-isdb-red-700',
  'bg-isdb-orange-200 text-isdb-orange-800',
];

function initials(nom: string): string {
  return nom
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const admin = isAdmin();
  const prenom = user?.nom?.split(' ')[0] || user?.nom || '';
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Un redacteur ne voit que ses propres articles, un admin voit tout.
  const redacteurId = admin ? undefined : user?.id;
  const scope = admin ? 'admin' : `me-${user?.id}`;

  const { data: allBlogs } = useSWR(
    user ? ['dashboard-blogs-total', scope] : null,
    () => blogService.getAllAdmin(redacteurId ? { redacteur_id: redacteurId } : {})
  );
  const { data: publishedBlogs } = useSWR(
    user ? ['dashboard-blogs-publie', scope] : null,
    () => blogService.getAllAdmin(redacteurId ? { redacteur_id: redacteurId, statut: 'publie' } : { statut: 'publie' })
  );
  const { data: draftBlogs } = useSWR(
    user ? ['dashboard-blogs-brouillon', scope] : null,
    () => blogService.getAllAdmin(redacteurId ? { redacteur_id: redacteurId, statut: 'brouillon' } : { statut: 'brouillon' })
  );

  const { redacteurs } = useRedacteurs(admin);
  const { messages, unreadCount } = useContactMessages(admin);
  const { formations: formationsToutesActives } = useFormations(admin ? { statut: StatutFormation.ACTIVE } : {});
  const { formationsModulaires: formationsModulairesAutonomes } = useFormationModulaires(
    { statut: StatutFormation.ACTIVE },
    admin
  );
  const { anneeActuelle } = useAnneeActuelle();
  const { offres: offresAnneeActuelle } = useOffresFormations(
    admin && anneeActuelle ? { annee_academique_id: anneeActuelle.id, dispensees_only: true } : {}
  );
  const { radio } = useRadio();

  // "Formations modulaires" regroupe les deux gisements réels : celles de la
  // table formations (type_formation = MODULAIRE, rattachées à une mention) et
  // les formations modulaires autonomes (table à part, sans domaine/mention).
  const formationsPrincipalesActives = formationsToutesActives.filter(
    (f) => f.type_formation === TypeFormation.PRINCIPALE
  ).length;
  const formationsModulairesCount =
    formationsToutesActives.filter((f) => f.type_formation === TypeFormation.MODULAIRE).length +
    formationsModulairesAutonomes.length;

  // Tendance des messages (7 derniers jours vs les 7 jours précédents), affichée
  // comme badge sur la carte "Messages non lus".
  const messagesTrend = useMemo(() => {
    const now = Date.now();
    const oneDay = 86400000;
    const last7 = messages.filter((m) => now - new Date(m.created_at).getTime() <= 7 * oneDay).length;
    const prev7 = messages.filter((m) => {
      const age = now - new Date(m.created_at).getTime();
      return age > 7 * oneDay && age <= 14 * oneDay;
    }).length;
    if (prev7 === 0) return null;
    return Math.round(((last7 - prev7) / prev7) * 100);
  }, [messages]);

  // 6 cartes (3x2) pour un admin, 3 pour un rédacteur — pensées pour remplir
  // une grille de 3 colonnes sans case vide.
  const stats = admin
    ? [
        {
          name: 'Articles Publiés',
          value: publishedBlogs ? String(publishedBlogs.meta.total) : '—',
          icon: CheckCircle2,
          color: 'green' as const,
        },
        {
          name: 'Brouillons',
          value: draftBlogs ? String(draftBlogs.meta.total) : '—',
          icon: PenLine,
          color: 'yellow' as const,
        },
        {
          name: 'Rédacteurs',
          value: String(redacteurs.length),
          icon: Users,
          color: 'purple' as const,
        },
        {
          name: 'Messages non lus',
          value: String(unreadCount),
          icon: Mail,
          color: 'red' as const,
          change: messagesTrend !== null ? `${messagesTrend >= 0 ? '+' : ''}${messagesTrend}%` : undefined,
          changeType:
            messagesTrend === null ? undefined : messagesTrend >= 0 ? ('positive' as const) : ('negative' as const),
        },
        {
          name: 'Formations actives',
          value: String(formationsPrincipalesActives),
          icon: GraduationCap,
          color: 'blue' as const,
        },
        {
          name: 'Formations modulaires',
          value: String(formationsModulairesCount),
          icon: BookOpen,
          color: 'orange' as const,
        },
      ]
    : [
        {
          name: 'Mes Articles',
          value: allBlogs ? String(allBlogs.meta.total) : '—',
          icon: FileText,
          color: 'indigo' as const,
        },
        {
          name: 'Articles Publiés',
          value: publishedBlogs ? String(publishedBlogs.meta.total) : '—',
          icon: CheckCircle2,
          color: 'green' as const,
        },
        {
          name: 'Brouillons',
          value: draftBlogs ? String(draftBlogs.meta.total) : '—',
          icon: PenLine,
          color: 'yellow' as const,
        },
      ];

  const recentBlogs = allBlogs?.data.slice(0, 5) ?? [];
  const recentMessages = messages.slice(0, 4);

  // Année académique en cours : progression dans le temps + jours restants.
  const anneeInfo = useMemo(() => {
    if (!anneeActuelle?.date_debut || !anneeActuelle?.date_fin) return null;
    const debut = new Date(anneeActuelle.date_debut).getTime();
    const fin = new Date(anneeActuelle.date_fin).getTime();
    const now = Date.now();
    const progress = Math.min(100, Math.max(0, Math.round(((now - debut) / (fin - debut)) * 100)));
    const joursRestants = Math.max(0, Math.ceil((fin - now) / 86400000));
    return { progress, joursRestants };
  }, [anneeActuelle]);

  const quickActions = [
    { label: 'Nouvel article', href: '/dashboard/blogs/new', icon: PlusCircle },
    ...(admin
      ? [
          { label: 'Messages', href: '/dashboard/messages', icon: Mail },
          { label: 'Rédacteurs', href: '/dashboard/redacteurs', icon: Users },
          { label: 'Radio', href: '/dashboard/radio', icon: RadioIcon },
          { label: 'Studios', href: '/dashboard/studios', icon: Clapperboard },
          { label: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
        ]
      : []),
  ];

  // "À faire" : quelques rappels concrets tirés des vraies données, pas une
  // liste figée — chaque entrée n'apparaît que si elle est pertinente.
  const todos: { icon: typeof PenLine; label: string; sub: string; href: string }[] = [];
  if (draftBlogs && draftBlogs.meta.total > 0) {
    todos.push({
      icon: PenLine,
      label: `${draftBlogs.meta.total} brouillon${draftBlogs.meta.total > 1 ? 's' : ''} à publier`,
      sub: admin ? 'Tous rédacteurs confondus' : 'Vos articles',
      href: '/dashboard/blogs',
    });
  }
  if (admin && unreadCount > 0) {
    todos.push({
      icon: Mail,
      label: `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`,
      sub: 'Formulaire de contact',
      href: '/dashboard/messages',
    });
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {prenom} 👋
        </h1>
        <p className="text-gray-600 mt-1 capitalize">{today}</p>
      </div>

      {/* Stats principales + année académique */}
      {admin && anneeActuelle ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <StatsCard key={stat.name} {...stat} />
            ))}
          </div>

          <div className="bg-gradient-to-br from-isdb-green-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={18} className="text-isdb-green-300" />
              <h3 className="font-bold">Année académique</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">{anneeActuelle.libelle} · en cours</p>

            {anneeInfo && (
              <>
                <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${anneeInfo.progress}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mb-5">
                  {anneeInfo.joursRestants} jour{anneeInfo.joursRestants > 1 ? 's' : ''} restant
                  {anneeInfo.joursRestants > 1 ? 's' : ''}
                </p>
              </>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xl font-bold">{offresAnneeActuelle.length}</p>
                <p className="text-xs text-white/60 mt-0.5">Offres dispensées</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-semibold">
                  {anneeActuelle.date_debut &&
                    new Date(anneeActuelle.date_debut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  {' → '}
                  {anneeActuelle.date_fin &&
                    new Date(anneeActuelle.date_fin).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                </p>
                <p className="text-xs text-white/60 mt-0.5">Période</p>
              </div>
            </div>

            <Link
              href={`/dashboard/annees-academiques/${anneeActuelle.id}/details`}
              className="flex items-center justify-center gap-2 w-full bg-white text-isdb-green-800 rounded-lg py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Voir les détails
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.name} {...stat} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Derniers articles */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {admin ? 'Derniers articles' : 'Mes derniers articles'}
              </h2>
              <Link href="/dashboard/blogs" className="text-sm font-medium text-isdb-green-600 hover:text-isdb-green-700">
                Voir tout
              </Link>
            </div>

            {recentBlogs.length === 0 ? (
              <p className="text-gray-500">Aucun article pour le moment.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentBlogs.map((blog) => {
                  const statutInfo = STATUT_LABELS[blog.statut];
                  return (
                    <Link
                      key={blog.id}
                      href={`/dashboard/blogs/${blog.id}/edit`}
                      className="flex items-center justify-between gap-4 py-3 -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{blog.titre}</p>
                        <p className="text-sm text-gray-500">
                          {admin && blog.redacteur ? `${blog.redacteur.nom} · ` : ''}
                          {blog.dateCreation}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statutInfo.className}`}
                      >
                        {statutInfo.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Derniers messages (admin) */}
          {admin && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Derniers messages</h2>
                <Link href="/dashboard/messages" className="text-sm font-medium text-isdb-green-600 hover:text-isdb-green-700">
                  Voir tout
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun message pour le moment.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentMessages.map((message, index) => (
                    <Link
                      key={message.id}
                      href="/dashboard/messages"
                      className="flex items-center gap-3 -mx-2 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
                      >
                        {initials(message.nom)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{message.nom}</p>
                          {!message.lu && <span className="w-2 h-2 rounded-full bg-isdb-green-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{message.sujet}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* À faire */}
          {todos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ListChecks size={18} className="text-isdb-green-600" />À faire
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <Link
                    key={todo.label}
                    href={todo.href}
                    className="flex items-start gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-isdb-gold-100 text-isdb-gold-700 flex items-center justify-center shrink-0">
                      <todo.icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{todo.label}</p>
                      <p className="text-xs text-gray-500">{todo.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-isdb-green-300 hover:bg-isdb-green-50 transition-colors text-center"
                >
                  <action.icon className="w-5 h-5 text-isdb-green-600" />
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Radio en direct (gestion réservée aux admins) */}
          {admin && radio && (
            <Link
              href="/dashboard/radio"
              className="block bg-slate-900 rounded-2xl p-5 text-white shadow-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${radio.enDirect ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {radio.enDirect ? 'En direct' : 'Hors ligne'}
                </span>
              </div>
              <p className="font-bold">{radio.nom}</p>
              <p className="text-xs text-white/50 mt-1">Gérer la radio de l'institut</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
