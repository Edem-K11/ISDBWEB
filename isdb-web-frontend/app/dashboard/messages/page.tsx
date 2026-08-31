'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useContactMessages } from '@/lib/hooks/useContactMessages';
import { contactMessageService } from '@/lib/api/services/contactMessageService';
import { ContactMessage } from '@/lib/types/contactMessage';
import { ShieldAlert, Mail, MailOpen, Trash2, Inbox } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirmModal';
import MessageDetailModal from '@/components/dashboard/messages/messageDetailModal';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { isAdmin } = useAuth();
  const { messages, unreadCount, mutate, isLoading } = useContactMessages(isAdmin());
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
        <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
      </div>
    );
  }

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setDetailModalOpen(true);

    if (!message.lu) {
      try {
        const updated = await contactMessageService.get(message.id);
        setSelectedMessage(updated);
        mutate();
      } catch {
        // silencieux : la lecture reste possible même si le marquage échoue
      }
    }
  };

  const handleAskDelete = (id: number) => {
    setDetailModalOpen(false);
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;

    try {
      await contactMessageService.delete(messageToDelete);
      toast.success('Message supprimé avec succès');
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages de contact</h1>
        <p className="text-gray-600 mt-1">
          {messages.length} message{messages.length > 1 ? 's' : ''}
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-isdb-green-100 text-isdb-green-700">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          )}
          {' '}— envoyés depuis le formulaire public /contact
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center text-center">
          <Inbox className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun message pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleOpenMessage(message)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenMessage(message)}
              className={`w-full flex items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50 cursor-pointer ${
                !message.lu ? 'bg-isdb-green-50/40' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {message.lu ? (
                  <MailOpen className="w-5 h-5 text-gray-400" />
                ) : (
                  <Mail className="w-5 h-5 text-isdb-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate ${!message.lu ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {message.sujet}
                  </p>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {message.nom} · {message.email}
                </p>
                <p className="text-sm text-gray-400 truncate mt-0.5">{message.message}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAskDelete(message.id);
                }}
                className="flex-shrink-0 p-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <MessageDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        message={selectedMessage}
        onDelete={handleAskDelete}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
