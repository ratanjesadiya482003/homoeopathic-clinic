import React, { useState } from 'react';
import { User, Package, CreditCard, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

const AVAILABLE_SLOTS = [
  "10:00 To 10:10", "10:10 To 10:20", "10:20 To 10:30", "10:30 To 10:40",
  "10:40 To 10:50", "10:50 To 11:00", "11:00 To 11:10", "11:10 To 11:20",
  "11:20 To 11:30", "11:30 To 11:40", "15:21 To 15:31", "15:31 To 15:41",
  "17:01 To 17:11", "17:11 To 17:21", "17:31 To 17:41", "17:41 To 17:51"
];

export default function BookAppointmentWizard({
  patients,
  appointments,
  prefilledFileId = null,
  onBookConfirmed,
  onAddNewPatient,
  navigateTo,
  showToast
}) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(prefilledFileId ? 'old' : 'old');
  const [searchFileId, setSearchFileId] = useState(prefilledFileId || '');
  const [verifiedPatient, setVerifiedPatient] = useState(
    prefilledFileId ? patients.find(p => p.fileId === prefilledFileId) : null
  );

  // New patient fields
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dob: '2026-11-19',
    gender: 'Male',
    bloodGroup: 'Not Known',
    address: '',
    note: ''
  });

  // Slot selection
  const [selectedBranch, setSelectedBranch] = useState('Head Branch');
  const [selectedDate, setSelectedDate] = useState('2026-11-19');
  const [selectedSlot, setSelectedSlot] = useState('17:31 To 17:41');

  // Payment
  const [consultationMode, setConsultationMode] = useState('In Clinic');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Clinic');

  const handleCheckFileNumber = () => {
    if (!searchFileId.trim()) {
      showToast('Please enter a file number to check.', 'danger');
      return;
    }

    const found = patients.find(
      (p) => p.fileId.toLowerCase() === searchFileId.trim().toLowerCase()
    );

    if (found) {
      setVerifiedPatient(found);
      showToast(`Verified: ${found.firstName} ${found.lastName}`, 'success');
    } else {
      setVerifiedPatient(null);
      showToast(`File ID '${searchFileId}' not found. Try New Patient.`, 'danger');
    }
  };

  const handleProceedToStep2 = () => {
    if (role === 'old') {
      if (!verifiedPatient) {
        showToast('Please verify an existing patient file number first.', 'danger');
        return;
      }
    } else {
      if (!newPatient.firstName.trim() || !newPatient.mobile.trim() || !newPatient.address.trim()) {
        showToast('Please fill all required (*) new patient fields.', 'danger');
        return;
      }
    }
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedSlot) {
      showToast('Please choose an available appointment slot.', 'danger');
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = () => {
    let patientRecord = verifiedPatient;

    if (role === 'new') {
      const generatedFileId = '0' + (Math.floor(Math.random() * 9000) + 1000);
      patientRecord = {
        ...newPatient,
        id: generatedFileId,
        fileId: generatedFileId,
        branch: selectedBranch,
        createdDate: '19th Nov, 2026',
        age: '25 years',
        appointments: [],
        followUps: [],
        remedyHistory: []
      };
      onAddNewPatient(patientRecord);
    }

    const chargeVal = consultationMode === 'Online Video' ? '700.00' : '500.00';

    const newAppointment = {
      id: 'apt-' + Date.now(),
      patientName: `${patientRecord.firstName} ${patientRecord.lastName}`,
      fileId: patientRecord.fileId,
      time: selectedSlot,
      branch: selectedBranch,
      date: selectedDate,
      type: consultationMode,
      charge: chargeVal,
      status: 'Confirmed'
    };

    onBookConfirmed(newAppointment);
    showToast(`Appointment booked successfully for ${patientRecord.firstName}!`, 'success');
    navigateTo('appointment-details');
  };

  const charge = consultationMode === 'Online Video' ? 700 : 500;

  const bookedSlotsForDate = appointments
    .filter(a => a.branch === selectedBranch && a.date === selectedDate && a.status !== 'Cancelled')
    .map(a => a.time);

  return (
    <div className="card">
      <div className="card-body">
        {/* Stepper Header */}
        <div className="stepper-container">
          <div className={`step-card ${step === 1 ? 'active' : ''}`}>
            <div className="step-card-icon"><User size={24} style={{ margin: '0 auto' }} /></div>
            <div className="step-card-label">User Account</div>
            <div className="step-badge">1</div>
          </div>
          <div className={`step-card ${step === 2 ? 'active' : ''}`}>
            <div className="step-card-icon"><Package size={24} style={{ margin: '0 auto' }} /></div>
            <div className="step-card-label">Select Appointment Slot</div>
            <div className="step-badge">2</div>
          </div>
          <div className={`step-card ${step === 3 ? 'active' : ''}`}>
            <div className="step-card-icon"><CreditCard size={24} style={{ margin: '0 auto' }} /></div>
            <div className="step-card-label">Payment</div>
            <div className="step-badge">3</div>
          </div>
        </div>

        {/* STEP 1: USER ACCOUNT */}
        {step === 1 && (
          <div>
            {/* Role Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: '#334155' }}>Role</span>
              <div style={{ display: 'inline-flex', border: '1px solid var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
                <button
                  type="button"
                  className={`btn ${role === 'old' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: 0, border: 'none' }}
                  onClick={() => setRole('old')}
                >
                  Old Patient
                </button>
                <button
                  type="button"
                  className={`btn ${role === 'new' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: 0, border: 'none' }}
                  onClick={() => setRole('new')}
                >
                  New Patient
                </button>
              </div>
            </div>

            {/* Old Patient Form (Image 9) */}
            {role === 'old' && (
              <div style={{ maxWidth: 650, margin: '0 auto', padding: '20px 0' }}>
                <div className="form-group" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label className="form-label" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>
                    Enter File Number<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 0842 or 06986"
                    value={searchFileId}
                    onChange={(e) => setSearchFileId(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={handleCheckFileNumber}
                  >
                    Check file number
                  </button>
                </div>

                {verifiedPatient && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '14px 18px', marginTop: 16 }}>
                    <div style={{ fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <CheckCircle2 size={16} /> Patient Verified:
                    </div>
                    <div style={{ fontSize: 13.5, color: '#1e293b' }}>
                      <b>{verifiedPatient.firstName} {verifiedPatient.lastName}</b> &nbsp;|&nbsp; File ID: {verifiedPatient.fileId} &nbsp;|&nbsp; Mob: {verifiedPatient.mobile} &nbsp;|&nbsp; Branch: {verifiedPatient.branch}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Patient Form (Image 10) */}
            {role === 'new' && (
              <div style={{ marginTop: 10 }}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email<span className="required">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="patient@example.com"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full name<span className="required">*</span></label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        value={newPatient.firstName}
                        onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        value={newPatient.lastName}
                        onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Mobile Number<span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="10-digit mobile number"
                      value={newPatient.mobile}
                      onChange={(e) => setNewPatient({ ...newPatient, mobile: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Birth Date<span className="required">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={newPatient.dob}
                      onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="bk-gender"
                          value="Female"
                          checked={newPatient.gender === 'Female'}
                          onChange={() => setNewPatient({ ...newPatient, gender: 'Female' })}
                        /> Female
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="bk-gender"
                          value="Male"
                          checked={newPatient.gender === 'Male'}
                          onChange={() => setNewPatient({ ...newPatient, gender: 'Male' })}
                        /> Male
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-control"
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    >
                      <option value="Not Known">Select blood group type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="Not Known">Not Known</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Image</label>
                    <div className="file-input-wrapper">
                      <label className="file-input-btn" htmlFor="bk-file">Choose File</label>
                      <span style={{ fontSize: 12.5, color: '#64748b' }}>No file chosen</span>
                      <input type="file" id="bk-file" style={{ display: 'none' }} />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Address<span className="required">*</span></label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Full residential address"
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Special clinical remarks"
                      value={newPatient.note}
                      onChange={(e) => setNewPatient({ ...newPatient, note: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="note-alert-box">
              <div className="note-alert-title">Note:</div>
              <ul className="note-alert-list">
                <li>All <span style={{ color: '#ef4444' }}>*</span> are required fields.</li>
              </ul>
            </div>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <button className="btn btn-primary" onClick={handleProceedToStep2}>
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT APPOINTMENT SLOT */}
        {step === 2 && (
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
              Select Branch & Consultation Slot
            </h4>

            <div className="form-grid-3" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Branch<span className="required">*</span></label>
                <select
                  className="form-control"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="Head Branch">Head Branch</option>
                  <option value="Pal Branch">Pal Branch</option>
                  <option value="Ansh Camp">Ansh Camp</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date<span className="required">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value="Dr. Divya Devani (MD Hom.)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Slots for Selected Date:</label>
              <div className="slots-grid">
                {AVAILABLE_SLOTS.map((slot) => {
                  const isBooked = bookedSlotsForDate.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <div
                      key={slot}
                      onClick={() => !isBooked && setSelectedSlot(slot)}
                      style={{
                        border: `1px solid ${isBooked ? '#e2e8f0' : (isSelected ? '#00a8e8' : '#cbd5e1')}`,
                        background: isBooked ? '#f1f5f9' : (isSelected ? '#e0f2fe' : '#ffffff'),
                        color: isBooked ? '#94a3b8' : '#1e293b',
                        padding: '10px 14px',
                        borderRadius: 4,
                        textAlign: 'center',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>{slot}</div>
                      <div style={{ fontSize: 11, color: isBooked ? '#dc2626' : '#0284c7' }}>
                        {isBooked ? 'Booked' : 'Available'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleProceedToStep3}>
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
              Confirm Appointment & Payment
            </h4>

            <div style={{ maxWidth: 580, margin: '0 auto', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <span style={{ color: '#64748b' }}>Patient:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>
                  {role === 'old'
                    ? `${verifiedPatient?.firstName} ${verifiedPatient?.lastName} (${verifiedPatient?.fileId})`
                    : `${newPatient.firstName} ${newPatient.lastName} (New)`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <span style={{ color: '#64748b' }}>Branch & Date:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>
                  {selectedBranch} • {selectedDate}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 14 }}>
                <span style={{ color: '#64748b' }}>Selected Slot:</span>
                <span style={{ fontWeight: 700, color: '#0284c7' }}>
                  {selectedSlot}
                </span>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Consultation Mode</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pay-mode"
                      value="In Clinic"
                      checked={consultationMode === 'In Clinic'}
                      onChange={() => setConsultationMode('In Clinic')}
                    /> In Clinic (₹500.00)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pay-mode"
                      value="Online Video"
                      checked={consultationMode === 'Online Video'}
                      onChange={() => setConsultationMode('Online Video')}
                    /> Online Video (₹700.00)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash at Clinic">Cash at Clinic</option>
                  <option value="UPI / QR Code">UPI / QR Code (GPay, PhonePe, Paytm)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e0f2fe', padding: 14, borderRadius: 4, marginTop: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#0369a1' }}>Total Amount to Pay:</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: '#0284c7' }}>
                  ₹ {charge.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={14} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleConfirmBooking}>
                Confirm Appointment ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

