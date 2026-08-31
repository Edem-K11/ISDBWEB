import useSWR from 'swr';
import { contactMessageService } from '@/lib/api/services/contactMessageService';
import { ContactMessage } from '@/lib/types/contactMessage';

// `enabled` évite d'appeler l'API (réservée aux admins côté backend) pour un
// redacteur qui n'y a pas accès — sinon la requête échoue systématiquement en 403.
export function useContactMessages(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<ContactMessage[]>(
    enabled ? 'dashboard-messages' : null,
    contactMessageService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const messages = data || [];

  return {
    messages,
    unreadCount: messages.filter((m) => !m.lu).length,
    isLoading,
    isError: error,
    mutate,
  };
}
