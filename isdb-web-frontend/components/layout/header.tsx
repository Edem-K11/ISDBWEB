

'use client';

import React, { useEffect, useState } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Menu, X, ChevronRight, Calendar, Users, BookOpen, Award, Mail, Phone, MapPin } from 'lucide-react';

// Header Component

const menuItems = [
    {
      label: 'Formations',
      submenu: [
        { label: 'Philosophie', href: '/formations/philosophie', icon: 'code', description: 'Build modern web apps' },
        { label: 'Sciences de l\'éducation', href: '/formations/science', icon: 'smartphone', description: 'iOS & Android solutions' },
        { label: 'Communication', href: '/formations/communication', icon: 'cloud', description: 'Scalable infrastructure' },
      ]
    },
    {
      label: 'How it works',
      submenu: [
        { label: 'Getting Started', href: '/how/start', icon: 'play', description: 'Quick onboarding' },
        { label: 'Process', href: '/how/process', icon: 'list', description: 'Our methodology' },
        { label: 'Integration', href: '/how/integration', icon: 'puzzle', description: 'Seamless setup' },
      ]
    },
    {
      label: 'Testimonials',
      href: '/testimonials'
    },
    {
      label: 'Pricing',
      submenu: [
        { label: 'Plans', href: '/pricing/plans', icon: 'credit-card', description: 'Flexible options' },
        { label: 'Enterprise', href: '/pricing/enterprise', icon: 'building', description: 'Custom solutions' },
        { label: 'Compare', href: '/pricing/compare', icon: 'bar-chart', description: 'Find your fit' },
      ]
    },
    {
      label: 'FAQ',
      href: '/faq'
    },
  ];

