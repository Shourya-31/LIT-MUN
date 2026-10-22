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
import type { DashboardResponse } from '../../lib/api';

interface DashboardProps {
  data: DashboardResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigateToRegistration?: () => void;
}

type DashboardTab = 'home' | 'schedule' | 'gallery' | 'secretariat';

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  isLoading,
  errorMessage,
  onLogout,
  onNavigateHome,
  onNavigateToRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const delegate = data;

  const firstName = delegate?.fullName.split(' ')[0] || 'Delegate';
  const application = delegate?.application;

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
              {isLoading && <p role="status">Loading your saved delegate information…</p>}
              {errorMessage && <p className="signin-alert" role="alert">{errorMessage}</p>}
              {!isLoading && !errorMessage && !delegate && (
                <div className="coming-soon-card">
                  <h2 className="section-title">Dashboard unavailable</h2>
                  <p className="section-subtitle">Sign in again to load your saved information.</p>
                </div>
              )}
              {!isLoading && !errorMessage && delegate && !application && (
                <div className="coming-soon-card">
                  <h2 className="section-title">No application submitted</h2>
                  <p className="section-subtitle">
                    Your account is ready. Complete the delegate registration form to see your application status here.
                  </p>
                  {onNavigateToRegistration && (
                    <button type="button" className="nav-cta" onClick={onNavigateToRegistration}>
                      Start Registration
                    </button>
                  )}
                </div>
              )}
              {!isLoading && !errorMessage && delegate && application && (
                <>
              <div className="dashboard-section-header">
                <h2 className="section-title">Registration Details</h2>
                <p className="section-subtitle">
                  Details saved with application {application.reference}.
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
                        <span className="detail-value">{delegate.role === 'DELEGATE' ? 'Delegate' : delegate.role}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-rose">
                        <Star size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{application.academicLevel}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon-wrap icon-teal">
                        <Shield size={18} />
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Preferred Committee(s)</span>
                        <span className="detail-value">
                          {application.preferences.map(({ committee }) => committee.code).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="registration-details-card">
                <div className="detail-item">
                  <div className="detail-icon-wrap icon-gold">
                    <FileText size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Application status</span>
                    <span className="detail-value">{application.status.replaceAll('_', ' ')}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon-wrap icon-blue">
                    <Calendar size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Submitted</span>
                    <span className="detail-value">{new Date(application.submittedAt).toLocaleDateString()}</span>
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
                    {application.allocation?.status === 'ALLOCATED' ? (
                      <div className="allotted-success">
                        <span className="allotted-badge">{application.allocation.committee.code}</span>
                      </div>
                    ) : (
                      <>
                        <div className="status-center-icon">
                          <Users size={32} />
                        </div>
                        <h4 className="status-value-empty">Not yet allotted</h4>
                        <p className="status-hint">
                          Your committee allocation is pending review.
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
                    {application.allocation?.status === 'ALLOCATED' ? (
                      <div className="allotted-success">
                        <span className="allotted-badge">{application.allocation.portfolio.name}</span>
                      </div>
                    ) : (
                      <>
                        <div className="status-center-icon">
                          <FileText size={32} />
                        </div>
                        <h4 className="status-value-empty">Not yet allotted</h4>
                        <p className="status-hint">
                          Your portfolio allocation is pending review.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
                </>
              )}
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
