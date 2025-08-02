import React from 'react';
import { updateJob } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

const JobCard = ({ job, onUpdate, onDelete, showActions = true }) => {
  const user = getCurrentUser();
  const canEdit = user?.role === 'admin';
  const canUpdateStatus = user?.role === 'admin' || job.assignedTo === user?.id;

  const handleStatusChange = (newStatus) => {
    const updatedJob = updateJob(job.id, { status: newStatus });
    if (onUpdate) onUpdate(updatedJob);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Ongoing': return 'status-ongoing';
      case 'Completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div style={{ flex: 1 }}>
          <h3 className="task-title">{job.title}</h3>
          <div className="task-category">{job.category}</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Assigned to: <strong>{job.assignedToName || job.assignedTo}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Created: {formatDate(job.dateCreated)} | 
            Updated: {formatDate(job.lastUpdated)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <span className={`task-status ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      {job.description && (
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
          {job.description}
        </p>
      )}

      {showActions && canUpdateStatus && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {job.status !== 'Pending' && (
            <button
              onClick={() => handleStatusChange('Pending')}
              className="btn"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Mark Pending
            </button>
          )}
          {job.status !== 'Ongoing' && (
            <button
              onClick={() => handleStatusChange('Ongoing')}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Start Task
            </button>
          )}
          {job.status !== 'Completed' && (
            <button
              onClick={() => handleStatusChange('Completed')}
              className="btn btn-success"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Mark Complete
            </button>
          )}
          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              className="btn btn-danger"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;