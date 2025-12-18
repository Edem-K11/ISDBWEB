

// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Colonne 1 - Logo et description */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h2 className="text-xl font-bold">
                Université<span className="text-emerald-400">Name</span>
              </h2>
            </div>
            <p className="text-slate-300 text-sm mb-6">
              Une institution d'excellence dédiée à l'éducation, la recherche et l'innovation. 
              Formons les leaders de demain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/formations" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  Formations
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/vie-etudiante" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  Vie étudiante
                </Link>
              </li>
              <li>
                <Link href="/recherche" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
                <span className="text-slate-300">
                  123 Avenue de l'Université<br />
                  Casablanca, Maroc
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">+212 5 XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">contact@universitename.ma</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-slate-300 text-sm mb-4">
              Inscrivez-vous pour recevoir nos actualités.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar avec lien admin TRÈS discret */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} UniversitéName. Tous droits réservés.
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/mentions-legales" className="text-slate-400 hover:text-slate-300">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-slate-400 hover:text-slate-300">
              Confidentialité
            </Link>
            
            {/* Lien admin super discret - seulement visible en dev ou avec un paramètre spécifique */}
            {process.env.NODE_ENV === 'development' && (
              <Link 
                href="/admin" 
                className="text-slate-600 hover:text-slate-400 text-xs"
                title="Accès administration"
              >
                Espace admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;