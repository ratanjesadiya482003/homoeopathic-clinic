import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AppointmentSchedule({
  appointments,
  onUpdateStatus,
  navigateTo,
  showToast
}) {
  const [selectedBranch, setSelectedBranch] = useState('Head Branch');
  const [selectedDate, setSelectedDate] = useState('2026-11-19');

  const filtered = appointments.filter(
    (a) => a.branch === selectedBranch && a.date === selectedDate
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Appointment Details</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigateTo('book-appointment')}
        >
          <Plus size={14} /> Book New
        </button>
      </div>

      <div className="card-body">
        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <label className="form-label">Branch</label>
            <div className="radio-group">
              {['Head Branch', 'Pal Branch', ' Camp'].map((branch) => (
                <label key={branch} className="radio-label">
                  <input
                    type="radio"
                    name="schedule-branch"
                    value={branch}
                    checked={selectedBranch === branch}
                    onChange={() => setSelectedBranch(branch)}
                  />{' '}
                  {branch}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div>
              <label className="form-label">Date<span className="required">*</span></label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => showToast(`Appointments loaded for ${selectedDate}`, 'success')}>
              View Appointment
            </button>
          </div>
        </div>

        {/* Slot Cards Grid */}
        <div className="slots-grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: 40 }}>
              No appointments booked for this branch and date.
            </div>
          ) : (
            filtered.map((a) => (
              <div className="slot-card" key={a.id}>
                <div className="slot-card-header">
                  <span className="slot-time">{a.time}</span>
                  <span className={`status-badge ${a.status === 'Closed' ? 'status-closed' : 'status-confirmed'}`}>
                    {a.status === 'Closed' ? 'Closed' : 'Confirmed'}
                  </span>
                </div>

                <div className="slot-info-row">
                  <span className="slot-info-label">Name :</span> {a.patientName}
                </div>
                <div className="slot-info-row">
                  <span className="slot-info-label">Appointment By :</span> {a.type}
                </div>
                <div className="slot-info-row">
                  <span className="slot-info-label">Charge :</span> {a.charge}
                </div>

                {a.status !== 'Closed' && (
                  <div className="slot-actions">
                    <button
                      className="btn btn-outline-primary btn-xs"
                      onClick={() => {
                        onUpdateStatus(a.id, 'Cancelled');
                        showToast(`Appointment cancelled for ${a.patientName}`, 'danger');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-outline-success btn-xs"
                      onClick={() => {
                        onUpdateStatus(a.id, 'In');
                        showToast(`${a.patientName} is now IN clinic`, 'success');
                      }}
                    >
                      In
                    </button>
                    <button
                      className="btn btn-outline-danger btn-xs"
                      onClick={() => {
                        onUpdateStatus(a.id, 'Closed');
                        showToast(`Consultation marked closed for ${a.patientName}`, 'success');
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

