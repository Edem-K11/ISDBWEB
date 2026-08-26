const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { Blog } from '@/lib/types/blog';

export async function getLatestBlogs(limit = 3): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs`, {
      next: { revalidate: 900 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.data || []).slice(0, limit);
  } catch {
    return [];
  }
}
