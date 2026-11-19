import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BookOpen,
  CalendarDays,
  Search,
  Building2,
  Mail,
  UserCheck,
  Image as ImageIcon,
  Library,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Sidebar({ currentView, navigateTo, showToast }) {
  const [apptSubmenuOpen, setApptSubmenuOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-badge" onClick={() => navigateTo('dashboard')}>
          <svg className="logo-icon-svg" viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: 'currentColor', marginBottom: 2 }}>
            <path d="M12 2C8 6 4 9 4 14a8 8 0 0 0 16 0c0-5-4-8-8-12zm0 18a6 6 0 0 1-6-6c0-3.5 3-6.2 6-9.5 3 3.3 6 6 6 9.5a6 6 0 0 1-6 6z"/>
            <path d="M12 18V9"/>
          </svg>
          <div className="logo-text-ansh">Ansh</div>
          <div className="logo-text-sub">Homoeopathy</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <LayoutDashboard className="nav-icon" size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${currentView === 'patients' ? 'active' : ''}`}
          onClick={() => navigateTo('patients')}
        >
          <Users className="nav-icon" size={18} />
          <span>Patient</span>
        </button>

        <div className="nav-item-dropdown">
          <button
            className={`nav-item ${['appointment-details', 'book-appointment'].includes(currentView) ? 'active' : ''}`}
            onClick={() => setApptSubmenuOpen(!apptSubmenuOpen)}
          >
            <Calendar className="nav-icon" size={18} />
            <span>Appointment</span>
            <span className="nav-submenu-toggle">
              {apptSubmenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {apptSubmenuOpen && (
            <div className="nav-sub-items">
              <div
                className={`nav-sub-item ${currentView === 'appointment-details' ? 'active' : ''}`}
                onClick={() => navigateTo('appointment-details')}
              >
                -- Appointment Details
              </div>
              <div
                className={`nav-sub-item ${currentView === 'book-appointment' ? 'active' : ''}`}
                onClick={() => navigateTo('book-appointment')}
              >
                -- Book Appointment
              </div>
              <div
                className="nav-sub-item"
                onClick={() => navigateTo('clinic-info')}
              >
                -- Settings
              </div>
            </div>
          )}
        </div>

        <button
          className={`nav-item ${currentView === 'prescription' ? 'active' : ''}`}
          onClick={() => navigateTo('prescription')}
        >
          <FileText className="nav-icon" size={18} />
          <span>Prescription</span>
        </button>

        <button
          className={`nav-item ${currentView === 'materia-medica' ? 'active' : ''}`}
          onClick={() => navigateTo('materia-medica')}
        >
          <BookOpen className="nav-icon" size={18} />
          <span>Materia Medica</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('Events calendar loaded', 'success')}
        >
          <CalendarDays className="nav-icon" size={18} />
          <span>Event</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('R & D Case Studies loaded', 'success')}
        >
          <Search className="nav-icon" size={18} />
          <span>R & D</span>
        </button>

        <button
          className={`nav-item ${currentView === 'clinic-info' ? 'active' : ''}`}
          onClick={() => navigateTo('clinic-info')}
        >
          <Building2 className="nav-icon" size={18} />
          <span>Clinic Information</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('Contact messages loaded', 'success')}
        >
          <Mail className="nav-icon" size={18} />
          <span>Contact Us</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('Patient newsletter list', 'success')}
        >
          <UserCheck className="nav-icon" size={18} />
          <span>Subscribers</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('Clinic Gallery & Seminars', 'success')}
        >
          <ImageIcon className="nav-icon" size={18} />
          <span>Gallery</span>
        </button>

        <button
          className="nav-item"
          onClick={() => showToast('Medical Library & Books', 'success')}
        >
          <Library className="nav-icon" size={18} />
          <span>Book Management</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="doctor-profile" onClick={() => navigateTo('clinic-info')}>
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
            alt="Dr. Divya Devani"
            className="doctor-avatar"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='%2300a8e8'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";
            }}
          />
          <span className="doctor-name">Dr. Divya Devani</span>
          <span className="doctor-chevron">▼</span>
        </div>
      </div>
    </aside>
  );
}

