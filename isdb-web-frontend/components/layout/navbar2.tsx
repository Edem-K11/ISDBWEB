

'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function NavFloating(){
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Se déclenche après 50px de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Formations',
      submenu: [
        { 
          name: 'Philosophie', 
          href: '/formations/philosophie',
          description: 'Solutions web modernes et performantes'
        },
        { 
          name: 'Sciences de l\'éducation', 
          href: '/formations/science',
          description: 'Interfaces intuitives et esthétiques'
        },
        { 
          name: 'Communication', 
          href: '/formations/communication',
          description: 'Expertise et conseils stratégiques'
        },
      ],
    },
    {
      name: 'Admission',
    },
    {
      name: 'À propos',
      href: '/about',
    },
    {
      name: 'Contact',
      href: '/contact',
      highlight: true
    },
  ];

  const handleSubmenu = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <>
      {/* Container pour la hauteur */}
      <div className={`h-${isScrolled ? '16' : '28'} bg-red-100 transition-all duration-300`}>
        
        {/* Header avec position absolute qui devient fixed au scroll */}
        <header className={`
          ${isScrolled 
            ? 'fixed top-0 left-0 right-0 z-50' 
            : 'absolute top-6 left-1/2 transform -translate-x-1/2 z-50'
          }
          transition-all duration-300 ease-out
        `}>
          <nav className={`
            ${isScrolled 
              ? 'mx-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
              : 'w-[100%] max-w-8xl bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl'
            }
            transition-all duration-300 ease-out
          `}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Image
                  src="/logo_isdb.png"
                  alt="ISDB Logo"
                  width={50}
                  height={50}
                  />
                </div>

                {/* Menu Desktop */}
                <div className="hidden lg:flex items-center space-x-1">
                  {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`
                            flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200
                            ${item.highlight 
                              ? 'bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white shadow-lg hover:from-isdb-green-700 hover:to-isdb-green-800' 
                              : 'text-slate-700 hover:text-isdb-green-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          {item.icon}
                          {item.name}
                        </a>
                      ) : (
                        <button
                          onClick={() => handleSubmenu(index)}
                          className="flex items-center px-4 py-2 rounded-xl font-medium text-slate-700 hover:text-isdb-green-600 hover:bg-slate-50 transition-all duration-200"
                        >
                          {item.name}
                          <svg
                            className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                              openSubmenu === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Sous-menu Desktop */}
                      {item.submenu && (
                        <div className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="p-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className="flex flex-col p-3 rounded-lg hover:bg-isdb-green-50 transition-all duration-200 group/item"
                              >
                                <span className="font-medium text-slate-800 group-hover/item:text-isdb-green-600">
                                  {subItem.name}
                                </span>
                                {'description' in subItem && subItem.description && (
                                  <span className="text-sm text-slate-500 mt-1">
                                    {subItem.description}
                                  </span>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bouton Mobile */}
                <button
                  className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                    <span className={`block h-0.5 bg-slate-700 transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-1' : 'w-6'}`}></span>
                    <span className={`block h-0.5 bg-slate-700 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-5'}`}></span>
                    <span className={`block h-0.5 bg-slate-700 transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-1' : 'w-4'}`}></span>
                  </div>
                </button>
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-28 bg-white border-b border-slate-200 shadow-lg z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index} className="py-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300
                        ${item.highlight 
                          ? 'bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white' 
                          : 'text-slate-700 hover:bg-slate-50/80'
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleSubmenu(index)}
                        className="flex justify-between items-center w-full px-4 py-3 text-slate-700 hover:bg-slate-50/80 rounded-xl font-medium transition-all duration-300"
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            openSubmenu === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Sous-menu Mobile */}
                      {openSubmenu === index && (
                        <div className="ml-4 mt-1 bg-slate-50/50 rounded-xl overflow-hidden">
                          {item.submenu?.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.href}
                              className="flex flex-col px-4 py-3 text-slate-600 hover:bg-white/80 transition-all duration-300 border-l-2 border-transparent hover:border-isdb-green-500"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="font-medium">{subItem.name}</span>
                              {'description' in subItem && subItem.description && (
                                <span className="text-sm text-slate-500 mt-1">
                                  {subItem.description}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Bouton Postuler en mobile */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <a
                  href="/admissions"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-isdb-green-600 to-isdb-green-700 text-white rounded-lg text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Postuler maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};