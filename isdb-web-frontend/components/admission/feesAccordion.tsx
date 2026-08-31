'use client';

// components/admission/feesAccordion.tsx
// Extrait de la page /admission (devenue un Server Component pour aller
// chercher les vraies données de l'institut) : c'est la seule partie
// réellement interactive de cette page.

import { useState, type ReactNode } from 'react';

export interface FeeItem {
  id: number;
  question: string;
  answer: ReactNode;
}

export default function FeesAccordion({ items }: Readonly<{ items: FeeItem[] }>) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleFaq(item.id)}
            className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-sm sm:text-lg font-semibold text-gray-900">{item.question}</span>
            <svg
              className={`w-5 h-5 text-isdb-green-600 transform transition-transform duration-200 shrink-0 ${
                openFaq === item.id ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`px-6 overflow-hidden transition-all duration-300 ${
              openFaq === item.id ? 'max-h-96 pb-5' : 'max-h-0'
            }`}
          >
            <div className="pt-2 text-[12px] sm:text-base">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
