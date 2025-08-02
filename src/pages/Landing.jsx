import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="app-background">
      <div className="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title">MaintenoX</h1>
          <p className="hero-subtitle">
            Streamline your building maintenance with our comprehensive checklist platform. 
            Manage tasks, track progress, and keep your facilities in perfect condition.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              <span style={{ marginRight: '8px' }}>🚀</span>
              Get Started
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              <span style={{ marginRight: '8px' }}>✨</span>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;