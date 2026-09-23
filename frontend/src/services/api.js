export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, '');
const API_BASE = '/api';

/**
 * Resolve absolute or relative media URLs.
 * Handles full URLs (http/https), public frontend assets (/assets/...),
 * and uploaded backend files (/uploads/...).
 */
export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Public static assets hosted in Vite public directory
  if (path.startsWith('/assets/')) {
    return path;
  }
  // Uploaded media from Flask backend
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_BASE}${cleanPath}`;
}

const getHeaders = (token = null, isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const authToken = token || localStorage.getItem('admin_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = `Server error ${res.status}`;
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errJson.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  const json = await res.json();
  if (json && json.data !== undefined) {
    return json.data;
  }
  return json;
};

const handleAdminResponse = async (res) => {
  let json = {};
  try {
    json = await res.json();
  } catch (_) {}

  if (!res.ok || json.success === false) {
    const errorMsg = json.error || json.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return json;
};

// ==========================================
// Named Public API Functions
// ==========================================

export async function getBooks() {
  const res = await fetch(`${API_BASE}/books`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getBook(idOrSlug) {
  const res = await fetch(`${API_BASE}/books/${idOrSlug}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getBlogs(category = '', tag = '', search = '') {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (tag) params.append('tag', tag);
  if (search) params.append('search', search);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/blogs${queryStr}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getBlog(idOrSlug) {
  const res = await fetch(`${API_BASE}/blogs/${idOrSlug}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getStories(category = '') {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/stories${queryStr}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getStory(id) {
  const res = await fetch(`${API_BASE}/stories/${id}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getGallery(categoryOrOptions = '') {
  const params = new URLSearchParams();
  if (typeof categoryOrOptions === 'string') {
    if (categoryOrOptions && categoryOrOptions !== 'All') {
      params.append('category', categoryOrOptions);
    }
  } else if (categoryOrOptions && typeof categoryOrOptions === 'object') {
    if (categoryOrOptions.category && categoryOrOptions.category !== 'All') {
      params.append('category', categoryOrOptions.category);
    }
    if (categoryOrOptions.showInBlog) {
      params.append('showInBlog', 'true');
    }
    if (categoryOrOptions.limit) {
      params.append('limit', String(categoryOrOptions.limit));
    }
  }
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/gallery${queryStr}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getAuthor() {
  const res = await fetch(`${API_BASE}/author`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function sendContactMessage(formData) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    let errorMsg = 'Failed to submit message';
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errJson.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return res.json();
}

// ==========================================
// Centralized API Object (supporting both styles)
// ==========================================

export const api = {
  getBooks,
  getBook,
  getBlogs,
  getBlog,
  getStories,
  getStory,
  getGallery,
  getAuthor,
  getSettings,
  sendContactMessage,
  getMediaUrl,

  // Admin CRUD & Auth Operations
  admin: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return res.json();
    },
    verify: async () => {
      const res = await fetch(`${API_BASE}/admin/verify`, {
        headers: getHeaders()
      });
      return res.json();
    },
    logout: async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/logout`, {
          method: 'POST',
          headers: getHeaders()
        });
        return res.json();
      } catch (e) {
        return { success: true };
      }
    },
    getDashboard: async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      return res.json();
    },

    // Books
    getBooks: async () => {
      const res = await fetch(`${API_BASE}/admin/books`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      return handleResponse(res);
    },
    createBook: async (data) => {
      const res = await fetch(`${API_BASE}/admin/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    updateBook: async (id, data) => {
      const res = await fetch(`${API_BASE}/admin/books/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    deleteBook: async (id) => {
      const res = await fetch(`${API_BASE}/admin/books/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleAdminResponse(res);
    },
    togglePublishBook: async (id, published) => {
      const res = await fetch(`${API_BASE}/admin/books/${id}/publish`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ published })
      });
      return handleAdminResponse(res);
    },

    // Blogs
    getBlogs: async () => {
      const res = await fetch(`${API_BASE}/admin/blogs`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      return handleResponse(res);
    },
    createBlog: async (data) => {
      const res = await fetch(`${API_BASE}/admin/blogs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    updateBlog: async (id, data) => {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    deleteBlog: async (id) => {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleAdminResponse(res);
    },

    // Stories
    getStories: async () => {
      const res = await fetch(`${API_BASE}/admin/stories`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      return handleResponse(res);
    },
    createStory: async (data) => {
      const res = await fetch(`${API_BASE}/admin/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    updateStory: async (id, data) => {
      const res = await fetch(`${API_BASE}/admin/stories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    deleteStory: async (id) => {
      const res = await fetch(`${API_BASE}/admin/stories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleAdminResponse(res);
    },

    // Gallery
    getGallery: async () => {
      const res = await fetch(`${API_BASE}/admin/gallery`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      return handleResponse(res);
    },
    createGalleryItem: async (data) => {
      const res = await fetch(`${API_BASE}/admin/gallery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    updateGalleryItem: async (id, data) => {
      const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },
    deleteGalleryItem: async (id) => {
      const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleAdminResponse(res);
    },

    // Author Profile
    updateAuthor: async (data) => {
      const res = await fetch(`${API_BASE}/admin/author`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },

    // Messages
    getMessages: async (status = '') => {
      const url = status ? `${API_BASE}/admin/messages?read=${status === 'read'}` : `${API_BASE}/admin/messages`;
      const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' });
      return handleResponse(res);
    },
    updateMessageStatus: async (id, status) => {
      const isRead = status === 'read' || status === true;
      const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ read: isRead })
      });
      return handleAdminResponse(res);
    },
    deleteMessage: async (id) => {
      const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleAdminResponse(res);
    },

    // Settings
    updateSettings: async (data) => {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleAdminResponse(res);
    },

    // Upload
    uploadFile: async (file, category = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: getHeaders(null, true),
        body: formData
      });
      return handleAdminResponse(res);
    }
  }
};
