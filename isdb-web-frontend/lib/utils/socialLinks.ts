import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { InstitutReseauxSociaux } from '@/lib/types/institut';

export const SOCIAL_LINKS: { key: keyof InstitutReseauxSociaux; icon: LucideIcon; label: string }[] = [
  { key: 'facebook', icon: Facebook, label: 'Facebook' },
  { key: 'twitter', icon: Twitter, label: 'Twitter / X' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'instagram', icon: Instagram, label: 'Instagram' },
  { key: 'youtube', icon: Youtube, label: 'YouTube' },
  { key: 'tiktok', icon: Music2, label: 'TikTok' },
  { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
];

export function getSocialHref(key: keyof InstitutReseauxSociaux, value: string): string {
  return key === 'whatsapp' ? `https://wa.me/${value.replace(/[^0-9]/g, '')}` : value;
}
