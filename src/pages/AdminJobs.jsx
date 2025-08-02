import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';
import { getJobs, deleteJob, JOB_CATEGORIES, JOB_STATUSES } from '../utils/storage';
import { getUsers } from '../utils/auth';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    assignedTo: 'all'
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadJobs();
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const loadJobs = () => {
    const allJobs = getJobs();
    setJobs(allJobs);
  };

  const loadUsers = () => {
    const allUsers = getUsers().filter(user => user.role === 'user');
    setUsers(allUsers);
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(job => job.assignedTo === filters.assignedTo);
    }

    setFilteredJobs(filtered);
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
      loadJobs();
    }
  };

  const handleJobSave = () => {
    loadJobs();
  };

  const handleJobUpdate = () => {
    loadJobs();
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
            Jobs Management
          </h1>
          <button onClick={handleAddJob} className="btn btn-primary">
            <span style={{ marginRight: '8px' }}>➕</span>
            Add New Job
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card mb-24" style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Search Jobs</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                {JOB_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Statuses</option>
                {JOB_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Assigned To</label>
              <select
                className="form-input"
                value={filters.assignedTo}
                onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div>
          {filteredJobs.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>No Jobs Found</h3>
              <p style={{ color: '#999', marginBottom: '20px' }}>
                {jobs.length === 0 ? 'Create your first job to get started!' : 'No jobs match your current filters.'}
              </p>
              {jobs.length === 0 && (
                <button onClick={handleAddJob} className="btn btn-primary">
                  Create First Job
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
              {filteredJobs.map((job) => (
                <div key={job.id} style={{ position: 'relative' }}>
                  <JobCard 
                    job={job} 
                    onUpdate={handleJobUpdate}
                    onDelete={handleDeleteJob}
                  />
                  <button
                    onClick={() => handleEditJob(job)}
                    className="btn btn-secondary"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '12px',
                      padding: '6px 12px'
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          job={editingJob}
          onSave={handleJobSave}
        />
      </div>
    </Layout>
  );
};

export default AdminJobs;