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

export const api = {
  // Public Data
  getBooks: async (status = '') => {
    const url = status ? `${API_BASE}/books?status=${status}` : `${API_BASE}/books`;
    const res = await fetch(url);
    return res.json();
  },
  getBook: async (id) => {
    const res = await fetch(`${API_BASE}/books/${id}`);
    return res.json();
  },
  getBlogs: async (category = '', tag = '', search = '') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/blogs?${params.toString()}`);
    return res.json();
  },
  getBlog: async (id) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`);
    return res.json();
  },
  getStories: async (category = '') => {
    const url = category ? `${API_BASE}/stories?category=${category}` : `${API_BASE}/stories`;
    const res = await fetch(url);
    return res.json();
  },
  getGallery: async (category = '') => {
    const url = category ? `${API_BASE}/gallery?category=${category}` : `${API_BASE}/gallery`;
    const res = await fetch(url);
    return res.json();
  },
  getAuthor: async () => {
    const res = await fetch(`${API_BASE}/author`);
    return res.json();
  },
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },
  sendContactMessage: async (formData) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
    return res.json();
  },

  // Admin CRUD Operations
  admin: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders()
      });
      return res.json();
    },
    // Books
    createBook: async (data) => {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateBook: async (id, data) => {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    deleteBook: async (id) => {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    },
    // Blogs
    createBlog: async (data) => {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateBlog: async (id, data) => {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    deleteBlog: async (id) => {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    },
    // Stories
    createStory: async (data) => {
      const res = await fetch(`${API_BASE}/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateStory: async (id, data) => {
      const res = await fetch(`${API_BASE}/stories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    deleteStory: async (id) => {
      const res = await fetch(`${API_BASE}/stories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    },
    // Gallery
    createGalleryItem: async (data) => {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateGalleryItem: async (id, data) => {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    deleteGalleryItem: async (id) => {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    },
    // Author Profile
    updateAuthor: async (data) => {
      const res = await fetch(`${API_BASE}/author`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    // Messages
    getMessages: async (status = '') => {
      const url = status ? `${API_BASE}/contact/admin/messages?status=${status}` : `${API_BASE}/contact/admin/messages`;
      const res = await fetch(url, { headers: getHeaders() });
      return res.json();
    },
    updateMessageStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return res.json();
    },
    deleteMessage: async (id) => {
      const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    },
    // Settings
    updateSettings: async (data) => {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
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
      return res.json();
    }
  }
};
