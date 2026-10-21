import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Images,
  Users,
  LogOut,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Star,
  Shield,
} from 'lucide-react';
import NITRRMUNcrest from '../../assets/NITRRMUN-crest.png';
import Schedule from '../schedule/Schedule';
import Gallery from '../gallery/Gallery';
import './Dashboard.css';

export interface DelegateDashboardData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  academicLevel: string;
  designation?: string;
  preferredCommittees?: string[];
  committeeAllotted?: string | null;
  portfolioAllotted?: string | null;
}

interface DashboardProps {
  data?: Partial<DelegateDashboardData>;
  onLogout?: () => void;
  onNavigateHome?: () => void;
}

const defaultDelegate: DelegateDashboardData = {
  fullName: 'Atulya Jaiswal',
  email: 'atulya@example.com',
  phone: '+91 98765 43210',
  institution: 'NIT Raipur',
  academicLevel: 'Undergraduate',
  designation: 'Delegate',
  preferredCommittees: ['UNSC', 'UNHRC', 'AIPPM'],
  committeeAllotted: null,
  portfolioAllotted: null,
};

type DashboardTab = 'home' | 'schedule' | 'gallery' | 'secretariat';

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  onLogout,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const delegate: DelegateDashboardData = { ...defaultDelegate, ...data };

  const firstName = delegate.fullName.split(' ')[0] || 'Delegate';

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand" onClick={onNavigateHome} role="button" tabIndex={0}>
          <img
            src={NITRRMUNcrest}
            alt="NITRRMUN Crest"
            className="sidebar-brand-crest"
          />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">NITRRMUN</span>
            <span className="sidebar-brand-sub">NIT RAIPUR MODEL UNITED NATIONS</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={19} className="sidebar-icon" />
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={19} className="sidebar-icon" />
            <span>Schedule</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Images size={19} className="sidebar-icon" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'secretariat' ? 'active' : ''}`}
            onClick={() => setActiveTab('secretariat')}
          >
            <Users size={19} className="sidebar-icon" />
            <span>Secretariat</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-nav-item logout-button"
            onClick={onLogout || onNavigateHome}
          >
            <LogOut size={19} className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>

        <div className="sidebar-watermark" aria-hidden="true">
          <img src={NITRRMUNcrest} alt="" />
        </div>
      </aside>

      <div className="dashboard-main-viewport">
        <header className="dashboard-topbar">
          <div className="topbar-welcome">
            <h1 className="welcome-heading">Welcome, {firstName}!</h1>
            <p className="welcome-sub">NITRRMUN 2026</p>
          </div>
        </header>

        <main className="dashboard-content">
          {activeTab === 'home' && (
            <div className="tab-home-content">
              <div className="dashboard-section-header">
                <h2 className="section-title">Registration Details</h2>
                <p className="section-subtitle">
                  Here are the details you submitted during registration.
                </p>
              </div>

              <div className="registration-details-card">
                <div className="details-grid">
                  <div className="details-col">
                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-blue">
                        <User size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Full Name</span>
                        <span className="detail-value">{delegate.fullName}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-green">
                        <Mail size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-value">{delegate.email}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-purple">
                        <Phone size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Phone Number</span>
                        <span className="detail-value">{delegate.phone}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-orange">
                        <GraduationCap size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">College / University</span>
                        <span className="detail-value">{delegate.institution}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-col">
                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-gold">
                        <FileText size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Designation</span>
                        <span className="detail-value">{delegate.designation || 'Delegate'}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-rose">
                        <Star size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{delegate.academicLevel}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-teal">
                        <Shield size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Preferred Committee(s)</span>
                        <span className="detail-value">
                          {delegate.preferredCommittees && delegate.preferredCommittees.length > 0
                            ? delegate.preferredCommittees.join(', ')
                            : 'UNSC, UNHRC, AIPPM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="status-cards-row">
                <div className="status-card">
                  <div className="status-card-header">
                    <div className="status-header-icon icon-blue">
                      <Users size={16} />
                    </div>
                    <span className="status-header-title">Committee Allotted</span>
                  </div>

                  <div className="status-card-divider" />

                  <div className="status-card-body">
                    {delegate.committeeAllotted ? (
                      <div className="allotted-success">
                        <span className="allotted-badge">{delegate.committeeAllotted}</span>
                      </div>
                    ) : (
                      <>
                        <div className="status-center-icon">
                          <Users size={32} />
                        </div>
                        <h4 className="status-value-empty">Not yet allotted</h4>
                        <p className="status-hint">
                          Your committee will be assigned soon, a week before the event.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="status-card">
                  <div className="status-card-header">
                    <div className="status-header-icon icon-purple">
                      <FileText size={16} />
                    </div>
                    <span className="status-header-title">Portfolio Allotted</span>
                  </div>

                  <div className="status-card-divider" />

                  <div className="status-card-body">
                    {delegate.portfolioAllotted ? (
                      <div className="allotted-success">
                        <span className="allotted-badge">{delegate.portfolioAllotted}</span>
                      </div>
                    ) : (
                      <>
                        <div className="status-center-icon">
                          <FileText size={32} />
                        </div>
                        <h4 className="status-value-empty">Not yet allotted</h4>
                        <p className="status-hint">
                          Your portfolio will be assigned soon, a week before the event.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="tab-embed-container">
              <Schedule />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="tab-embed-container">
              <Gallery />
            </div>
          )}

          {activeTab === 'secretariat' && (
            <div className="tab-secretariat-coming-soon">
              <div className="coming-soon-card">
                <h3 className="coming-soon-title">Secretariat & Executive Board</h3>
                <p className="coming-soon-desc">
                  The official letters, biographies, and portfolios of the Director General, Secretary General, and Executive Board for NITRRMUN 2026 will be released shortly.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
