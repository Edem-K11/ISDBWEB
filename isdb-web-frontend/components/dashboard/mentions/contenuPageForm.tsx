'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mentionService } from '@/lib/api/services/mentionService';
import { MentionPageContentForm } from '@/lib/types/Mention';

const THEMES: { value: MentionPageContentForm['theme']; label: string }[] = [
  { value: 'green', label: 'Vert' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Rouge' },
  { value: 'gold', label: 'Or' },
];

const VIDE: MentionPageContentForm = {
  hero_title: '',
  hero_subtitle: '',
  hero_description: '',
  section_title: '',
  section_description: '',
  cta_title: '',
  cta_description: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
  theme: 'green',
};

interface Props {
  mentionId: number;
}

export function ContenuPageForm({ mentionId }: Props) {
  const [contenu, setContenu] = useState<MentionPageContentForm>(VIDE);
  const [motsCles, setMotsCles] = useState('');
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    mentionService
      .getPageContent(mentionId)
      .then((donnees) => {
        setContenu({ ...VIDE, ...donnees, theme: donnees.theme ?? 'green' });
        setMotsCles((donnees.seo_keywords ?? []).join(', '));
      })
      .catch(() => toast.error('Impossible de charger la page publique'))
      .finally(() => setChargement(false));
  }, [mentionId]);

  const modifier = (champ: keyof MentionPageContentForm, valeur: string) => {
    setContenu((prev) => ({ ...prev, [champ]: valeur }));
  };

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    try {
      const keywords = motsCles
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      await mentionService.updatePageContent(mentionId, { ...contenu, seo_keywords: keywords });
      toast.success('Page publique enregistrée');
    } catch (error: any) {
      const premierMessage = error?.response?.data?.errors
        ? (Object.values(error.response.data.errors)[0] as string[])[0]
        : null;
      toast.error(premierMessage || error?.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setEnCours(false);
    }
  };

  if (chargement) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-8">
        <Loader2 className="w-4 h-4 animate-spin" /> Chargement de la page publique…
      </div>
    );
  }

  const champ = (
    label: string,
    cle: keyof MentionPageContentForm,
    options: { multiligne?: boolean; placeholder?: string } = {}
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options.multiligne ? (
        <textarea
          rows={3}
          value={(contenu[cle] as string) ?? ''}
          onChange={(e) => modifier(cle, e.target.value)}
          placeholder={options.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          type="text"
          value={(contenu[cle] as string) ?? ''}
          onChange={(e) => modifier(cle, e.target.value)}
          placeholder={options.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );

  return (
    <form onSubmit={enregistrer} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Globe className="text-indigo-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Page publique de la filière</h2>
      </div>
      <p className="text-sm text-gray-500">
        Ces textes apparaissent sur la page publique de la filière. Un champ laissé vide reprend
        le texte par défaut du site.
      </p>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Bandeau d'en-tête</h3>
        {champ('Titre', 'hero_title')}
        {champ('Sous-titre', 'hero_subtitle', { placeholder: 'ex. Licence fondamentale & Master recherche' })}
        {champ('Description', 'hero_description', { multiligne: true })}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Section des offres</h3>
        {champ('Titre de la section', 'section_title', { placeholder: 'ex. Nos formations en Droit' })}
        {champ('Texte de la section', 'section_description', { multiligne: true })}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Appel à l'action</h3>
        {champ('Titre', 'cta_title')}
        {champ('Description', 'cta_description', { multiligne: true })}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Couleur de la filière</h3>
        <div className="flex flex-wrap gap-3">
          {THEMES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={t.value}
                checked={contenu.theme === t.value}
                onChange={() => setContenu((prev) => ({ ...prev, theme: t.value }))}
              />
              <span className="text-sm text-gray-700">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Référencement (SEO)</h3>
        {champ('Titre de la page (onglet du navigateur)', 'seo_title')}
        {champ('Description (moteurs de recherche)', 'seo_description', { multiligne: true })}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mots-clés (séparés par des virgules)</label>
          <input
            type="text"
            value={motsCles}
            onChange={(e) => setMotsCles(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={enCours}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {enCours ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer la page publique
        </button>
      </div>
    </form>
  );
}
