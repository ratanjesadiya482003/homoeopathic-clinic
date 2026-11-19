import React, { useState } from 'react';
import { MATERIA_MEDICA_DB } from '../data/mockData';

export default function MateriaMedica() {
  const [search, setSearch] = useState('');

  const filtered = MATERIA_MEDICA_DB.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.commonName.toLowerCase().includes(search.toLowerCase()) ||
      m.keynotes.toLowerCase().includes(search.toLowerCase()) ||
      m.mind.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Homeopathic Materia Medica & Neuro-Psychiatric Keynotes</h3>
        <input
          type="text"
          className="form-control"
          style={{ width: 280 }}
          placeholder="Search remedy, keynote, mind..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="card-body">
        <div className="slots-grid">
          {filtered.map((m) => (
            <div className="slot-card" key={m.name} style={{ background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#0284c7' }}>{m.name}</span>
                <span style={{ fontSize: 11, background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4 }}>
                  {m.commonName}
                </span>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#334155' }}>
                <b>Keynotes:</b> {m.keynotes}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#475569' }}>
                <b>Mind:</b> {m.mind}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                {m.modalities}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

