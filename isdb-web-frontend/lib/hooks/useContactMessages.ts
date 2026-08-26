import useSWR from 'swr';
import { contactMessageService } from '@/lib/api/services/contactMessageService';
import { ContactMessage } from '@/lib/types/contactMessage';

export function useContactMessages() {
  const { data, error, isLoading, mutate } = useSWR<ContactMessage[]>(
    'dashboard-messages',
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
