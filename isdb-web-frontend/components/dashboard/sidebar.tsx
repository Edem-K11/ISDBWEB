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
  GraduationCap,
  Radio,
  Clapperboard,
  Layers,
  Bookmark,
  Calendar,
  ClipboardList,
  Mail,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useContactMessages } from '@/lib/hooks/useContactMessages';

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { unreadCount } = useContactMessages(isAdmin());
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Ferme le menu de compte au clic en dehors, comme les autres menus du dashboard.
  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  // Groupes de navigation : `title` sert d'en-tête de section (aucun en-tête si null),
  // les entrées de chaque groupe sont des liens directs (pas de sous-menu à déplier).
  const navigationSections: { title: string | null; items: any[] }[] = [
    {
      title: null,
      items: [
        {
          name: 'Tableau de bord',
          href: '/dashboard',
          icon: LayoutDashboard,
          current: pathname === '/dashboard',
        },
      ],
    },
    {
      title: 'Blog',
      items: [
        {
          name: 'Articles',
          href: '/dashboard/blogs',
          icon: FileText,
          current: pathname.startsWith('/dashboard/blogs'),
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
        ] : []),
      ],
    },
    ...(isAdmin() ? [
      {
        title: 'Formations',
        items: [
          {
            name: 'Toutes les formations',
            href: '/dashboard/formations',
            icon: GraduationCap,
            current: pathname === '/dashboard/formations',
          },
          {
            name: 'Domaines',
            href: '/dashboard/domaines',
            icon: Layers,
            current: pathname.startsWith('/dashboard/domaines'),
          },
          {
            name: 'Mentions',
            href: '/dashboard/mentions',
            icon: Bookmark,
            current: pathname.startsWith('/dashboard/mentions'),
          },
          {
            name: 'Années académiques',
            href: '/dashboard/annees-academiques',
            icon: Calendar,
            current: pathname.startsWith('/dashboard/annees-academiques'),
          },
          {
            name: 'Offres de formation',
            href: '/dashboard/offres-formations',
            icon: ClipboardList,
            current: pathname.startsWith('/dashboard/offres-formations'),
          },
          {
            name: 'Corbeille',
            href: '/dashboard/corbeille',
            icon: Trash2,
            current: pathname.startsWith('/dashboard/corbeille'),
          },
        ],
      },
    ] : []),
    {
      title: null,
      items: [
        // Un rédacteur ne doit voir que ses articles et son profil : Radio,
        // Studios, Messages et Paramètres sont réservés aux admins (ces pages
        // le vérifient aussi elles-mêmes, mais elles ne doivent même pas
        // apparaître dans la navigation d'un rédacteur).
        ...(isAdmin()
          ? [
              {
                name: 'Radio',
                href: '/dashboard/radio',
                icon: Radio,
                current: pathname.startsWith('/dashboard/radio'),
              },
              {
                name: 'Studios',
                href: '/dashboard/studios',
                icon: Clapperboard,
                current: pathname.startsWith('/dashboard/studios'),
              },
              {
                name: 'Messages',
                href: '/dashboard/messages',
                icon: Mail,
                current: pathname.startsWith('/dashboard/messages'),
                badge: unreadCount > 0 ? unreadCount : undefined,
              },
            ]
          : []),
        {
          name: 'Mon Profil',
          href: '/dashboard/profil',
          icon: User,
          current: pathname === '/dashboard/profil',
        },
        ...(isAdmin()
          ? [
              {
                name: 'Paramètres',
                href: '/dashboard/parametres',
                icon: Settings,
                current: pathname === '/dashboard/parametres',
              },
            ]
          : []),
      ],
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
              'relative p-2 bg-white/20 rounded-lg flex-shrink-0',
              'lg:mr-3'
            )}>
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                )}
              />
              {!!item.badge && (
                <span className="lg:hidden absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-isdb-red-500 text-[9px] font-bold text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>

            {/* Texte caché sur mobile */}
            <span className="hidden lg:block truncate flex-1">{item.name}</span>

            {!!item.badge && (
              <span className="hidden lg:flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-isdb-red-500 text-[11px] font-bold text-white flex-shrink-0">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}

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
          <h1 className="hidden lg:block text-xl font-bold text-white">ISDB Dashboard</h1>
          <div className="lg:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-4 px-2 lg:px-3">
          {navigationSections.map((section, index) => (
            <div key={section.title ?? `section-${index}`} className="space-y-1">
              {section.title && (
                <p className="hidden lg:block px-3 mb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => renderNavigationItem(item))}
            </div>
          ))}
        </nav>

        {/* Compte : ligne compacte qui ouvre un menu (avatar, nom · rôle, chevron) */}
        <div className="border-t border-gray-100/20 p-2 lg:p-3 relative" ref={accountMenuRef}>
          {accountMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 lg:left-2 lg:right-2 mb-2 w-56 max-w-[calc(100vw-2rem)] bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-semibold text-white/90 truncate">{user?.nom}</p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/profil"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User size={16} className="text-white/50" />
                  Mon profil
                </Link>
                {isAdmin() && (
                  <Link
                    href="/dashboard/parametres"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Settings size={16} className="text-white/50" />
                    Paramètres
                  </Link>
                )}
              </div>

              <div className="border-t border-white/10 py-1">
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            className="w-full flex items-center gap-2 lg:gap-3 px-1 lg:px-2 py-1.5 rounded-lg justify-center lg:justify-start hover:bg-white/5 transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nom}
                className="w-8 h-8 rounded-full ring-2 ring-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 flex-shrink-0">
                {user?.nom.charAt(0)}
              </div>
            )}

            {/* Nom · rôle, caché sur mobile */}
            <span className="hidden lg:flex items-center min-w-0 flex-1 text-sm font-medium text-white/80 truncate text-left">
              {user?.nom}
              <span className="text-white/40 font-normal">
                &nbsp;·&nbsp;{user?.role === 'admin' ? 'Admin' : 'Auteur'}
              </span>
            </span>

            <ChevronDown
              className={cn(
                'hidden lg:block h-4 w-4 text-white/40 transition-transform duration-200 flex-shrink-0',
                accountMenuOpen && 'rotate-180'
              )}
            />
          </button>
        </div>
      </div>
    </>
  );
}