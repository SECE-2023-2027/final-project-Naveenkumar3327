import React, { useState, useEffect } from 'react';
import { addJob, updateJob, JOB_CATEGORIES } from '../utils/storage';
import { getUsers } from '../utils/auth';

const JobFormModal = ({ isOpen, onClose, job, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General Maintenance',
    assignedTo: '',
    status: 'Pending'
  });
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getUsers().filter(user => user.role === 'user'));
  }, []);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        category: job.category || 'General Maintenance',
        assignedTo: job.assignedTo || '',
        status: job.status || 'Pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'General Maintenance',
        assignedTo: '',
        status: 'Pending'
      });
    }
  }, [job]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const assignedUser = users.find(user => user.id === formData.assignedTo);
    const jobData = {
      ...formData,
      assignedToName: assignedUser?.name || formData.assignedTo,
      assignedBy: JSON.parse(localStorage.getItem('maintenox_auth'))?.user?.name || 'Admin'
    };

    let savedJob;
    if (job) {
      savedJob = updateJob(job.id, jobData);
    } else {
      savedJob = addJob(jobData);
    }

    if (onSave) onSave(savedJob);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {job ? 'Edit Job' : 'Add New Job'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Enter job title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="Enter job description"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              {JOB_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign to User *</label>
            <select
              className="form-input"
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {job ? 'Update Job' : 'Create Job'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;