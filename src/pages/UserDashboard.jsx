import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import { getJobsByUser } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    completed: 0
  });

  // ✅ Get current user only once on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // ✅ Once user is set, load user's jobs
  useEffect(() => {
    if (user) {
      loadUserJobs();
    }
  }, [user]);

  const loadUserJobs = () => {
    const userJobs = getJobsByUser(user.id || user._id);
    setJobs(userJobs);

    const total = userJobs.length;
    const pending = userJobs.filter(job => job.status === 'Pending').length;
    const ongoing = userJobs.filter(job => job.status === 'Ongoing').length;
    const completed = userJobs.filter(job => job.status === 'Completed').length;

    setStats({ total, pending, ongoing, completed });
  };

  const handleJobUpdate = () => {
    loadUserJobs(); // refresh after update
  };

  const getProgressPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Welcome {user?.name || user?.username}</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={cardStyle}>Total Tasks: {stats.total}</div>
          <div style={cardStyle}>Pending: {stats.pending}</div>
          <div style={cardStyle}>Ongoing: {stats.ongoing}</div>
          <div style={cardStyle}>Completed: {stats.completed}</div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Progress</h3>
          <div style={{ height: '20px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${getProgressPercentage()}%`,
              background: 'linear-gradient(to right, #4CAF50, #8BC34A)',
              transition: 'width 0.5s ease-in-out'
            }}></div>
          </div>
          <p>{getProgressPercentage()}% Completed</p>
        </div>

        <div>
          <h2 style={{ marginBottom: '10px' }}>Your Jobs</h2>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onUpdate={handleJobUpdate}
                showActions={true}
              />
            ))
          ) : (
            <p>No jobs assigned yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

const cardStyle = {
  flex: 1,
  padding: '20px',
  margin: '0 10px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  textAlign: 'center',
  fontSize: '18px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

export default UserDashboard;
