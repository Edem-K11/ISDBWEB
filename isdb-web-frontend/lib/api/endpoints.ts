
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
    
    //dashboard
    DASHBOARD: '/dashboard',
    DASHBOARD_BLOGS: '/dashboard/blogs',
    DASHBOARD_BLOG_EDIT: (id: number) => `/dashboard/blogs/${id}/edit`,

    // dashboard redacteurs
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

    // Images
    UPLOAD_IMAGE: '/images/upload',
    UPLOAD_MULTIPLE_IMAGES: '/images/upload-multiple',
    DELETE_IMAGE: '/images/delete',

  };
