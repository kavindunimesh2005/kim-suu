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

// Local storage persistent helpers for stateless/serverless environments (e.g. Vercel)
const getLocalData = (key) => {
  try {
    const raw = localStorage.getItem(`kim_suu_${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`kim_suu_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving local data for ${key}:`, e);
  }
};

const getDeletedIds = (key) => {
  try {
    const raw = localStorage.getItem(`kim_suu_deleted_${key}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

const addDeletedId = (key, id) => {
  try {
    const set = getDeletedIds(key);
    if (id) {
      set.add(String(id));
      localStorage.setItem(`kim_suu_deleted_${key}`, JSON.stringify(Array.from(set)));
    }
  } catch (e) {
    console.error(`Error recording deleted id for ${key}:`, e);
  }
};

const filterDeleted = (key, items) => {
  if (!Array.isArray(items)) return items;
  const deleted = getDeletedIds(key);
  if (deleted.size === 0) return items;
  return items.filter(item => {
    const id = item?.id ? String(item.id) : null;
    const slug = item?.slug ? String(item.slug) : null;
    if (id && deleted.has(id)) return false;
    if (slug && deleted.has(slug)) return false;
    return true;
  });
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok) {
    const errorMsg = data.message || data.error || `Server error (${res.status})`;
    throw new Error(errorMsg);
  }
  return data;
};

// Helper: Compress and convert image file to Base64 Data URL so images always preview & display reliably in all environments
const fileToDataUrl = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data URL if image can't be decoded on canvas
        resolve(e.target.result);
      };
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target.result);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const api = {
  // Public Data
  getBooks: async (status = '') => {
    let items = null;
    try {
      const url = status ? `${API_BASE}/books?status=${status}` : `${API_BASE}/books`;
      const res = await fetch(url);
      items = await handleResponse(res);
      setLocalData('books', items);
    } catch (err) {
      items = getLocalData('books') || [];
    }
    const filtered = filterDeleted('books', items);
    if (status) {
      return filtered.filter(b => b.status === status);
    }
    return filtered;
  },

  getBook: async (id) => {
    const books = await api.getBooks();
    const found = books.find(b => String(b.id) === String(id) || String(b.slug) === String(id));
    if (found) return found;
    const res = await fetch(`${API_BASE}/books/${id}`);
    return handleResponse(res);
  },

  getBlogs: async (category = '', tag = '', search = '') => {
    let items = null;
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (tag) params.append('tag', tag);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/blogs?${params.toString()}`);
      items = await handleResponse(res);
      setLocalData('blogs', items);
    } catch (err) {
      items = getLocalData('blogs') || [];
    }
    let filtered = filterDeleted('blogs', items);
    if (category && category !== 'All') {
      filtered = filtered.filter(b => b.category === category);
    }
    if (tag) {
      filtered = filtered.filter(b => b.tags && b.tags.includes(tag));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title_si && b.title_si.toLowerCase().includes(q)) ||
        (b.title_en && b.title_en.toLowerCase().includes(q))
      );
    }
    return filtered;
  },

  getBlog: async (id) => {
    const blogs = await api.getBlogs();
    const found = blogs.find(b => String(b.id) === String(id) || String(b.slug) === String(id));
    if (found) return found;
    const res = await fetch(`${API_BASE}/blogs/${id}`);
    return handleResponse(res);
  },

  getGallery: async (category = '') => {
    let items = null;
    try {
      const url = category ? `${API_BASE}/gallery?category=${category}` : `${API_BASE}/gallery`;
      const res = await fetch(url);
      items = await handleResponse(res);
      setLocalData('gallery', items);
    } catch (err) {
      items = getLocalData('gallery') || [];
    }
    const filtered = filterDeleted('gallery', items);
    if (category && category !== 'All') {
      return filtered.filter(g => g.category === category);
    }
    return filtered;
  },

  getAuthor: async () => {
    try {
      const res = await fetch(`${API_BASE}/author`);
      const data = await handleResponse(res);
      setLocalData('author', data);
      return data;
    } catch (err) {
      return getLocalData('author') || {};
    }
  },

  getSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await handleResponse(res);
      setLocalData('settings', data);
      return data;
    } catch (err) {
      return getLocalData('settings') || {};
    }
  },

  sendContactMessage: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await handleResponse(res);
      return data;
    } catch (err) {
      // Offline / fallback simulation
      const current = getLocalData('messages') || [];
      const newMsg = {
        id: `msg-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        status: 'new',
        ...formData
      };
      setLocalData('messages', [newMsg, ...current]);
      return { success: true, message: 'Message sent successfully' };
    }
  },

  // Admin CRUD Operations
  admin: {
    getDashboard: async () => {
      const [books, blogs, gallery, messages] = await Promise.all([
        api.getBooks(),
        api.getBlogs(),
        api.getGallery(),
        api.admin.getMessages()
      ]);

      const published_books = books.filter(b => b.status === 'published').length;
      const published_blogs = blogs.filter(b => b.status === 'published').length;
      const draft_blogs = blogs.length - published_blogs;
      const new_messages = messages.filter(m => m.status === 'new').length;

      return {
        stats: {
          total_books: books.length,
          published_books,
          total_blogs: blogs.length,
          published_blogs,
          draft_blogs,
          total_gallery: gallery.length,
          total_messages: messages.length,
          new_messages
        },
        recent_messages: messages.slice(0, 5),
        books_summary: books.map(b => ({
          id: b.id,
          title_si: b.title_si,
          title_en: b.title_en,
          status: b.status
        }))
      };
    },

    // Books
    createBook: async (data) => {
      let created = null;
      try {
        const res = await fetch(`${API_BASE}/books`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        created = await handleResponse(res);
      } catch (err) {
        console.warn('Backend save failed, using local save:', err);
      }
      const newBook = created || {
        id: `book-${Date.now()}`,
        slug: (data.title_en || 'novel').toLowerCase().replace(/\s+/g, '-'),
        ...data
      };
      const current = (await api.getBooks()).filter(b => b.id !== newBook.id);
      setLocalData('books', [...current, newBook]);
      return newBook;
    },

    updateBook: async (id, data) => {
      try {
        const res = await fetch(`${API_BASE}/books/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, using local update:', err);
      }
      const books = await api.getBooks();
      const idx = books.findIndex(b => String(b.id) === String(id) || String(b.slug) === String(id));
      if (idx !== -1) {
        books[idx] = { ...books[idx], ...data };
        setLocalData('books', books);
        return books[idx];
      }
      return data;
    },

    deleteBook: async (id) => {
      addDeletedId('books', id);
      const books = (await api.getBooks()).filter(b => String(b.id) !== String(id) && String(b.slug) !== String(id));
      setLocalData('books', books);
      try {
        const res = await fetch(`${API_BASE}/books/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend delete notification:', err);
      }
      return { success: true, message: 'Book deleted successfully' };
    },

    // Blogs
    createBlog: async (data) => {
      let created = null;
      try {
        const res = await fetch(`${API_BASE}/blogs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        created = await handleResponse(res);
      } catch (err) {
        console.warn('Backend save failed, using local save:', err);
      }
      const newBlog = created || {
        id: `blog-${Date.now()}`,
        slug: (data.title_en || 'essay').toLowerCase().replace(/\s+/g, '-'),
        date: new Date().toISOString().slice(0, 10),
        ...data
      };
      const current = (await api.getBlogs()).filter(b => b.id !== newBlog.id);
      setLocalData('blogs', [newBlog, ...current]);
      return newBlog;
    },

    updateBlog: async (id, data) => {
      try {
        const res = await fetch(`${API_BASE}/blogs/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, using local update:', err);
      }
      const blogs = await api.getBlogs();
      const idx = blogs.findIndex(b => String(b.id) === String(id) || String(b.slug) === String(id));
      if (idx !== -1) {
        blogs[idx] = { ...blogs[idx], ...data };
        setLocalData('blogs', blogs);
        return blogs[idx];
      }
      return data;
    },

    deleteBlog: async (id) => {
      addDeletedId('blogs', id);
      const blogs = (await api.getBlogs()).filter(b => String(b.id) !== String(id) && String(b.slug) !== String(id));
      setLocalData('blogs', blogs);
      try {
        const res = await fetch(`${API_BASE}/blogs/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend delete notification:', err);
      }
      return { success: true, message: 'Blog deleted successfully' };
    },

    // Gallery
    createGalleryItem: async (data) => {
      let created = null;
      try {
        const res = await fetch(`${API_BASE}/gallery`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        created = await handleResponse(res);
      } catch (err) {
        console.warn('Backend save failed, using local save:', err);
      }
      const newItem = created || {
        id: `gal-${Date.now()}`,
        ...data
      };
      const current = (await api.getGallery()).filter(g => g.id !== newItem.id);
      setLocalData('gallery', [newItem, ...current]);
      return newItem;
    },

    updateGalleryItem: async (id, data) => {
      try {
        const res = await fetch(`${API_BASE}/gallery/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, using local update:', err);
      }
      const items = await api.getGallery();
      const idx = items.findIndex(g => String(g.id) === String(id));
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...data };
        setLocalData('gallery', items);
        return items[idx];
      }
      return data;
    },

    deleteGalleryItem: async (id) => {
      addDeletedId('gallery', id);
      const items = (await api.getGallery()).filter(g => String(g.id) !== String(id));
      setLocalData('gallery', items);
      try {
        const res = await fetch(`${API_BASE}/gallery/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend delete notification:', err);
      }
      return { success: true, message: 'Gallery item deleted successfully' };
    },

    // Author Profile
    updateAuthor: async (data) => {
      setLocalData('author', data);
      try {
        const res = await fetch(`${API_BASE}/author`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, local updated:', err);
      }
      return data;
    },

    // Messages
    getMessages: async (status = '') => {
      let items = getLocalData('messages');
      if (!items) {
        try {
          const url = status ? `${API_BASE}/contact/admin/messages?status=${status}` : `${API_BASE}/contact/admin/messages`;
          const res = await fetch(url, { headers: getHeaders() });
          items = await handleResponse(res);
          setLocalData('messages', items);
        } catch (err) {
          items = [];
        }
      }
      const filtered = filterDeleted('messages', items);
      if (status) {
        return filtered.filter(m => m.status === status);
      }
      return filtered;
    },

    updateMessageStatus: async (id, status) => {
      const messages = await api.admin.getMessages();
      const idx = messages.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) {
        messages[idx].status = status;
        setLocalData('messages', messages);
      }
      try {
        const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, local updated:', err);
      }
      return { success: true };
    },

    deleteMessage: async (id) => {
      addDeletedId('messages', id);
      const messages = (await api.admin.getMessages()).filter(m => String(m.id) !== String(id));
      setLocalData('messages', messages);
      try {
        const res = await fetch(`${API_BASE}/contact/admin/messages/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend delete notification:', err);
      }
      return { success: true, message: 'Message deleted successfully' };
    },

    // Settings
    updateSettings: async (data) => {
      setLocalData('settings', data);
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        await handleResponse(res);
      } catch (err) {
        console.warn('Backend update failed, local updated:', err);
      }
      return data;
    },

    // Upload
    uploadFile: async (file) => {
      try {
        // 1. Generate high-quality compressed Base64 Data URL for instant, 100% reliable preview & display everywhere
        const dataUrl = await fileToDataUrl(file);

        // 2. Also attempt upload to backend API if available
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: getHeaders(null, true),
            body: formData
          });
          if (res.ok) {
            const serverData = await res.json();
            return {
              success: true,
              url: dataUrl,
              serverUrl: serverData.url,
              filename: serverData.filename
            };
          }
        } catch (backendErr) {
          // Backend offline / serverless fallback
        }

        return {
          success: true,
          url: dataUrl
        };
      } catch (err) {
        throw new Error('Could not process image file: ' + err.message);
      }
    }
  }
};
