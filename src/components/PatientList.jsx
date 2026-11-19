import React, { useState } from 'react';
import { User, Plus } from 'lucide-react';

export default function PatientList({
  patients,
  onEditPatient,
  onDeletePatient,
  onViewDetails,
  onBookAppointment,
  navigateTo
}) {
  const [branchFilter, setBranchFilter] = useState('Head Branch');
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);

  const filtered = patients.filter((p) => {
    const matchesBranch = branchFilter === 'All' || p.branch === branchFilter;
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search)) ||
      (p.mobile && p.mobile.includes(search)) ||
      (p.fileId && p.fileId.toLowerCase().includes(search)) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(search));

    return matchesBranch && matchesSearch;
  }).slice(0, perPage);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Patient</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigateTo('add-patient')}
        >
          <Plus size={14} /> Add New Patient
        </button>
      </div>

      <div className="card-body">
        {/* Branch Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ width: 320 }}>
            <select
              className="form-control"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="Head Branch">Head Branch</option>
              <option value="Pal Branch">Pal Branch</option>
              <option value="Ansh Camp">Ansh Camp</option>
              <option value="All">All Branches</option>
            </select>
          </div>
        </div>

        {/* Entries & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#475569' }}>
            <span>Show</span>
            <select
              className="form-control"
              style={{ width: 70, display: 'inline-block' }}
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div style={{ width: 380 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name, Email, Mobile No, File Id, Blood Group, Dx etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Patients Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name ⇅</th>
                <th>Email ⇅</th>
                <th>Mobile No. ⇅</th>
                <th>File ID ⇅</th>
                <th>Blood Group ⇅</th>
                <th>Created Date ⇅</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id || p.fileId}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar-placeholder">
                          <User size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>
                            {p.firstName} {p.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{p.email || '--'}</td>
                    <td>{p.mobile || '--'}</td>
                    <td><b>{p.fileId}</b></td>
                    <td>{p.bloodGroup || 'Not Known'}</td>
                    <td>{p.createdDate || '19th Nov, 2026'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => onEditPatient(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => onDeletePatient(p.fileId)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-primary btn-xs"
                          onClick={() => onViewDetails(p.fileId)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-xs"
                          onClick={() => onBookAppointment(p.fileId)}
                        >
                          Book Appointment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

