import React, { useState, useEffect } from 'react';
import { calculateAgeFromDob } from '../data/mockData';
import { ArrowLeft } from 'lucide-react';

export default function PatientForm({
  isEdit = false,
  initialData = null,
  onSave,
  onCancel,
  showToast
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    occupation: '',
    fileId: '',
    mobile: '',
    dob: '2026-11-19',
    age: '0 day',
    reference: '',
    maritalStatus: '',
    education: '',
    gender: 'Male',
    branch: 'Head Branch',
    bloodGroup: 'Not Known',
    address: '',
    note: '',
    profileImage: null
  });

  const [imageFileName, setImageFileName] = useState('No file chosen');

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email === '--' ? '' : (initialData.email || ''),
        occupation: initialData.occupation === '--' ? '' : (initialData.occupation || ''),
        fileId: initialData.fileId || '',
        mobile: initialData.mobile || '',
        dob: initialData.dob || '2026-11-19',
        age: initialData.age || calculateAgeFromDob(initialData.dob),
        reference: initialData.reference || '',
        maritalStatus: initialData.maritalStatus === '--' ? '' : (initialData.maritalStatus || ''),
        education: initialData.education === '--' ? '' : (initialData.education || ''),
        gender: initialData.gender || 'Male',
        branch: initialData.branch || 'Head Branch',
        bloodGroup: initialData.bloodGroup || 'Not Known',
        address: initialData.address || '',
        note: initialData.note || '',
        profileImage: null
      });
    } else if (!isEdit) {
      // Auto suggest next file ID
      const randomId = '0' + (Math.floor(Math.random() * 9000) + 1000);
      setFormData(prev => ({ ...prev, fileId: randomId }));
    }
  }, [isEdit, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'dob') {
        updated.age = calculateAgeFromDob(value);
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFileName(e.target.files[0].name);
      setFormData(prev => ({ ...prev, profileImage: e.target.files[0].name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast('First and Last name are required.', 'danger');
      return;
    }
    if (!formData.fileId.trim()) {
      showToast('File ID is required.', 'danger');
      return;
    }
    if (!formData.mobile.trim()) {
      showToast('Mobile number is required.', 'danger');
      return;
    }
    if (!formData.dob) {
      showToast('Birth Date is required.', 'danger');
      return;
    }
    if (!formData.address.trim()) {
      showToast('Address is required.', 'danger');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? 'Edit Patient' : 'Add New Patient'}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Edit' : 'Save'}
          </button>
          <button className="btn btn-outline-primary" onClick={onCancel}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name, Email, Occupation */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Full Name<span className="required">*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Student / Business / Engineer"
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: File Id, Mobile, Birth Date, Age */}
          <div className="form-grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">File Id<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 0842"
                value={formData.fileId}
                onChange={(e) => handleChange('fileId', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="10-digit mobile"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Birth Date<span className="required">*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="text"
                className="form-control"
                value={formData.age}
                readOnly
              />
            </div>
          </div>

          {/* Row 3: Reference, Marital Status, Education, Gender */}
          <div className="form-grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Reference</label>
              <input
                type="text"
                className="form-control"
                placeholder="Reference person"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select
                className="form-control"
                value={formData.maritalStatus}
                onChange={(e) => handleChange('maritalStatus', e.target.value)}
              >
                <option value="">Select Marital Status</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Education</label>
              <input
                type="text"
                className="form-control"
                placeholder="Education"
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="form-gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={() => handleChange('gender', 'Female')}
                  /> Female
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="form-gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={() => handleChange('gender', 'Male')}
                  /> Male
                </label>
              </div>
            </div>
          </div>

          {/* Row 4: Branch, Blood Group, Profile Image */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Branch</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="form-branch"
                    value="Head Branch"
                    checked={formData.branch === 'Head Branch'}
                    onChange={() => handleChange('branch', 'Head Branch')}
                  /> Head Branch
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="form-branch"
                    value="Pal Branch"
                    checked={formData.branch === 'Pal Branch'}
                    onChange={() => handleChange('branch', 'Pal Branch')}
                  /> Pal Branch
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="form-branch"
                    value=" Camp"
                    checked={formData.branch === ' Camp'}
                    onChange={() => handleChange('branch', ' Camp')}
                  />  Camp
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
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
                <label className="file-input-btn" htmlFor="p-img-upload">Choose File</label>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>{imageFileName}</span>
                <input
                  type="file"
                  id="p-img-upload"
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Address, Note */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Address<span className="required">*</span></label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Full residential address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Note</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Special medical or clinical remarks"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>
          </div>

          {/* Note Box */}
          <div className="note-alert-box">
            <div className="note-alert-title">Note:</div>
            <ul className="note-alert-list">
              <li>All <span style={{ color: '#ef4444' }}>*</span> are required fields.</li>
              <li>Profile Image format should be <b>png</b>, <b>jpg</b> and <b>jpeg</b> are supported.</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

