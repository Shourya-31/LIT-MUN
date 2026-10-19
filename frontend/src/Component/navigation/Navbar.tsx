import React from 'react';
import './Navbar.css';

export interface NavbarProps {
  activeTab: 'landing' | 'registration' | 'signin' | 'signup';
  onSelectTab: (tab: 'landing' | 'registration' | 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div
          className="navbar-brand"
          onClick={() => onSelectTab('landing')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-text">
            <span className="brand-title">LIT-MUN</span>
            <span className="brand-subtitle">Model United Nations</span>
          </div>
        </div>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => onSelectTab('landing')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => onSelectTab('registration')}
          >
            Registration
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => onSelectTab('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`nav-cta ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => onSelectTab('signup')}
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
