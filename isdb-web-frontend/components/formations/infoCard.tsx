

// components/formations/InfoCard.tsx
import { Users, BookOpen, GraduationCap, Clock, User, Calendar, MapPin } from 'lucide-react';

interface InfoCardProps {
  formation: any;
  offre: any;
  mention: any;
  colors: any;
}

export default function InfoCard({ formation, offre, mention, colors }: InfoCardProps) {
  const diplomeMap: Record<string, string> = {
    'LICENCE_PROFESSIONNELLE': 'Licence Professionnelle',
    'LICENCE_FONDAMENTALE': 'Licence Fondamentale',
    'MASTER': 'Master',
    'CERTIFICAT_MODULE': 'Certificat',
  };
  const diplomeLabel = diplomeMap[formation.diplome] || formation.diplome;

  const infoItems = [
    {
      icon: Users,
      label: 'Domaine',
      value: mention.domaine.nom,
      show: true,
    },
    {
      icon: BookOpen,
      label: 'Mention',
      value: mention.titre,
      show: true,
    },
    {
      icon: GraduationCap,
      label: 'Diplôme',
      value: diplomeLabel,
      show: true,
    },
    {
      icon: Clock,
      label: 'Durée',
      value: formation.duree_formation || 'Non précisée',
      show: formation.duree_formation,
    },
    {
      icon: User,
      label: formation.type === 'PRINCIPALE' ? 'Chef de parcours' : 'Animateur',
      value: formation.type === 'PRINCIPALE' ? offre.chef_parcours : offre.animateur,
      show: offre.chef_parcours || offre.animateur,
    },
    {
      icon: Calendar,
      label: 'Année académique',
      value: offre.annee_academique.libelle,
      show: true,
    },
    {
      icon: MapPin,
      label: 'Niveau de sortie',
      value: formation.profile_sortie || 'Non précisé',
      show: formation.profile_sortie,
    },
  ].filter(item => item.show);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-80 flex-shrink-0 h-fit sticky top-4">
      <h3 className={`text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 ${colors.border}`}>
        Informations générales
      </h3>
      
      <div className="space-y-6">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`p-2 ${colors.accent} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 break-words">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bouton d'action */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a
          href="/contact"
          className={`block w-full text-center px-6 py-3 ${colors.accent} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-md`}
        >
          Demander plus d'infos
        </a>
      </div>
    </div>
  );
}