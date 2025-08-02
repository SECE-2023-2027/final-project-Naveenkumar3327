// 🔐 Storage Keys
export const JOBS_KEY = 'maintenox_jobs';
export const NOTIFICATIONS_KEY = 'maintenox_notifications';
export const USERS_KEY = 'users'; // Added this for users

// 🔧 Job Management
export const saveJobs = (jobs) => {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
};

export const getJobs = () => {
  const jobs = localStorage.getItem(JOBS_KEY);
  return jobs ? JSON.parse(jobs) : [];
};

export const addJob = (job) => {
  const jobs = getJobs();
  const newJob = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...job,
    dateCreated: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  jobs.push(newJob);
  saveJobs(jobs);
  return newJob;
};

export const updateJob = (jobId, updates) => {
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    saveJobs(jobs);
    return jobs[jobIndex];
  }
  return null;
};

export const deleteJob = (jobId) => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== jobId);
  saveJobs(filteredJobs);
};

export const getJobsByUser = (userId) => {
  const jobs = getJobs();
  return jobs.filter(job => job.assignedTo === userId);
};

export const getJobsByStatus = (status) => {
  const jobs = getJobs();
  return jobs.filter(job => job.status === status);
};

export const getJobsByCategory = (category) => {
  const jobs = getJobs();
  return jobs.filter(job => job.category === category);
};

// 🔔 Notification Management
export const saveNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

export const getNotifications = () => {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...notification,
    timestamp: new Date().toISOString(),
    read: false
  };
  notifications.unshift(newNotification); // Newest first
  saveNotifications(notifications);
  return newNotification;
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
};

export const deleteNotification = (notificationId) => {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  saveNotifications(filtered);
};

// 👤 User Management (newly added)
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...user,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// 📂 Static Categories & Statuses
export const JOB_CATEGORIES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Security',
  'Landscaping',
  'General Maintenance'
];

export const JOB_STATUSES = [
  'Pending',
  'Ongoing',
  'Completed'
];
