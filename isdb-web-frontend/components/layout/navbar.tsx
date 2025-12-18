

// components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ChevronDown, Search, Phone, MapPin } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Accueil', href: '/' },
    { 
      label: 'Formations', 
      href: '/formations',
      submenu: [
        { label: 'Philosophie', href: '/formations/philosophie' },
        { label: 'Sciences éducation', href: '/formations/science' },
        { label: 'Communication', href: '/formations/communication' },
        { label: 'Marketing', href: '/formations/marketing' },
      ]
    },
    { label: 'Admission', href: '/admission' },
    { label: 'Actualités', href: '/actualites' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white'
      }`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo à gauche */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center">
                <Image
                  src="/logo_isdb.png"
                  alt="ISDB Logo"
                  width={50}
                  height={50}
                />
                
              </div>
            </Link>

            {/* Navigation items au centre - Desktop */}
            <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>
                  
                  {/* Sous-menu dropdown */}
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-6 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Boutons à droite */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/admissions"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Postuler maintenant
              </Link>
              
              {/* Lien admin très discret - optionnel */}
              {process.env.NODE_ENV === 'development' && (
                <Link
                  href="/admin"
                  className="text-xs text-slate-400 hover:text-slate-600"
                  title="Accès administration"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Menu mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu mobile */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-slate-100 mt-2 rounded-lg shadow-lg">
              <div className="py-4">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-slate-100 last:border-b-0">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 font-medium ${
                        pathname === item.href
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-700 hover:text-emerald-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Sous-menu mobile */}
                    {item.submenu && (
                      <div className="bg-slate-50">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-10 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="px-6 py-4 space-y-3">
                  <Link
                    href="/admissions"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg text-center font-medium"
                  >
                    Postuler maintenant
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;