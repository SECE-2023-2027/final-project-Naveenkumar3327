// Authentication utilities
export const AUTH_KEY = 'maintenox_auth';
export const USERS_KEY = 'maintenox_users';

export const saveAuthData = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const getAuthData = () => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  return getAuthData() !== null;
};

export const getCurrentUser = () => {
  const authData = getAuthData();
  return authData?.user || null;
};

export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

// User management
export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...user,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);
    return users[userIndex];
  }
  return null;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  saveUsers(filteredUsers);
};