import React from 'react';
import Layout from '../components/Layout';
import NotificationPanel from '../components/NotificationPanel';

const UserNotifications = () => {
  return (
    <Layout>
      <div className="fade-in">
        <NotificationPanel />
      </div>
    </Layout>
  );
};

export default UserNotifications;