import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, clearAuthData } from '../utils/auth';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/jobs', label: 'Jobs Management', icon: '📋' },
    { path: '/admin/notifications', label: 'Notifications', icon: '📢' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' }
  ];

  const userMenuItems = [
    { path: '/dashboard', label: 'My Tasks', icon: '✅' },
    { path: '/dashboard/notifications', label: 'Notifications', icon: '📢' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="sidebar">
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <h2 style={{ 
          color: '#333', 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          MaintenoX
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginTop: '16px' 
        }}>
          <div className="avatar">
            {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ 
        position: 'absolute', 
        bottom: '24px', 
        left: '24px', 
        right: '24px' 
      }}>
        <button 
          onClick={handleLogout}
          className="btn btn-danger w-full"
          style={{ width: '100%' }}
        >
          <span style={{ marginRight: '8px' }}>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;