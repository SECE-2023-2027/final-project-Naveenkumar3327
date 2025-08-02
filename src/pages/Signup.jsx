import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser, findUserByEmail } from '../utils/auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    avatar: '👤'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const avatarOptions = ['👤', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍💻', '👩‍💻', '🧑‍🔬'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      // Check if user already exists
      const existingUser = findUserByEmail(formData.email);
      if (existingUser) {
        setError('An account with this email already exists.');
        return;
      }

      // Create new user
      const newUser = addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: formData.avatar
      });

      if (newUser) {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please sign in.',
            email: formData.email 
          } 
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-background">
      <div className="signup-container">
        <div className="glass-card auth-card slide-up">
          <h1 className="auth-title">Create Account</h1>
          
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '8px',
              color: '#d32f2f',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="Create a password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Choose Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map((emoji) => (
                  <div
                    key={emoji}
                    className={`avatar-option ${formData.avatar === emoji ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, avatar: emoji})}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: formData.avatar === emoji ? '2px solid #667eea' : '2px solid transparent'
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mb-16"
              disabled={loading}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', color: '#666' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;