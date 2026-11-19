import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export default function Navbar({
  title,
  navigateTo,
  syncStatus,
  onRefreshSync,
  isRefreshing
}) {
  const isLive = syncStatus?.isLiveSynced;
  const isReachable = syncStatus?.isServerReachable;

  return (
    <header className="top-navbar">
      <div className="top-left-title">
        {title}
      </div>
      <div className="top-right-actions">
        {/* Real-time Multi-User Live Sync Indicator */}
        <div
          className={`sync-indicator-pill ${isLive ? 'status-live' : isReachable ? 'status-connected' : 'status-offline'}`}
          title={
            isLive
              ? 'Real-Time Sync Active: All devices, users and tabs see identical live data.'
              : isReachable
              ? 'Connected to server: Click refresh to fetch latest changes.'
              : 'Working in Offline Mode: Changes are saved locally and will sync when server is reachable.'
          }
        >
          <span className={`sync-status-dot ${isLive ? 'pulse-green' : isReachable ? 'pulse-blue' : 'dot-amber'}`}></span>
          <span className="sync-status-label">
            {isLive ? 'All Users Synced' : isReachable ? 'Server Connected' : 'Offline Cache'}
          </span>
          <button
            type="button"
            className={`sync-action-btn ${isRefreshing ? 'is-spinning' : ''}`}
            onClick={onRefreshSync}
            title="Click to check & sync latest changes across all users"
          >
            <RefreshCw size={11} />
          </button>
        </div>

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
