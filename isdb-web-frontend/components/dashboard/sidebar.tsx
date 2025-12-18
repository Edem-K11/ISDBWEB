'use client';

import { useAuth } from '@/lib/auth/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Tag, 
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    {
      name: 'Articles',
      href: '/dashboard/blogs',
      icon: FileText,
      current: pathname.startsWith('/dashboard/blogs'),
      children: [
        { name: 'Tous les articles', href: '/dashboard/blogs' },
        { name: 'Créer un article', href: '/dashboard/blogs/new' },
      ]
    },
    ...(isAdmin() ? [
      {
        name: 'Redacteurs',
        href: '/dashboard/redacteurs',
        icon: Users,
        current: pathname.startsWith('/dashboard/redacteurs'),
      },
      {
        name: 'Tags',
        href: '/dashboard/tags',
        icon: Tag,
        current: pathname.startsWith('/dashboard/tags'),
      },
      {
        name: 'Formations',
        icon: GraduationCap,
        current: pathname.startsWith('/dashboard/formations'),
        children: [
          { name: 'Toutes les formations', href: '/dashboard/formations' },
          { name: 'Domaines', href: '/dashboard/domaines' },
          { name: 'Mentions', href: '/dashboard/mentions' },
          { name: 'Années académiques', href: '/dashboard/annees-academiques' },
          { name: 'Offres de formation', href: '/dashboard/offres-formation' },
        ]
      }
    ] : []),
    {
      name: 'Mon Profil',
      href: '/dashboard/profil',
      icon: User,
      current: pathname === '/dashboard/profil',
    },
    {
      name: 'Paramètres',
      href: '/dashboard/parametres',
      icon: Settings,
      current: pathname === '/dashboard/parametres',
      children: [
        { name: 'Général', href: '/dashboard/parametres/general' },
        { name: 'Sécurité', href: '/dashboard/parametres/securite' },
        { name: 'Notifications', href: '/dashboard/parametres/notifications' },
      ]
    },
  ];

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderNavigationItem = (item: any, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);
    const isActive = item.current || (hasChildren && item.children.some((child: any) => child.href === pathname));

    return (
      <div key={item.name} >
        <div className="relative">
          <Link
            href={hasChildren ? '#' : item.href}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleExpanded(item.name);
              }
            }}
            className={cn(
              'group flex items-center px-2 lg:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-white/18 text-white shadow-lg'
                : 'text-indigo-100 hover:bg-white/8 hover:text-white',
              level > 0 && 'ml-4'
            )}
            title={item.name}
          >
            <div className={cn(
              'p-2 bg-white/20 rounded-lg flex-shrink-0',
              'lg:mr-3'
            )}>
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                )}
              />
            </div>
            
            {/* Texte caché sur mobile */}
            <span className="hidden lg:block truncate flex-1">{item.name}</span>

            {/* Flèche pour les sous-menus (seulement sur desktop) */}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'hidden lg:block h-4 w-4 text-white/60 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            )}

            {/* Tooltip pour la version mobile */}
            <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              {item.name}
            </div>
          </Link>

          {/* Sous-menus pour desktop */}
          {hasChildren && isExpanded && (
            <div className="hidden lg:block ml-4 mt-1 space-y-1">
              {item.children.map((child: any) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200',
                    pathname === child.href
                      ? 'bg-white/12 text-white'
                      : 'text-indigo-100 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <ChevronRight className="h-3 w-3 mr-2 text-white/40" />
                  <span className="truncate">{child.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sous-menus pour mobile (affichés dans un tooltip) */}
        {hasChildren && (
          <div className="lg:hidden">
            <div className="absolute left-full top-0 ml-1 w-48 bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
              <div className="py-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                  >
                    <span>{child.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Responsive - Toujours à côté du contenu */}
      <div className="flex flex-col flex-shrink-0 w-16 lg:w-64 h-screen bg-gradient-to-b from-isdb-green-800 to-slate-800 overflow-y-auto transition-all duration-300">
        
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-100/20 px-2 lg:px-4">
          <h1 className="hidden lg:block text-xl font-bold text-white">Blog Dashboard</h1>
          <div className="lg:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 lg:px-3">
          {navigation.map((item) => renderNavigationItem(item))}
        </nav>

        {/* User info et Logout */}
        <div className="border-t border-gray-100/20 p-2 lg:p-4">
          {/* User info */}
          <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 justify-center lg:justify-start">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nom}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 flex-shrink-0">
                {user?.nom.charAt(0)}
              </div>
            )}
            {/* Info utilisateur cachée sur mobile */}
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-sm font-semibold text-white/80 truncate">{user?.nom}</p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role === 'admin' ? 'Administrateur' : 'Auteur'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start px-2 lg:px-3 py-2 lg:py-3 bg-white/5 text-sm font-medium text-white/90 rounded-lg hover:bg-red-600/80 hover:text-white transition-all duration-200 group relative"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4 lg:h-5 lg:w-5 text-white/50 group-hover:text-white flex-shrink-0 lg:mr-3" />
            
            {/* Texte caché sur mobile */}
            <span className="hidden lg:block">Déconnexion</span>

            {/* Tooltip pour la version mobile */}
            <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Déconnexion
            </div>
          </button>
        </div>
      </div>
    </>
  );
}