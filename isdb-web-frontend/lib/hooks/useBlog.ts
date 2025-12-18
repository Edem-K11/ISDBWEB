

import useSWR from 'swr';
import { blogService } from '@/lib/api/services/blogService';
import { PaginatedResponse } from '@/lib/types/api';
import { Blog } from '@/lib/types/blog';

  interface UseBlogsParams {
    page?: number;
    tag?: string;
    redacteur_id?: number;
    search?: string;
  }

  export function useBlogs(params?: UseBlogsParams) {
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Blog>>(
      ['blogs', params],
      () => blogService.getAll(params),
      {
        revalidateOnFocus: false,
        dedupingInterval: 60000, // 1 minute
      }
    );

  return {
    blogs: data?.data || [],
    meta: data?.meta,
    links: data?.links,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBlog(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Blog>(
    slug ? ['blog', slug] : null,
    () => blogService.getBySlug(slug!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    blog: data,
    isLoading,
    isError: error,
    mutate,
  };
}