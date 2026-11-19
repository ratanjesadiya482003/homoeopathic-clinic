import React, { useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';

export default function PatientDetails({
  patient,
  onUpdatePatient,
  onBack,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('tab-personal');

  // Follow-up input state
  const [fuNotes, setFuNotes] = useState('Patient reports overall improvement in sleep and temperament. Appetite restored. Mild itching occasionally.');
  const [fuWeight, setFuWeight] = useState('7.4 kg');
  const [fuBp, setFuBp] = useState('--');
  const [fuCharge, setFuCharge] = useState('500.00');
  const [fuTakenBy, setFuTakenBy] = useState('Dr. Divya Devani');
  const [fuRemedy, setFuRemedy] = useState('SUL');
  const [fuPotency, setFuPotency] = useState('0/1');
  const [fuDosage, setFuDosage] = useState('1 dose empty stomach');
  const [fuRepetition, setFuRepetition] = useState('Weekly once');
  const [fuDays, setFuDays] = useState('15 days');
  const [fuPrescriptionType, setFuPrescriptionType] = useState('Globules in milk sugar');

  // Case sheet local state
  const [caseSheet, setCaseSheet] = useState(patient?.caseSheet || {
    presentComplaints: '',
    pastHistory: '',
    familyHistory: '',
    treatmentHistory: '',
    birthHistory: '',
    gynHistory: '',
    appetite: '',
    desires: '',
    thermal: 'Hot',
    sleep: '',
    perspiration: '',
    mindSymptoms: '',
    rubrics: '',
    remedy: 'SULPHUR',
    potency: '0/1 (LM)',
    dosage: '1 globule stat',
    days: '15 days'
  });

  if (!patient) return null;

  const handleSaveCaseSheet = () => {
    const updated = {
      ...patient,
      caseSheet
    };
    onUpdatePatient(patient.fileId, updated);
    showToast('Comprehensive Case Taking sheet saved successfully!', 'success');
  };

  const handleAddFollowUp = () => {
    if (!fuNotes.trim() || !fuRemedy.trim() || !fuPotency.trim()) {
      showToast('Please provide Follow Up notes, Remedy and Potency.', 'danger');
      return;
    }

    const newFollowUp = {
      date: '19th Nov, 2026',
      text: fuNotes,
      weight: fuWeight || '--',
      bp: fuBp || '--',
      charge: fuCharge || '500.00',
      takenBy: fuTakenBy || 'Dr. Divya Devani',
      remedy: fuRemedy,
      potency: fuPotency,
      dosage: fuDosage,
      repetition: fuRepetition,
      days: fuDays,
      prescriptionType: fuPrescriptionType
    };

    const newRemedyEntry = {
      remedy: fuRemedy,
      potency: fuPotency,
      createdDate: '19th Nov, 2026 12:00 PM'
    };

    const updated = {
      ...patient,
      followUps: [newFollowUp, ...(patient.followUps || [])],
      remedyHistory: [newRemedyEntry, ...(patient.remedyHistory || [])]
    };

    onUpdatePatient(patient.fileId, updated);
    showToast('Follow up visit and remedy recorded!', 'success');
  };

  return (
    <div className="patient-details-view">
      {/* Patient Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
            {patient.firstName} {patient.lastName}{' '}
            <span style={{ fontWeight: 500, color: '#64748b', fontSize: 15 }}>
              (File ID: {patient.fileId})
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline-primary" onClick={onBack}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="tabs-nav">
        {[
          { id: 'tab-personal', label: 'Personal Details' },
          { id: 'tab-appointments', label: 'Appointment Details' },
          { id: 'tab-case-taking', label: 'Case Taking' },
          { id: 'tab-follow-up', label: 'Follow Up' },
          { id: 'tab-remedy-history', label: 'Remedy History' },
          { id: 'tab-print', label: 'Print' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PERSONAL DETAILS (Image 4) */}
      {activeTab === 'tab-personal' && (
        <div style={{ paddingTop: 20 }}>
          <div className="kv-grid">
            <div className="kv-card">
              <div className="kv-title">File ID :</div>
              <div className="kv-value">{patient.fileId}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Full Name :</div>
              <div className="kv-value">{patient.firstName} {patient.lastName}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Email :</div>
              <div className="kv-value">{patient.email || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Date of Birth :</div>
              <div className="kv-value">{patient.dob || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Age :</div>
              <div className="kv-value">{patient.age || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Sex :</div>
              <div className="kv-value">{patient.gender || 'Male'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Contact Number :</div>
              <div className="kv-value">{patient.mobile || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Marital Status :</div>
              <div className="kv-value">{patient.maritalStatus || 'Unmarried'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Reference :</div>
              <div className="kv-value">{patient.reference || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Education :</div>
              <div className="kv-value">{patient.education || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Address :</div>
              <div className="kv-value">{patient.address || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Occupation :</div>
              <div className="kv-value">{patient.occupation || '--'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Blood Group :</div>
              <div className="kv-value">{patient.bloodGroup || 'Not Known'}</div>
            </div>
            <div className="kv-card">
              <div className="kv-title">Profile Image :</div>
              <div className="kv-value">--</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENT DETAILS (Image 5) */}
      {activeTab === 'tab-appointments' && (
        <div style={{ paddingTop: 20 }}>
          <div className="card">
            <div className="card-body">
              {(patient.appointments && patient.appointments.length > 0) ? (
                patient.appointments.map((a, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      {a.date} &nbsp;•&nbsp; Appointment By: {a.mode} &nbsp;•&nbsp; Time: {a.time} &nbsp;•&nbsp; Charge: {a.charge}
                    </div>
                  </div>
                ))
              ) : (
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    19th Nov, 2026 &nbsp;•&nbsp; Appointment By: In Clinic &nbsp;•&nbsp; Time: 15:31 &nbsp;•&nbsp; Charge: 500.00
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CASE TAKING (Image 6) */}
      {activeTab === 'tab-case-taking' && (
        <div style={{ paddingTop: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Comprehensive Homoeopathy Case Taking Sheet</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveCaseSheet}>
                  Save
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 4, border: '1px solid #e2e8f0', marginBottom: 20, fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, color: '#0284c7', marginBottom: 4 }}>Patient Information:</div>
                <div><b>Name:</b> {patient.firstName} {patient.lastName} &nbsp;|&nbsp; <b>File ID:</b> {patient.fileId} &nbsp;|&nbsp; <b>Age/Sex:</b> {patient.age} / {patient.gender}</div>
                <div><b>Address:</b> {patient.address} &nbsp;|&nbsp; <b>Contact:</b> {patient.mobile} &nbsp;|&nbsp; <b>Date:</b> 19th Nov, 2026</div>
              </div>

              {/* Present Complaints */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#0284c7' }}>
                  1. Chief & Present Complaints (Location, Sensation, Modalities & Concomitants)
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe presenting symptoms, onset, triggers, what makes it better/worse..."
                  value={caseSheet.presentComplaints}
                  onChange={(e) => setCaseSheet({ ...caseSheet, presentComplaints: e.target.value })}
                />
              </div>

              {/* Past, Family, Treatment */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Past History</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Major past illnesses, hospitalizations, surgeries..."
                    value={caseSheet.pastHistory}
                    onChange={(e) => setCaseSheet({ ...caseSheet, pastHistory: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Family History</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Diabetes, Hypertension, Psychiatric illness, Asthma..."
                    value={caseSheet.familyHistory}
                    onChange={(e) => setCaseSheet({ ...caseSheet, familyHistory: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Treatment History</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Allopathic, Ayurvedic or previous medications..."
                    value={caseSheet.treatmentHistory}
                    onChange={(e) => setCaseSheet({ ...caseSheet, treatmentHistory: e.target.value })}
                  />
                </div>
              </div>

              {/* Physical Generals */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#0284c7' }}>
                  2. Physical Generals
                </label>
                <div className="form-grid-3">
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Appetite & Thirst</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.appetite}
                      onChange={(e) => setCaseSheet({ ...caseSheet, appetite: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Desires & Aversions</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.desires}
                      onChange={(e) => setCaseSheet({ ...caseSheet, desires: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Thermal Reaction</label>
                    <select
                      className="form-control"
                      value={caseSheet.thermal}
                      onChange={(e) => setCaseSheet({ ...caseSheet, thermal: e.target.value })}
                    >
                      <option value="Chilly">Chilly (Sensitive to cold)</option>
                      <option value="Hot">Hot (Cannot tolerate heat)</option>
                      <option value="Ambi-thermal">Ambi-thermal (Moderate)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mind & Mental Symptoms */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#0284c7' }}>
                  3. Mind & Neuro-Psychiatric Symptoms
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Anger, fears, anxieties, mood swings, sleep, emotional reactions..."
                  value={caseSheet.mindSymptoms}
                  onChange={(e) => setCaseSheet({ ...caseSheet, mindSymptoms: e.target.value })}
                />
              </div>

              {/* Remedy Prescribed */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 16, borderRadius: 4 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#16a34a' }}>
                  4. Initial Homeopathic Prescription
                </label>
                <div className="form-grid-3" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Remedy</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.remedy}
                      onChange={(e) => setCaseSheet({ ...caseSheet, remedy: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Potency</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.potency}
                      onChange={(e) => setCaseSheet({ ...caseSheet, potency: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.dosage}
                      onChange={(e) => setCaseSheet({ ...caseSheet, dosage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Days</label>
                    <input
                      type="text"
                      className="form-control"
                      value={caseSheet.days}
                      onChange={(e) => setCaseSheet({ ...caseSheet, days: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOLLOW UP (Image 7) */}
      {activeTab === 'tab-follow-up' && (
        <div style={{ paddingTop: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Follow Up Visit</h3>
              <button className="btn btn-primary" onClick={handleAddFollowUp}>
                Add
              </button>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div>
                  <label className="form-label">Follow Up<span className="required">*</span></label>
                  <div className="editor-toolbar">
                    <button type="button" className="editor-btn"><b>B</b></button>
                    <button type="button" className="editor-btn"><i>I</i></button>
                    <button type="button" className="editor-btn"><u>U</u></button>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Nunito</span>
                  </div>
                  <textarea
                    className="form-control editor-textarea"
                    rows={5}
                    value={fuNotes}
                    onChange={(e) => setFuNotes(e.target.value)}
                  />
                </div>

                <div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Weight</label>
                      <input
                        type="text"
                        className="form-control"
                        value={fuWeight}
                        onChange={(e) => setFuWeight(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={fuBp}
                        onChange={(e) => setFuBp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Appointment Charge</label>
                    <input
                      type="number"
                      className="form-control"
                      value={fuCharge}
                      onChange={(e) => setFuCharge(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">History Taken By<span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={fuTakenBy}
                      onChange={(e) => setFuTakenBy(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Row */}
              <div className="form-grid-3" style={{ marginTop: 18 }}>
                <div className="form-group">
                  <label className="form-label">Remedy<span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuRemedy}
                    onChange={(e) => setFuRemedy(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuDosage}
                    onChange={(e) => setFuDosage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Repetition</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuRepetition}
                    onChange={(e) => setFuRepetition(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Potency<span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuPotency}
                    onChange={(e) => setFuPotency(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Days</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuDays}
                    onChange={(e) => setFuDays(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prescription Type</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={fuPrescriptionType}
                    onChange={(e) => setFuPrescriptionType(e.target.value)}
                  />
                </div>
              </div>

              {/* Follow Up History */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
                  Follow Up History
                </h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: 16, background: '#fff' }}>
                  {(!patient.followUps || patient.followUps.length === 0) ? (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: 16 }}>
                      No Data Available.
                    </div>
                  ) : (
                    patient.followUps.map((fu, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 4,
                          padding: 14,
                          marginBottom: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontWeight: 700, color: '#0284c7' }}>
                            Visit #{patient.followUps.length - idx} &nbsp;•&nbsp; {fu.date}
                          </span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>
                            Dr: {fu.takenBy} | Fee: ₹{fu.charge}
                          </span>
                        </div>
                        <div style={{ fontSize: 13.5, color: '#334155', marginBottom: 10 }}>{fu.text}</div>
                        <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: '#475569', background: '#fff', padding: '8px 12px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                          <div><b>Weight:</b> {fu.weight}</div>
                          <div><b>BP:</b> {fu.bp}</div>
                          <div><b>Rx:</b> <span style={{ fontWeight: 700, color: '#16a34a' }}>{fu.remedy} ({fu.potency})</span></div>
                          <div><b>Dosage:</b> {fu.dosage} ({fu.days})</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REMEDY HISTORY (Image 8) */}
      {activeTab === 'tab-remedy-history' && (
        <div style={{ paddingTop: 20 }}>
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Remedy ⇅</th>
                      <th>Potency ⇅</th>
                      <th>Created Date ⇅</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!patient.remedyHistory || patient.remedyHistory.length === 0) ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                          No Data Available.
                        </td>
                      </tr>
                    ) : (
                      patient.remedyHistory.map((r, idx) => (
                        <tr key={idx}>
                          <td><b>{r.remedy}</b></td>
                          <td>{r.potency}</td>
                          <td>{r.createdDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: '#64748b' }}>
                Showing 1 to {patient.remedyHistory?.length || 0} of {patient.remedyHistory?.length || 0} entries
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PRINT PRESCRIPTION */}
      {activeTab === 'tab-print' && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={16} /> Print Prescription
            </button>
          </div>

          <div
            style={{
              background: 'white',
              border: '2px solid #cbd5e1',
              borderRadius: 4,
              padding: 36,
              maxWidth: 820,
              margin: '0 auto',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #00a8e8', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="logo-badge" style={{ width: 60, height: 60 }}>
                  <div className="logo-text-" style={{ fontSize: 9 }}></div>
                  <div className="logo-text-sub" style={{ fontSize: 6.5 }}>Homoeopathy</div>
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0284c7', margin: 0 }}> Homoeopathy Clinic</h2>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', margin: 0 }}>Advanced Neuro-psychiatric Homoeopathy</p>
                  <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>Head Branch: Surat, Gujarat | Mob: +91 99784 32492</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Dr. Divya Devani</h3>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>B.H.M.S., MD (Hom.)</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Reg. No: G-48291</p>
              </div>
            </div>

            {/* Patient Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, background: '#f8fafc', padding: '12px 16px', borderRadius: 4, marginBottom: 24, fontSize: 12.5 }}>
              <div><b>Patient:</b> {patient.firstName} {patient.lastName}</div>
              <div><b>File ID:</b> {patient.fileId}</div>
              <div><b>Age / Sex:</b> {patient.age} / {patient.gender}</div>
              <div><b>Date:</b> 19th Nov, 2026</div>
            </div>

            {/* Rx Section */}
            <div style={{ minHeight: 280 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>℞</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, marginBottom: 20 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '8px 4px' }}>Remedy</th>
                    <th style={{ padding: '8px 4px' }}>Potency</th>
                    <th style={{ padding: '8px 4px' }}>Dosage & Instructions</th>
                    <th style={{ padding: '8px 4px' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 4px', fontWeight: 700 }}>SULPHUR</td>
                    <td style={{ padding: '10px 4px' }}>0/1 (LM)</td>
                    <td style={{ padding: '10px 4px' }}>1 globule morning empty stomach with half cup water</td>
                    <td style={{ padding: '10px 4px' }}>15 Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 4px', fontWeight: 700 }}>P.L. (Placebo)</td>
                    <td style={{ padding: '10px 4px' }}>30</td>
                    <td style={{ padding: '10px 4px' }}>4 pills twice daily after meals</td>
                    <td style={{ padding: '10px 4px' }}>15 Days</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: '#fdf2f8', borderLeft: '3px solid #ec4899', padding: '10px 14px', fontSize: 12, color: '#831843', marginTop: 30 }}>
                <b>General Dietary Instructions:</b> Avoid raw onion, garlic, strong coffee, menthol/camphor or perfumes 30 minutes before and after taking homoeopathic medication.
              </div>
            </div>

            {/* Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, paddingTop: 20, borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                <div>Next Follow Up: <b>15 Days later</b></div>
                <div>Emergency Clinic Helpline: +91 99784 32492</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: 22, color: '#0369a1', height: 32 }}>
                  Divya Devani
                </div>
                <div style={{ borderTop: '1px solid #334155', paddingTop: 4, fontSize: 12, fontWeight: 700 }}>
                  Dr. Divya Devani
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Signature / Stamp</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

