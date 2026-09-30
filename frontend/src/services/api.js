const API_BASE = '/api';

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
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok) {
    const errorMsg = data.message || data.error || `Server returned error (${res.status})`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Public Data
  getBooks: async (status = '') => {
    const url = status ? `${API_BASE}/books?status=${status}` : `${API_BASE}/books`;
    const res = await fetch(url);
    return handleResponse(res);
  },
  getBook: async (id) => {
    const res = await fetch(`${API_BASE}/books/${id}`);
    return handleResponse(res);
  },
  getBlogs: async (category = '', tag = '', search = '') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/blogs?${params.toString()}`);
    return handleResponse(res);
  },
  getBlog: async (id) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`);
    return handleResponse(res);
  },
  getGallery: async (category = '') => {
    const url = category ? `${API_BASE}/gallery?category=${category}` : `${API_BASE}/gallery`;
    const res = await fetch(url);
    return handleResponse(res);
  },
  getAuthor: async () => {
    const res = await fetch(`${API_BASE}/author`);
    return handleResponse(res);
  },
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },
  sendContactMessage: async (formData) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
    return handleResponse(res);
  },

  // Admin CRUD Operations
  admin: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    // Books
    createBook: async (data) => {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    updateBook: async (id, data) => {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteBook: async (id) => {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    // Blogs
    createBlog: async (data) => {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    updateBlog: async (id, data) => {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteBlog: async (id) => {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    // Gallery
    createGalleryItem: async (data) => {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    updateGalleryItem: async (id, data) => {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteGalleryItem: async (id) => {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    // Author Profile
    updateAuthor: async (data) => {
      const res = await fetch(`${API_BASE}/author`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    // Messages
    getMessages: async (status = '') => {
      const url = status ? `${API_BASE}/contact/admin/messages?status=${status}` : `${API_BASE}/contact/admin/messages`;
      const res = await fetch(url, { headers: getHeaders() });
      return handleResponse(res);
    },
    updateMessageStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    },
    deleteMessage: async (id) => {
      const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    // Settings
    updateSettings: async (data) => {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    // Upload
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: getHeaders(null, true),
        body: formData
      });
      return handleResponse(res);
    }
  }
};
