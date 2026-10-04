import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

// Appelée par le backend Laravel après une modification faite dans le dashboard,
// pour que le site affiche la nouvelle version sans attendre l'expiration du cache.
const TAGS_AUTORISES = ['institut', 'formations', 'formations-modulaires', 'blogs', 'studios'];

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tags: unknown[] = Array.isArray(body?.tags) ? body.tags : [];

  tags
    .filter((tag): tag is string => typeof tag === 'string' && TAGS_AUTORISES.includes(tag))
    .forEach((tag) => revalidateTag(tag, 'max'));

  return NextResponse.json({ revalidated: true });
}