export default function Header(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">UNIVERSITÉ</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-blue-400 transition">Accueil</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Formations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Recherche</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">International</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <ul className="space-y-2">
              <li><a href="#" className="block py-2 hover:text-blue-400 transition">Accueil</a></li>
              <li><a href="#" className="block py-2 hover:text-blue-400 transition">Formations</a></li>
              <li><a href="#" className="block py-2 hover:text-blue-400 transition">Recherche</a></li>
              <li><a href="#" className="block py-2 hover:text-blue-400 transition">International</a></li>
              <li><a href="#" className="block py-2 hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};


const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <DynamicIcon name="zap" size={20} className="text-slate-800" />
              </div>
            </a>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.submenu ? (
                  <>
                    <button className="px-4 py-2 text-gray-300 hover:text-white transition rounded-lg hover:bg-slate-700/50 flex items-center space-x-1">
                      <span>{item.label}</span>
                      <DynamicIcon 
                        name="chevron-down" 
                        size={16} 
                        className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-fadeIn">
                        <div className="py-2">
                          {item.submenu.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 transition group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition">
                                <DynamicIcon name={subItem as any} size={16} className="text-gray-400 group-hover:text-white" />
                              </div>
                              <span className="text-sm">{subItem.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="px-4 py-2 text-gray-300 hover:text-white transition rounded-lg hover:bg-slate-700/50"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              CTA
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2">
            <DynamicIcon name="menu" size={24} />
          </button>
        </div>
      </div>

      {/* Style pour l'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

// Version avec menu mobile
const NavbarComplete = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  return (
    <>
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <DynamicIcon name="zap" size={20} className="text-slate-800" />
                </div>
              </a>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.submenu ? (
                    <>
                      <button className="px-4 py-2 text-gray-300 hover:text-white transition rounded-lg hover:bg-slate-700/50 flex items-center space-x-1">
                        <span>{item.label}</span>
                        <DynamicIcon 
                          name="chevron-down" 
                          size={16} 
                          className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-fadeIn">
                          <div className="py-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 transition group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition">
                                  <DynamicIcon name={subItem.icon as any} size={16} className="text-gray-400 group-hover:text-white" />
                                </div>
                                <span className="text-sm">{subItem.label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="px-4 py-2 text-gray-300 hover:text-white transition rounded-lg hover:bg-slate-700/50"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                CTA
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <DynamicIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-700 animate-fadeIn">
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <span>{item.label}</span>
                        <DynamicIcon 
                          name="chevron-down" 
                          size={16} 
                          className={`transition-transform ${mobileDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {mobileDropdown === item.label && (
                        <div className="pl-4 mt-2 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            >
                              <DynamicIcon name={subItem.icon as any} size={16} />
                              <span className="text-sm">{subItem.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              <button className="w-full bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition mt-4">
                CTA
              </button>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};


function NavbarFloating() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Flottante */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? 'top-2' : 'top-4'
      }`}>
        <div className={`backdrop-blur bg-white/20  border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-slate-900/10 transition-all duration-300 ${
          scrolled ? 'shadow-xl' : 'shadow-2xl'
        }`}>
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2 group">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <DynamicIcon name="zap" size={20} className="text-white" />
                  </div>
                  <span className="font-bold text-xl text-slate-800 dark:text-white hidden sm:block">Brand</span>
                </a>
              </div>

              {/* Menu Desktop */}
              <div className="hidden md:flex items-center space-x-1">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.submenu ? (
                      <>
                        <button className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 flex items-center space-x-1 font-medium">
                          <span>{item.label}</span>
                          <DynamicIcon 
                            name="chevron-down" 
                            size={16} 
                            className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        {/* Dropdown Menu Premium */}
                        {activeDropdown === item.label && (
                          <div className="absolute top-full left-0 mt-1 w-80 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden z-50 animate-fadeIn">
                            <div className="p-3">
                              {item.submenu.map((subItem, subIndex) => (
                                <a
                                  key={subIndex}
                                  href={subItem.href}
                                  className="flex items-start space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:dark:to-purple-900/30 group-hover:from-blue-500 group-hover:to-purple-500 flex items-center justify-center transition flex-shrink-0">
                                    <DynamicIcon name={subItem.icon as any} size={18} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                      {subItem.label}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      {subItem.description}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <a
                        href={item.href}
                        className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 font-medium"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-slate-700 dark:text-slate-300 p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <DynamicIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50 animate-fadeIn">
              <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition font-medium"
                        >
                          <span>{item.label}</span>
                          <DynamicIcon 
                            name="chevron-down" 
                            size={16} 
                            className={`transition-transform ${mobileDropdown === item.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {mobileDropdown === item.label && (
                          <div className="pl-2 mt-2 space-y-1">
                            {item.submenu.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className="flex items-center space-x-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                  <DynamicIcon name={subItem.icon as any} size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{subItem.label}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-500">{subItem.description}</div>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <a
                        href={item.href}
                        className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition font-medium"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

const NavFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
      name: 'Projets',
      submenu: [
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Études de cas', href: '/case-studies' },
        { name: 'Témoignages', href: '/testimonials' },
      ],
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

  const handleSubmenu = (index : number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-500 ${
      isScrolled ? 'top-4' : 'top-6'
    }`}>
      <nav className={`
        relative rounded-2xl transition-all duration-500 backdrop-blur-md
        ${isScrolled 
          ? 'bg-white/80 shadow-2xl shadow-black/10 border border-white/20' 
          : 'bg-white/40 shadow-lg shadow-black/5 border border-white/30'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo avec effet glass */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className={`font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}>
                  Vision
                </span>
              </div>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`
                        flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300
                        ${item.highlight 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' 
                          : `hover:bg-white/50 ${
                              isScrolled 
                                ? 'text-gray-700 hover:text-gray-900' 
                                : 'text-gray-800 hover:text-gray-900'
                            }`
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSubmenu(index)}
                      className={`
                        flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300
                        hover:bg-white/50 ${isScrolled ? 'text-gray-700' : 'text-gray-800'}
                      `}
                    >
                      {item.name}
                      <svg
                        className={`ml-2 w-4 h-4 transition-transform duration-300 ${
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

                  {/* Sous-menu Desktop amélioré */}
                  {item.submenu && (
                    <div className="absolute top-12 left-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                      <div className="p-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href={subItem.href}
                            className="flex flex-col p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-300 group/item"
                          >
                            <span className="font-medium text-gray-800 group-hover/item:text-blue-600 transition-colors duration-300">
                              {subItem.name}
                            </span>
                            {'description' in subItem && subItem.description && (
                              <span className="text-sm text-gray-500 mt-1">
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
              className="lg:hidden p-2 rounded-xl hover:bg-white/30 transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-1' : 'w-6'}`}></span>
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-5'}`}></span>
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-1' : 'w-4'}`}></span>
              </div>
            </button>
          </div>

          {/* Menu Mobile */}
          {isOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <div key={index} className="py-1">
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`
                          flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300
                          ${item.highlight 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-50/80'
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
                          className="flex justify-between items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50/80 rounded-xl font-medium transition-all duration-300"
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
                          <div className="ml-4 mt-1 bg-gray-50/50 rounded-xl overflow-hidden">
                            {item.submenu?.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className="flex flex-col px-4 py-3 text-gray-600 hover:bg-white/80 transition-all duration-300 border-l-2 border-transparent hover:border-blue-500"
                                onClick={() => setIsOpen(false)}
                              >
                                <span className="font-medium">{subItem.name}</span>
                                {subItem.name && (
                                  <span className="text-sm text-gray-500 mt-1">
                                    {subItem.name}
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
                
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};


export { Navbar, NavbarComplete, NavbarFloating, NavFloating};


