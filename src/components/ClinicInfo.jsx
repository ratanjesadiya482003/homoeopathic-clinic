import React from 'react';

export default function ClinicInfo() {
  return (
    <div className="form-grid-2">
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
  );
}

