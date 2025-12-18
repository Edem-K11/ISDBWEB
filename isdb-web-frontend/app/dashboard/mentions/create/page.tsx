

// Extrait du formulaire de création de mention
'use client';

import { useState, useEffect } from 'react';

export default function CreateMentionPage() {
  const [nom, setNom] = useState('');
  const [domaineId, setDomaineId] = useState('');
  const [domaines, setDomaines] = useState([]);
  const [isLoadingDomaines, setIsLoadingDomaines] = useState(true);

  useEffect(() => {
    // Charger la liste des domaines
    const loadDomaines = async () => {
      try {
        const response = await fetch('/api/domaines');
        const data = await response.json();
        setDomaines(data);
      } catch (error) {
        console.error('Erreur de chargement des domaines:', error);
      } finally {
        setIsLoadingDomaines(false);
      }
    };
    loadDomaines();
  }, []);

  return (
    <div>
      {/* ... structure similaire à la création de domaine ... */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domaine associé <span className="text-red-500">*</span>
        </label>
        <select
          value={domaineId}
          onChange={(e) => setDomaineId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
          required
        >
          <option value="">Sélectionnez un domaine</option>
          {domaines.map((domaine: any) => (
            <option key={domaine.id} value={domaine.id}>
              {domaine.nom}
            </option>
          ))}
        </select>
      </div>

      {/* ... reste du formulaire ... */}
    </div>
  );
}