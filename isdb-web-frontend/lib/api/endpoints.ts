

export const ENDPOINTS = {
  // LOGIN & REGISTER & LOGOUT
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  USER: '/user',
  UPDATE_PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',

  // Blogs
  BLOGS: '/blogs',
  BLOG_BY_SLUG: (slug: string) => `/blogs/${slug}`,
  ADMIN_BLOG_BY_ID: (id: number) => `/dashboard/blogs/${id}`,
  ADMIN_BLOG_STATUT: (id: number) => `/dashboard/blogs/${id}/statut`,
  
  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_BLOGS: '/dashboard/blogs',
  DASHBOARD_BLOG_EDIT: (id: number) => `/dashboard/blogs/${id}/edit`,

  // Dashboard Redacteurs
  REDACTEURS: '/dashboard/redacteurs',
  REDACTEUR_BY_ID: (id: number) => `/dashboard/redacteurs/${id}`,

  // Tags
  TAGS: '/blogs/tags',
  TAG_BY_SLUG: (slug: string) => `/blogs/tags/${slug}`,
  ADMIN_TAGS: '/admin/tags',

  // Dashboard Domaines
  DASHBOARD_DOMAINES: '/dashboard/domaines',
  DASHBOARD_DOMAINE_BY_ID: (id: number) => `/dashboard/domaines/${id}`,
  DASHBOARD_DOMAINE_EDIT: (id: number) => `/dashboard/domaines/${id}/edit`,

  // Dashboard Mentions
  DASHBOARD_MENTIONS: '/dashboard/mentions',
  DASHBOARD_MENTION_BY_ID: (id: number) => `/dashboard/mentions/${id}`,
  DASHBOARD_MENTION_EDIT: (id: number) => `/dashboard/mentions/${id}/edit`,

  // Dashboard Formations
  DASHBOARD_FORMATIONS: '/dashboard/formations',
  DASHBOARD_FORMATION_BY_ID: (id: number) => `/dashboard/formations/${id}`,
  DASHBOARD_FORMATION_MODULAIRE_EDIT: (id: number) => `/dashboard/formations/${id}/edit-modulaire`,
  DASHBOARD_FORMATION_PRINCIPALE_EDIT: (id: number) => `/dashboard/formations/${id}/edit`,
  DASHBOARD_FORMATION_OFFRES: (id: number) => `/dashboard/formations/${id}/offres`,

  // Dashboard Années Académiques
  DASHBOARD_ANNEES_ACADEMIQUES: '/dashboard/annees-academiques',
  DASHBOARD_ANNEE_ACADEMIQUE_NEW: '/dashboard/annees-academiques/create',
  DASHBOARD_ANNEE_ACADEMIQUE_BY_ID: (id: number) => `/dashboard/annees-academiques/${id}`,
  DASHBOARD_ANNEE_ACADEMIQUE_DETAILS: (id: number) => `/dashboard/annees-academiques/${id}/details`,
  DASHBOARD_ANNEE_ACADEMIQUE_EDIT: (id: number) => `/dashboard/annees-academiques/${id}/edit`,

  // Dashboard Offres de Formation
  DASHBOARD_OFFRES_FORMATIONS: '/dashboard/offres-formations',
  DASHBOARD_OFFRE_FORMATION_NEW: '/dashboard/offres-formations/create',
  DASHBOARD_OFFRE_FORMATION_DETAILS: (id: number) => `/dashboard/offres-formations/${id}/details`,
  DASHBOARD_OFFRE_FORMATION_BY_ID: (id: number) => `/dashboard/offres-formations/${id}`,
  DASHBOARD_OFFRE_FORMATION_EDIT: (id: number) => `/dashboard/offres-formations/${id}/edit`,
  DASHBOARD_OFFRE_FORMATION_TOGGLE_DISPENSEE: (id: number) => `/dashboard/offres-formations/${id}/toggle-dispensee`,

  DASHBOARD_RECONDUIRE_OFFRES: '/dashboard/reconduire-offres', 

  // Radio
  RADIO: '/radio',
  DASHBOARD_RADIO: '/dashboard/radio',
  DASHBOARD_RADIO_TOGGLE_LIVE: '/dashboard/radio/toggle-live',

  // Images
  UPLOAD_IMAGE: '/images/upload',
  UPLOAD_MULTIPLE_IMAGES: '/images/upload-multiple',
  DELETE_IMAGE: '/images/delete',
};