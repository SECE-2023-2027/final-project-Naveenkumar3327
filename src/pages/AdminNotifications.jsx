import React, { useState } from 'react';
import Layout from '../components/Layout';
import NotificationPanel from '../components/NotificationPanel';
import { addNotification } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

const AdminNotifications = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      addNotification({
        title: formData.title,
        message: formData.message,
        from: user?.name || 'Admin'
      });

      setFormData({ title: '', message: '' });
      setShowForm(false);
      
      // Refresh the notification panel by triggering a re-render
      window.location.reload();
    } catch (error) {
      console.error('Error adding notification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Notifications Management
          </h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
          >
            <span style={{ marginRight: '8px' }}>📢</span>
            {showForm ? 'Cancel' : 'New Notification'}
          </button>
        </div>

        {/* Add Notification Form */}
        {showForm && (
          <div className="glass-card mb-32" style={{ padding: '24px' }}>
            <h3 style={{ 
              marginBottom: '20px', 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Create New Notification
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Notification Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter notification title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={4}
                  placeholder="Enter your message"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Notification'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <NotificationPanel />
      </div>
    </Layout>
  );
};

export default AdminNotifications;