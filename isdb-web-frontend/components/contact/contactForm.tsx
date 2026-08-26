'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { contactMessageService } from '@/lib/api/services/contactMessageService';
import { ContactMessageFormData } from '@/lib/types/contactMessage';
import toast from 'react-hot-toast';

const INITIAL_FORM: ContactMessageFormData = {
  nom: '',
  email: '',
  telephone: '',
  sujet: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactMessageFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessageFormData, string>>>({});

  const handleChange = (field: keyof ContactMessageFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await contactMessageService.send(formData);
      setIsSent(true);
      setFormData(INITIAL_FORM);
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        const mapped: Partial<Record<keyof ContactMessageFormData, string>> = {};
        Object.keys(backendErrors).forEach((key) => {
          mapped[key as keyof ContactMessageFormData] = backendErrors[key][0];
        });
        setErrors(mapped);
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-isdb-green-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-isdb-green-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
        <p className="text-slate-600 max-w-sm">
          Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
        </p>
        <button
          onClick={() => setIsSent(false)}
          className="mt-6 text-sm font-semibold text-isdb-green-600 hover:text-isdb-green-700"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nom" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nom complet <span className="text-isdb-red-500">*</span>
          </label>
          <input
            id="nom"
            type="text"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
            placeholder="Votre nom"
          />
          {errors.nom && <p className="text-sm text-red-600 mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email <span className="text-isdb-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
            placeholder="vous@exemple.com"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Téléphone
        </label>
        <input
          id="telephone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => handleChange('telephone', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
          placeholder="+228 00 00 00 00"
        />
        {errors.telephone && <p className="text-sm text-red-600 mt-1">{errors.telephone}</p>}
      </div>

      <div>
        <label htmlFor="sujet" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Sujet <span className="text-isdb-red-500">*</span>
        </label>
        <input
          id="sujet"
          type="text"
          value={formData.sujet}
          onChange={(e) => handleChange('sujet', e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
          placeholder="Objet de votre message"
        />
        {errors.sujet && <p className="text-sm text-red-600 mt-1">{errors.sujet}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Message <span className="text-isdb-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none"
          placeholder="Votre message..."
        />
        {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-isdb-green-600 text-white font-semibold rounded-lg hover:bg-isdb-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
