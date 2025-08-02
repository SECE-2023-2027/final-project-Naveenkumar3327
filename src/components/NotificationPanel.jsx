import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../utils/storage';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    setNotifications(getNotifications());
  };

  const handleDelete = (notificationId) => {
    deleteNotification(notificationId);
    setNotifications(getNotifications());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h2 style={{ 
        marginBottom: '24px', 
        fontSize: '28px', 
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
          <h3 style={{ color: '#666', marginBottom: '8px' }}>No Notifications</h3>
          <p style={{ color: '#999' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="glass-card"
              style={{ 
                padding: '20px',
                opacity: notification.read ? 0.7 : 1,
                borderLeft: `4px solid ${notification.read ? '#ccc' : '#667eea'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    marginBottom: '8px', 
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{ 
                    color: '#666', 
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span>📅 {formatDate(notification.timestamp)}</span>
                    <span>👤 {notification.from || 'Admin'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="btn btn-danger"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;