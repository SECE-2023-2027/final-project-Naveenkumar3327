import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, updateUser, saveAuthData } from '../utils/auth';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const avatarOptions = ['👤', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍💻', '👩‍💻', '🧑‍🔬'];

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      avatar: currentUser?.avatar || '👤'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updates = {
        name: formData.name,
        avatar: formData.avatar
      };

      // If changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage('New passwords do not match.');
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage('Password must be at least 6 characters long.');
          return;
        }
        updates.password = formData.newPassword;
      }

      const updatedUser = updateUser(user.id, updates);
      
      if (updatedUser) {
        // Update auth data
        saveAuthData({
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar
          },
          timestamp: new Date().toISOString()
        });

        setUser(updatedUser);
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <h1 style={{ 
          marginBottom: '32px', 
          fontSize: '32px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Profile Settings
        </h1>

        <div className="glass-card" style={{ padding: '32px', maxWidth: '600px' }}>
          {message && (
            <div style={{
              padding: '12px',
              backgroundColor: message.includes('successfully') ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              border: `1px solid ${message.includes('successfully') ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
              borderRadius: '8px',
              color: message.includes('successfully') ? '#28a745' : '#d32f2f',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="avatar avatar-large" style={{ margin: '0 auto 16px' }}>
              {user.avatar || user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ color: '#333', marginBottom: '4px' }}>{user.name}</h2>
            <p style={{ color: '#666', textTransform: 'capitalize' }}>{user.role}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Email cannot be changed
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map((emoji) => (
                  <div
                    key={emoji}
                    className={`avatar-option ${formData.avatar === emoji ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, avatar: emoji})}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: formData.avatar === emoji ? '2px solid #667eea' : '2px solid transparent'
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <hr style={{ 
              border: 'none', 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
              margin: '24px 0' 
            }} />

            <h3 style={{ 
              marginBottom: '16px', 
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Change Password
            </h3>

            <div className="form-group">
              <label className="form-label">New Password (optional)</label>
              <input
                type="password"
                className="form-input"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                placeholder="Leave blank to keep current password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;