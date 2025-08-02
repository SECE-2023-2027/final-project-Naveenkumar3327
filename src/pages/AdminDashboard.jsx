import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getJobs, getUsers } from '../utils/storage';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    ongoingJobs: 0
  });

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const jobs = getJobs();
    const users = getUsers().filter(user => user.role === 'user');

    setStats({
      totalUsers: users.length,
      totalJobs: jobs.length,
      completedJobs: jobs.filter(job => job.status === 'Completed').length,
      pendingJobs: jobs.filter(job => job.status === 'Pending').length,
      ongoingJobs: jobs.filter(job => job.status === 'Ongoing').length
    });

    // Get recent jobs (last 5)
    const sortedJobs = jobs.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    setRecentJobs(sortedJobs.slice(0, 5));
  }, []);

  const getProgressPercentage = () => {
    if (stats.totalJobs === 0) return 0;
    return Math.round((stats.completedJobs / stats.totalJobs) * 100);
  };

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
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div style={{ marginTop: '8px', fontSize: '24px' }}>👥</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{stats.totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
            <div style={{ marginTop: '8px', fontSize: '24px' }}>📋</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{stats.completedJobs}</div>
            <div className="stat-label">Completed Jobs</div>
            <div style={{ marginTop: '8px', fontSize: '24px' }}>✅</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{getProgressPercentage()}%</div>
            <div className="stat-label">Completion Rate</div>
            <div style={{ marginTop: '8px', fontSize: '24px' }}>📊</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass-card mb-32" style={{ padding: '24px' }}>
          <h2 style={{ 
            marginBottom: '20px', 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Job Status Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#ff8f00',
                marginBottom: '4px'
              }}>
                {stats.pendingJobs}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#007bff',
                marginBottom: '4px'
              }}>
                {stats.ongoingJobs}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Ongoing</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#28a745',
                marginBottom: '4px'
              }}>
                {stats.completedJobs}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Completed</div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ 
            marginBottom: '20px', 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Recent Jobs
          </h2>
          
          {recentJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>No jobs created yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentJobs.map((job) => (
                <div 
                  key={job.id}
                  style={{ 
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {job.category} • Assigned to {job.assignedToName}
                    </div>
                  </div>
                  <div className={`task-status ${
                    job.status === 'Pending' ? 'status-pending' :
                    job.status === 'Ongoing' ? 'status-ongoing' : 'status-completed'
                  }`}>
                    {job.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;