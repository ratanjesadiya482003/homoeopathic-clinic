import React, { useState } from 'react';

export default function Dashboard({
  appointments,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateApptStatus,
  onViewPatientDetails,
  navigateTo,
  showToast
}) {
  const [expenseBranch, setExpenseBranch] = useState('Head Branch');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);

  const todaysAppointments = appointments.filter(a => a.date === '2026-11-19');

  const handleSaveExpense = () => {
    if (!expenseTitle.trim() || Number(expenseAmount) <= 0) {
      showToast('Please enter an expense title and valid amount.', 'danger');
      return;
    }

    onAddExpense({
      branch: expenseBranch,
      title: expenseTitle.trim(),
      amount: Number(expenseAmount),
      date: '19th Nov, 2026'
    });

    setExpenseTitle('');
    setExpenseAmount(0);
    showToast('Clinic expense saved successfully!', 'success');
  };

  return (
    <div className="dashboard-view">
      {/* Today's Appointments Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Today's Appointment</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigateTo('appointment-details')}
          >
            View All
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>File ID</th>
                <th>Time</th>
                <th>Branch</th>
                <th>Appointment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td><b>{appt.patientName}</b></td>
                  <td>{appt.fileId}</td>
                  <td>{appt.time}</td>
                  <td>{appt.branch}</td>
                  <td>
                    {appt.status === 'Closed' ? (
                      <span className="status-badge status-closed">Closed</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn btn-outline-success btn-xs"
                          onClick={() => {
                            onUpdateApptStatus(appt.id, 'In');
                            showToast(`Status updated to 'In' for ${appt.patientName}`, 'success');
                          }}
                        >
                          In
                        </button>
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => {
                            onUpdateApptStatus(appt.id, 'Closed');
                            showToast(`Consultation closed for ${appt.patientName}`, 'success');
                          }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-xs"
                      onClick={() => onViewPatientDetails(appt.fileId)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinic Extra Expenses Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Clinic Extra Expenses</h3>
          <button className="btn btn-primary btn-sm" onClick={handleSaveExpense}>
            Save
          </button>
        </div>
        <div className="card-body">
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Expense For Branch<span className="required">*</span></label>
              <select
                className="form-control"
                value={expenseBranch}
                onChange={(e) => setExpenseBranch(e.target.value)}
              >
                <option value="Head Branch">Head Branch</option>
                <option value="Pal Branch">Pal Branch</option>
                <option value=" Camp"> Camp</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expense Title<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Clinic Supplies / Sanitizer"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expense Amount<span className="required">*</span></label>
              <input
                type="number"
                className="form-control"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Recent expenses list */}
          <div style={{ marginTop: 10, fontSize: 13, color: '#475569' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Recent Recorded Expenses:</div>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
              {expenses.length === 0 ? (
                <li style={{ color: '#94a3b8', fontStyle: 'italic' }}>No expenses recorded yet.</li>
              ) : (
                expenses.slice(0, 6).map((exp, i) => (
                  <li key={exp.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <div>
                      <b>{exp.branch}:</b> {exp.title} — <span style={{ color: '#0f766e', fontWeight: 600 }}>₹{exp.amount}</span>{' '}
                      <span style={{ color: '#94a3b8', fontSize: 11 }}>({exp.date})</span>
                    </div>
                    {onDeleteExpense && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-xs"
                        style={{ padding: '2px 8px', fontSize: 11 }}
                        onClick={() => {
                          if (window.confirm(`Delete expense "${exp.title}" (₹${exp.amount})? This will update for all users.`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        title="Delete expense"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Duty Information Banner */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Duty Information</h3>
        </div>
        <div className="card-body duty-banner">
          <div className="duty-graphic-wrap">
            <svg viewBox="0 0 300 300" width="220" height="220">
              <defs>
                <path id="textArcTop" d="M 40,150 A 110,110 0 1,1 260,150" fill="none" />
                <path id="textArcBottom" d="M 260,150 A 110,110 0 0,1 40,150" fill="none" />
              </defs>
              <text fontFamily="Nunito, sans-serif" fontSize="16" fontWeight="800" fill="#dc2626" letterSpacing="2">
                <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
                  Advanced Neuro - psychiatric
                </textPath>
              </text>
              <text fontFamily="Nunito, sans-serif" fontSize="16" fontWeight="800" fill="#000000" letterSpacing="2">
                <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
                  Homoeopathy
                </textPath>
              </text>
              <g transform="translate(60, 65) scale(0.75)">
                <path fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  d="M120,40 C90,40 60,60 50,90 C40,120 40,150 50,180 C60,200 80,210 110,210 C110,170 115,130 120,40 Z" />
                <path fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  d="M120,40 C150,40 180,60 190,90 C200,120 200,150 190,180 C180,200 160,210 130,210 C130,170 125,130 120,40 Z" />
                <path fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round"
                  d="M70,90 C85,95 90,80 105,95 M65,130 C80,120 95,140 110,130 M70,165 C85,160 95,180 110,170" />
                <path fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round"
                  d="M170,90 C155,95 150,80 135,95 M175,130 C160,120 145,140 130,130 M170,165 C155,160 145,180 130,170" />
              </g>
            </svg>
          </div>
          <p style={{ marginTop: 10, fontWeight: 600, color: '#475569' }}>
            Specialized in Chronic Psychiatric, Neurological, Pediatric & Psychosomatic Disorders.
          </p>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Head Branch Timings: Mon - Sat: 10:00 AM - 1:00 PM | 4:00 PM - 8:00 PM
          </p>
        </div>
      </div>

      {/* Holidays & Coming Events Row */}
      <div className="form-grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Holidays</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Morning Time</th>
                  <th>Afternoon Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                    No Data Available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Coming Events</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                    No Data Available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

