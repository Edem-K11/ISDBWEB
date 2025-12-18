'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DynamicIcon } from 'lucide-react/dynamic';

// Fonction utilitaire pour afficher une colonne de footer
interface FooterColumn {
  title: string;
  items: {
    href: string;
    label: string;
  }[];
}

const FooterColumn = ({ title, items }: FooterColumn) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-600 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href} className="text-sm text-slate-500 hover:text-slate-700 transition">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Variante plus grande
const SocialMediasLarge = () => {
  const socialMediaItems = [
    { href: 'https://facebook.com', label: 'Facebook', icon: 'facebook' },
    { href: 'https://twitter.com', label: 'Twitter', icon: 'twitter' },
    { href: 'https://linkedin.com', label: 'LinkedIn', icon: 'linkedin' },
    { href: 'https://instagram.com', label: 'Instagram', icon: 'instagram' },
    { href: 'https://youtube.com', label: 'YouTube', icon: 'youtube' },
  ];

  return (
    <div className="flex space-x-6">
      {socialMediaItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal-800 hover:bg-lime-400 p-4 transition-all duration-300 group"
          aria-label={item.label}
        >
          <DynamicIcon 
            name={item.icon as any} 
            size={20} 
            className="text-white group-hover:text-teal-900 transition-colors duration-300 max-w-[24px] sm:max-w-[32px] md:max-w-[40px] h-auto"
          />
        </a>
      ))}
    </div>
  );
};

// Footer Component
export const Footer = () => {
  const [email, setEmail] = useState('');

  const footerData: FooterColumn[] = [
    {
      title: 'Formations',
      items: [
        { href: '#Philosophie', label: 'Philosophie' },
        { href: '#Science de l\'éducation', label: 'Science de l\'éducation' },
        { href: '#Communication', label: 'Communication' }
      ]
    },
    {
      title: 'Support',
      items: [
        { href: '#help', label: 'Help' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { href: '#privacy', label: 'Privacy Policy' },
        { href: '#terms', label: 'Terms of Services' },
        { href: '#cookies', label: 'Cookies' }
      ]
    }
  ];


  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    // Logique d'inscription à la newsletter
  };

  return (
    <footer className="bg-slate-200 py-16"> 
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-3xl p-8 md:p-12 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Inscrivez-vous à notre newsletter
              </h2>
              <p className="text-teal-100 text-sm">
                Pour ne rien manquer des dernières actualités.
              </p>
            </div>
            
            <div className="w-full md:w-auto gap-4">
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center gap-2">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-teal-900/50 text-white placeholder-teal-300 border border-teal-600 focus:outline-none focus:border-teal-400 min-w-[250px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-lime-400 text-teal-900 font-semibold rounded-lg hover:bg-lime-300 transition whitespace-nowrap"
                >
                  M'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-20 md:items-start'>
          {/* Logo Section */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/logo_isdb.png"
                alt="Mini logo de ISDB"
                width={32}
                height={32}
              />
              <span className="font-bold text-xl text-slate-800">Institut Supérieur Don Bosco</span>
            </div>
            <SocialMediasLarge />
          </div>

          {/* Dynamic Footer Columns */}
          <div className="flex flex-wrap md:grid md:grid-cols-3 gap-12 mb-12">
            {footerData.map((column, index) => (
              <FooterColumn key={index} title={column.title} items={column.items} />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-slate-500 border-t pt-6">
          <p>&copy; 2025 isdb - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;