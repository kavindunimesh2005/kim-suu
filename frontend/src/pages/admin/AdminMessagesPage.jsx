import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mail, Trash2, Eye, CheckCircle2, Archive, MessageSquare, X } from 'lucide-react';

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeMessage, setActiveMessage] = useState(null);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchMessages = async () => {
    try {
      const data = await api.admin.getMessages(selectedStatus === 'all' ? '' : selectedStatus);
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.admin.updateMessageStatus(id, newStatus);
      setAlert({ type: 'success', text: `Message marked as ${newStatus}` });
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: newStatus });
      }
      fetchMessages();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to update status' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.admin.deleteMessage(id);
      setAlert({ type: 'success', text: 'Message deleted' });
      setActiveMessage(null);
      fetchMessages();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to delete message' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Reader Correspondence Inbox</h2>
          <p className="text-muted small mb-0">Inquiries, book purchase requests, and notes received from readers</p>
        </div>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4">
        {['all', 'new', 'read', 'replied', 'archived'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className="btn btn-sm rounded-pill px-3 py-2 text-capitalize fw-semibold"
            style={{
              background: selectedStatus === st ? '#241C1E' : '#fff',
              color: selectedStatus === st ? '#fff' : '#6c757d',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4">Sender</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted small">
                    No messages found under this filter.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} style={{ background: m.status === 'new' ? 'rgba(75, 38, 51, 0.03)' : 'transparent' }}>
                    <td className="ps-4">
                      <span className={`d-block small ${m.status === 'new' ? 'fw-bold' : ''}`}>{m.name}</span>
                      <span className="small text-muted font-monospace">{m.email}</span>
                    </td>
                    <td>
                      <span className={`small text-truncate d-block ${m.status === 'new' ? 'fw-bold text-dark' : 'text-muted'}`} style={{ maxWidth: '280px' }}>
                        {m.subject}
                      </span>
                    </td>
                    <td className="small font-monospace text-muted">
                      {m.date ? new Date(m.date).toLocaleDateString() : ''}
                    </td>
                    <td>
                      <span className={`badge ${
                        m.status === 'new' ? 'bg-danger' : 
                        m.status === 'read' ? 'bg-primary' : 
                        m.status === 'replied' ? 'bg-success' : 'bg-secondary'
                      } small text-uppercase`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        onClick={() => {
                          setActiveMessage(m);
                          if (m.status === 'new') handleUpdateStatus(m.id, 'read');
                        }} 
                        className="btn btn-sm btn-outline-dark rounded-circle p-2 me-1"
                        title="View Message"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)} 
                        className="btn btn-sm btn-outline-danger rounded-circle p-2"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {activeMessage && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="bg-white rounded-4 p-4 p-md-5 max-w-lg w-100 position-relative shadow-2xl"
            style={{ maxWidth: '580px' }}
          >
            <button 
              onClick={() => setActiveMessage(null)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <span className={`badge ${
                activeMessage.status === 'new' ? 'bg-danger' : 
                activeMessage.status === 'read' ? 'bg-primary' : 
                activeMessage.status === 'replied' ? 'bg-success' : 'bg-secondary'
              } small text-uppercase mb-2`}>
                {activeMessage.status}
              </span>
              <h4 className="fw-bold mb-1">{activeMessage.subject}</h4>
              <p className="small text-muted mb-0">
                From: <strong>{activeMessage.name}</strong> ({activeMessage.email})
              </p>
              <span className="small text-muted font-monospace">{activeMessage.date}</span>
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 font-sinhala-title fs-6" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
              {activeMessage.message}
            </div>

            {/* Action buttons */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-3 border-top">
              <div className="d-flex gap-2">
                <button 
                  onClick={() => handleUpdateStatus(activeMessage.id, 'replied')}
                  className="btn btn-sm btn-success rounded-pill px-3"
                >
                  Mark Replied
                </button>
                <button 
                  onClick={() => handleUpdateStatus(activeMessage.id, 'archived')}
                  className="btn btn-sm btn-secondary rounded-pill px-3"
                >
                  Archive
                </button>
              </div>

              <a 
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="btn btn-sm btn-literary rounded-pill px-3"
              >
                Reply via Email &rarr;
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
