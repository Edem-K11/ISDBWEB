'use client';

import { X, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { ContactMessage } from '@/lib/types/contactMessage';

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage | null;
  onDelete: (id: number) => void;
}

export default function MessageDetailModal({ isOpen, onClose, message, onDelete }: MessageDetailModalProps) {
  if (!isOpen || !message) return null;

  const formattedDate = new Date(message.created_at).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="mb-1 text-2xl font-bold text-gray-900 pr-8">{message.sujet}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-6">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </p>

          <div className="space-y-3 mb-6 bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900">{message.nom}</p>
            <a
              href={`mailto:${message.email}`}
              className="flex items-center gap-2 text-sm text-isdb-green-700 hover:underline"
            >
              <Mail className="w-4 h-4" />
              {message.email}
            </a>
            {message.telephone && (
              <a
                href={`tel:${message.telephone}`}
                className="flex items-center gap-2 text-sm text-isdb-green-700 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {message.telephone}
              </a>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">{message.message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Fermer
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
