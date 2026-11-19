import React from 'react';
import { Plus } from 'lucide-react';

export default function Navbar({ title, navigateTo }) {
  return (
    <header className="top-navbar">
      <div className="top-left-title">
        {title}
      </div>
      <div className="top-right-actions">
        <span className="quick-badge">📍 Head Branch (Surat)</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigateTo('book-appointment')}
        >
          <Plus size={14} /> Book Appointment
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigateTo('add-patient')}
        >
          <Plus size={14} /> Add Patient
        </button>
      </div>
    </header>
  );
}

