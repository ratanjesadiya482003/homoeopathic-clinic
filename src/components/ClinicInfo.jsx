import React from 'react';
import { RefreshCw, Download, RotateCcw, Users, CheckCircle2, Database, Wifi } from 'lucide-react';

export default function ClinicInfo({
  patients = [],
  appointments = [],
  expenses = [],
  syncStatus,
  onRefreshSync,
  onResetDatabase,
  showToast
}) {
  const isLive = syncStatus?.isLiveSynced;
  const isReachable = syncStatus?.isServerReachable;

  const handleExportBackup = () => {
    try {
      const backup = {
        clinic: 'Homoeopathy - Clinic Management System',
        exportedAt: new Date().toISOString(),
        version: syncStatus?.version || 1,
        patients,
        appointments,
        expenses
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homoeopathy_clinic_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast('Clinic database exported successfully!', 'success');
    } catch (e) {
      if (showToast) showToast('Failed to export backup: ' + e.message, 'danger');
    }
  };

  return (
    <div>
      <div className="form-grid-2" style={{ marginBottom: 24 }}>
        {/* Doctor Profile */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dr. Divya Devani - Profile</h3>
          </div>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&auto=format&fit=crop&q=80"
              alt="Dr. Divya Devani"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #00a8e8',
                marginBottom: 12
              }}
              onError={(e) => {
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2300a8e8'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";
              }}
            />
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Dr. Divya Devani</h4>
            <p style={{ color: '#0284c7', fontWeight: 600 }}>Chief Consultant - Homoeopathy</p>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              B.H.M.S., MD (Homeopathy), Fellowship in Advanced Neuro-Psychiatric Homoeopathy. 12+ years of clinical excellence in treating pediatric behavioral and psychiatric disorders.
            </p>
          </div>
        </div>

        {/* Clinic Branches */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Clinic Branches & Locations</h3>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <h5 style={{ fontWeight: 700, color: '#0284c7' }}>1. Head Branch (Surat)</h5>
              <p style={{ fontSize: 13, color: '#475569' }}>B-3, Krishna Kunj, Chikuwadi Raw House, Udhna, Surat, Gujarat</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Phone: +91 99784 32492 | Open: Mon - Sat (10am - 1pm, 4pm - 8pm)</p>
            </div>
            <div style={{ marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <h5 style={{ fontWeight: 700, color: '#0284c7' }}>2. Pal Branch</h5>
              <p style={{ fontSize: 13, color: '#475569' }}>Galaxy Business Hub, Pal Gam, Surat</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Phone: +91 88666 82419 | Open: Tue & Thu (5pm - 9pm)</p>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, color: '#0284c7' }}>3.  Camp (Charitable Clinic)</h5>
              <p style={{ fontSize: 13, color: '#475569' }}>Community Center, Udhna Gam</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Sunday Camp (9am - 1pm)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Multi-User Live Sync & Data Management Card */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#0284c7" /> Multi-User Live Sync & Central Database
          </h3>
          <span className={`sync-indicator-pill ${isLive ? 'status-live' : isReachable ? 'status-connected' : 'status-offline'}`}>
            <span className={`sync-status-dot ${isLive ? 'pulse-green' : isReachable ? 'pulse-blue' : 'dot-amber'}`}></span>
            {isLive ? 'All Users Synced' : isReachable ? 'Server Online' : 'Offline Mode'}
          </span>
        </div>
        <div className="card-body">
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle2 size={24} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  Same Data Guaranteed for All Users & Devices
                </h4>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Whenever any user <b>adds</b>, <b>edits</b>, or <b>deletes</b> a patient, appointment, follow-up, or expense, changes are instantly saved to the central clinic database (<code>data/clinic_db.json</code>) and broadcast in real time via Server-Sent Events (SSE). Every doctor, receptionist, and staff member sees the exact same data without manual refresh.
                </p>
              </div>
            </div>
          </div>

          {/* Sync Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>SYNCED PATIENTS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{patients.length}</div>
              <div style={{ fontSize: 11, color: '#16a34a' }}>Identical across all users</div>
            </div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: 14, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#075985', fontWeight: 600 }}>SCHEDULED APPOINTMENTS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', marginTop: 4 }}>{appointments.length}</div>
              <div style={{ fontSize: 11, color: '#0284c7' }}>Real-time status updates</div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: 14, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#854d0e', fontWeight: 600 }}>RECORDED EXPENSES</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ca8a04', marginTop: 4 }}>{expenses.length}</div>
              <div style={{ fontSize: 11, color: '#ca8a04' }}>Synchronized clinic ledger</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 14, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>DATABASE VERSION</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#334155', marginTop: 4 }}>v{syncStatus?.version || 1}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {syncStatus?.lastSyncedTime ? `Last updated ${new Date(syncStatus.lastSyncedTime).toLocaleTimeString()}` : 'Live'}
              </div>
            </div>
          </div>

          {/* Sync Operations Controls */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onRefreshSync}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} /> Refresh & Force Sync Now
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleExportBackup}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Backup (.json)
            </button>
            {onResetDatabase && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={onResetDatabase}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}
              >
                <RotateCcw size={14} /> Reset to Demo Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
