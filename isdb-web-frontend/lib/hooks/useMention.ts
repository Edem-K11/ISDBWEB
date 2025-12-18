

// lib/hooks/useMention.ts
import useSWR from 'swr';
import { mentionService } from '@/lib/api/services/mentionService';
import { Mention } from '@/lib/types/Mention';

export function useMentions() {
  const { data, error, isLoading, mutate } = useSWR<Mention[]>(
    'Mentions',
    mentionService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    mentions: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMentionsByDomaine(domaineId?: number) {
  const { data, error, isLoading, mutate } = useSWR<Mention[]>(
    domaineId ? [`Mentions/Domaine/${domaineId}`, domaineId] : null,
    ([_, id]) => mentionService.getByDomaine(id as number),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    mentions: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMention(id?: number ) {
  const { data, error, isLoading, mutate } = useSWR<Mention>(
    id ? `Mentions/${id}` : null,
    () => mentionService.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    mention: data,
    isLoading,
    isError: error,
    mutate,
  };
}