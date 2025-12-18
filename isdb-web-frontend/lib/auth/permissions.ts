
import { User } from '@/lib/types/user';

export const permissions = {
  // Permissions blogs
  canViewAllBlogs: (user: User | null) => user?.role === 'admin',
  canCreateBlog: (user: User | null) => !!user,
  canEditBlog: (user: User | null, blogAuteurId: number) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === blogAuteurId;
  },
  canDeleteBlog: (user: User | null, blogAuteurId: number) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === blogAuteurId;
  },
  canPublishBlog: (user: User | null) => user?.role === 'admin',

  // Permissions auteurs
  canManageAuteurs: (user: User | null) => user?.role === 'admin',
  canEditAuteur: (user: User | null, auteurId: number) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === auteurId;
  },

  // Permissions tags
  canManageTags: (user: User | null) => user?.role === 'admin',

  // Permissions générales
  isAdmin: (user: User | null) => user?.role === 'admin',
  isAuteur: (user: User | null) => user?.role === 'auteur',
};
