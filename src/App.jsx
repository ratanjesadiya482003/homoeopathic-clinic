import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import AppointmentSchedule from './components/AppointmentSchedule';
import BookAppointmentWizard from './components/BookAppointmentWizard';
import MateriaMedica from './components/MateriaMedica';
import ClinicInfo from './components/ClinicInfo';
import Toast from './components/Toast';

import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_EXPENSES
} from './data/mockData';

export default function App() {
  // Local storage synced states
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('ansh_react_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('ansh_react_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('ansh_react_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Routing state
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('0842');
  const [editingPatient, setEditingPatient] = useState(null);
  const [prefilledBookingFileId, setPrefilledBookingFileId] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('ansh_react_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('ansh_react_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ansh_react_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (view, param = null) => {
    setCurrentView(view);
    if (view === 'patient-details' && param) {
      setSelectedPatientId(param);
    }
    if (view === 'book-appointment') {
      setPrefilledBookingFileId(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Patient CRUD
  const handleSavePatient = (formData, isEdit) => {
    if (isEdit) {
      setPatients((prev) =>
        prev.map((p) => (p.fileId === formData.fileId ? { ...p, ...formData } : p))
      );
      showToast(`Patient ${formData.fileId} updated successfully!`, 'success');
    } else {
      const newPatient = {
        ...formData,
        id: formData.fileId,
        createdDate: '19th Nov, 2026',
        remedyHistory: [],
        appointments: [],
        followUps: []
      };
      setPatients((prev) => [newPatient, ...prev]);
      showToast(`Patient ${formData.firstName} added successfully!`, 'success');
    }
    navigateTo('patients');
  };

  const handleDeletePatient = (fileId) => {
    const p = patients.find((x) => x.fileId === fileId);
    if (!p) return;
    if (confirm(`Are you sure you want to delete patient record: ${p.firstName} ${p.lastName} (${p.fileId})?`)) {
      setPatients((prev) => prev.filter((x) => x.fileId !== fileId));
      showToast(`Patient record ${fileId} deleted.`, 'danger');
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    navigateTo('edit-patient');
  };

  const handleUpdatePatientDetails = (fileId, updatedRecord) => {
    setPatients((prev) =>
      prev.map((p) => (p.fileId === fileId ? { ...p, ...updatedRecord } : p))
    );
  };

  // Appointment operations
  const handleUpdateApptStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleBookConfirmed = (newAppt) => {
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const handleAddNewPatientFromBooking = (newPatientRecord) => {
    setPatients((prev) => [newPatientRecord, ...prev]);
  };

  // Expense operations
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [{ ...newExpense, id: Date.now() }, ...prev]);
  };

  // Titles mapping
  const titles = {
    'dashboard': 'Dashboard',
    'patients': 'Patient Management',
    'add-patient': 'Add New Patient',
    'edit-patient': 'Edit Patient',
    'patient-details': 'Patient 360° Record',
    'appointment-details': 'Appointment Details & Schedule',
    'book-appointment': 'Book Appointment',
    'prescription': 'Prescriptions & Case Records',
    'materia-medica': 'Materia Medica Reference',
    'clinic-info': 'Clinic Information & Settings'
  };

  const activePatient = patients.find((p) => p.fileId === selectedPatientId) || patients[0];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        navigateTo={navigateTo}
        showToast={showToast}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          title={titles[currentView] || 'Ansh Homoeopathy'}
          navigateTo={navigateTo}
        />

        <div className="page-content">
          {currentView === 'dashboard' && (
            <Dashboard
              appointments={appointments}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onUpdateApptStatus={handleUpdateApptStatus}
              onViewPatientDetails={(fileId) => navigateTo('patient-details', fileId)}
              navigateTo={navigateTo}
              showToast={showToast}
            />
          )}

          {currentView === 'patients' && (
            <PatientList
              patients={patients}
              onEditPatient={handleEditPatient}
              onDeletePatient={handleDeletePatient}
              onViewDetails={(fileId) => navigateTo('patient-details', fileId)}
              onBookAppointment={(fileId) => navigateTo('book-appointment', fileId)}
              navigateTo={navigateTo}
            />
          )}

          {currentView === 'add-patient' && (
            <PatientForm
              isEdit={false}
              onSave={(data) => handleSavePatient(data, false)}
              onCancel={() => navigateTo('patients')}
              showToast={showToast}
            />
          )}

          {currentView === 'edit-patient' && (
            <PatientForm
              isEdit={true}
              initialData={editingPatient}
              onSave={(data) => handleSavePatient(data, true)}
              onCancel={() => navigateTo('patients')}
              showToast={showToast}
            />
          )}

          {currentView === 'patient-details' && (
            <PatientDetails
              patient={activePatient}
              onUpdatePatient={handleUpdatePatientDetails}
              onBack={() => navigateTo('patients')}
              showToast={showToast}
            />
          )}

          {currentView === 'appointment-details' && (
            <AppointmentSchedule
              appointments={appointments}
              onUpdateStatus={handleUpdateApptStatus}
              navigateTo={navigateTo}
              showToast={showToast}
            />
          )}

          {currentView === 'book-appointment' && (
            <BookAppointmentWizard
              patients={patients}
              appointments={appointments}
              prefilledFileId={prefilledBookingFileId}
              onBookConfirmed={handleBookConfirmed}
              onAddNewPatient={handleAddNewPatientFromBooking}
              navigateTo={navigateTo}
              showToast={showToast}
            />
          )}

          {(currentView === 'prescription' || currentView === 'patient-details-print') && (
            <PatientDetails
              patient={activePatient}
              onUpdatePatient={handleUpdatePatientDetails}
              onBack={() => navigateTo('dashboard')}
              showToast={showToast}
            />
          )}

          {currentView === 'materia-medica' && <MateriaMedica />}

          {currentView === 'clinic-info' && <ClinicInfo />}
        </div>
      </div>

      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

