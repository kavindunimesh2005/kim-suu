import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Check, X, BookOpen, Upload } from 'lucide-react';

export const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenAdd = () => {
    setEditingBook({
      title_si: '',
      title_en: '',
      slug: '',
      author: 'Suchetha Kapuarachchi',
      subtitle_si: '',
      subtitle_en: '',
      genre: 'Romantic Fiction',
      isbn: '',
      published_year: '2026',
      pages: 300,
      publisher: 'Grantha Publishers',
      status: 'published',
      cover_image: '/assets/huluaththa-cover.jpg',
      theme_id: 'default',
      price_lkr: 1500,
      description_si: '',
      description_en: '',
      full_description_si: '',
      full_description_en: '',
      theme: {
        primary: '#4B2633',
        secondary: '#7A4A56',
        background: '#F8F3EE',
        text: '#241C1E',
        accent: '#C8A27A'
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook({ ...book });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingBook.id) {
        await api.admin.updateBook(editingBook.id, editingBook);
        setAlert({ type: 'success', text: 'Book updated successfully!' });
      } else {
        await api.admin.createBook(editingBook);
        setAlert({ type: 'success', text: 'Book created successfully!' });
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to save book' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.admin.deleteBook(id);
      setAlert({ type: 'success', text: 'Book removed' });
      fetchBooks();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to delete book' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Books & Novels Management</h2>
          <p className="text-muted small mb-0">Manage Suchetha's literary catalog, theme colors, and descriptions</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-literary rounded-pill">
          <Plus size={16} />
          <span>Add New Book</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      {/* Books Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4">Cover</th>
                <th>Title (Sinhala / English)</th>
                <th>Theme World</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="ps-4">
                    <img 
                      src={b.cover_image} 
                      alt={b.title_en} 
                      style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td>
                    <span className="fw-bold d-block font-sinhala-title">{b.title_si}</span>
                    <span className="small text-muted">{b.title_en}</span>
                  </td>
                  <td>
                    <span className="badge rounded-pill px-2 py-1 small" style={{ background: b.theme?.primary || '#4B2633', color: '#fff' }}>
                      {b.theme_id}
                    </span>
                  </td>
                  <td className="small text-muted">{b.genre}</td>
                  <td className="small font-monospace">LKR {b.price_lkr}</td>
                  <td>
                    <span className={`badge ${b.status === 'published' ? 'bg-success' : 'bg-warning'} small text-uppercase`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => handleOpenEdit(b)} 
                      className="btn btn-sm btn-outline-primary rounded-circle p-2 me-2"
                      title="Edit Book"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)} 
                      className="btn btn-sm btn-outline-danger rounded-circle p-2"
                      title="Delete Book"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingBook && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="bg-white rounded-4 p-4 p-md-5 max-w-2xl w-100 position-relative shadow-2xl"
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4">
              {editingBook.id ? 'Edit Book Details' : 'Create New Book'}
            </h4>

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Sinhala Title *</label>
                  <input 
                    type="text" 
                    value={editingBook.title_si}
                    onChange={e => setEditingBook({ ...editingBook, title_si: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">English Title *</label>
                  <input 
                    type="text" 
                    value={editingBook.title_en}
                    onChange={e => setEditingBook({ ...editingBook, title_en: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Theme ID</label>
                  <select 
                    value={editingBook.theme_id}
                    onChange={e => setEditingBook({ ...editingBook, theme_id: e.target.value })}
                    className="form-select"
                  >
                    <option value="huluAththa">huluAththa (Green)</option>
                    <option value="arungal">arungal (Warm Brown)</option>
                    <option value="default">default (Plum)</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Price (LKR)</label>
                  <input 
                    type="number" 
                    value={editingBook.price_lkr}
                    onChange={e => setEditingBook({ ...editingBook, price_lkr: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Publication Status</label>
                  <select 
                    value={editingBook.status}
                    onChange={e => setEditingBook({ ...editingBook, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Cover Image Path</label>
                <input 
                  type="text" 
                  value={editingBook.cover_image}
                  onChange={e => setEditingBook({ ...editingBook, cover_image: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Sinhala Short Synopsis</label>
                <textarea 
                  rows="2"
                  value={editingBook.description_si}
                  onChange={e => setEditingBook({ ...editingBook, description_si: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">English Short Synopsis</label>
                <textarea 
                  rows="2"
                  value={editingBook.description_en}
                  onChange={e => setEditingBook({ ...editingBook, description_en: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Sinhala Full Story Background</label>
                <textarea 
                  rows="4"
                  value={editingBook.full_description_si}
                  onChange={e => setEditingBook({ ...editingBook, full_description_si: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary rounded-pill px-4">
                  Cancel
                </button>
                <button type="submit" className="btn btn-literary rounded-pill px-4">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
