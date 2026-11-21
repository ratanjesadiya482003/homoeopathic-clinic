import React, { useState, useEffect, useCallback } from 'react';
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
import { syncService } from './services/syncService';

export default function App() {
  // Live Synced Global States (Initialized from Central Database)
  const [patients, setPatients] = useState(() => syncService.data.patients);
  const [appointments, setAppointments] = useState(() => syncService.data.appointments);
  const [expenses, setExpenses] = useState(() => syncService.data.expenses);
  const [syncStatus, setSyncStatus] = useState(() => syncService.getStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Routing state
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('0842');
  const [editingPatient, setEditingPatient] = useState(null);
  const [prefilledBookingFileId, setPrefilledBookingFileId] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Central Real-Time Synchronization Listener
  useEffect(() => {
    syncService.init();

    const unsubData = syncService.subscribe((event) => {
      if (event.data) {
        setPatients(event.data.patients);
        setAppointments(event.data.appointments);
        setExpenses(event.data.expenses);
      }

      // If change was made by another user/device/tab, notify user
      if (event.isRemoteUserAction) {
        if (event.action === 'EDIT_PATIENT') {
          showToast('🔄 Real-time Sync: Patient record updated by another user.', 'info');
        } else if (event.action === 'ADD_PATIENT') {
          showToast('🔄 Real-time Sync: New patient added by another user.', 'info');
        } else if (event.action === 'DELETE_PATIENT') {
          showToast('🔄 Real-time Sync: Patient record removed by another user.', 'info');
        } else if (event.action === 'SAVE_APPOINTMENT' || event.action === 'UPDATE_APPT_STATUS') {
          showToast('🔄 Real-time Sync: Appointments updated by another user.', 'info');
        } else if (event.action === 'ADD_EXPENSE' || event.action === 'DELETE_EXPENSE') {
          showToast('🔄 Real-time Sync: Clinic expenses updated by another user.', 'info');
        } else if (event.action === 'RESET_DATA') {
          showToast('🔄 Real-time Sync: Clinic database reset to demo state.', 'warning');
        }
      }
    });

    const unsubStatus = syncService.subscribeStatus((status) => {
      setSyncStatus(status);
    });

    return () => {
      unsubData();
      unsubStatus();
    };
  }, [showToast]);

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

  // Patient CRUD (Synced in Real-Time to All Users)
  const handleSavePatient = async (formData, isEdit) => {
    try {
      if (isEdit) {
        const existing = patients.find(p => String(p.fileId).trim() === String(formData.fileId).trim()) || {};
        const fullRecord = { ...existing, ...formData };
        await syncService.savePatient(fullRecord, true);
        showToast(`Patient ${formData.fileId} updated across all users!`, 'success');
      } else {
        const newPatient = {
          ...formData,
          id: formData.fileId,
          createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          remedyHistory: [],
          appointments: [],
          followUps: []
        };
        await syncService.savePatient(newPatient, false);
        showToast(`Patient ${formData.firstName} added and synced to all devices!`, 'success');
      }
      navigateTo('patients');
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  const handleDeletePatient = async (fileId) => {
    const p = patients.find((x) => String(x.fileId).trim() === String(fileId).trim());
    if (!p) return;
    if (window.confirm(`Are you sure you want to delete patient: ${p.firstName} ${p.lastName} (${p.fileId})? This will immediately remove it for all users.`)) {
      try {
        await syncService.deletePatient(fileId);
        showToast(`Patient ${fileId} deleted and updated for all users.`, 'danger');
      } catch (err) {
        showToast(`Database Error: ${err.message}`, 'danger');
      }
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    navigateTo('edit-patient');
  };

  const handleUpdatePatientDetails = async (fileId, updatedRecord) => {
    try {
      await syncService.updatePatientDetails(fileId, updatedRecord);
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  // Appointment operations (Synced in Real-Time)
  const handleUpdateApptStatus = async (id, newStatus) => {
    try {
      await syncService.updateApptStatus(id, newStatus);
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  const handleBookConfirmed = async (newAppt) => {
    try {
      await syncService.saveAppointment(newAppt, false);
      showToast('Appointment booked and synced to all devices!', 'success');
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  const handleAddNewPatientFromBooking = async (newPatientRecord) => {
    try {
      await syncService.savePatient(newPatientRecord, false);
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  // Expense operations (Synced in Real-Time)
  const handleAddExpense = async (newExpense) => {
    try {
      await syncService.saveExpense(newExpense);
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await syncService.deleteExpense(id);
      showToast('Expense record deleted and synced.', 'info');
    } catch (err) {
      showToast(`Database Error: ${err.message}`, 'danger');
    }
  };

  // Manual Refresh & Reset
  const handleRefreshSync = async () => {
    setIsRefreshing(true);
    await syncService.fetchServerData(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Central database synchronized across all users.', 'success');
    }, 400);
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Reset all patients, appointments and expenses to the initial clinic demo data? All users will immediately see the reset data.')) {
      try {
        await syncService.resetToDefault();
        showToast('Clinic database reset to initial demo state.', 'warning');
      } catch (err) {
        showToast(`Database Error: ${err.message}`, 'danger');
      }
    }
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

  const activePatient = patients.find((p) => String(p.fileId).trim() === String(selectedPatientId).trim()) || patients[0];

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
          title={titles[currentView] || ' Homoeopathy'}
          navigateTo={navigateTo}
          syncStatus={syncStatus}
          onRefreshSync={handleRefreshSync}
          isRefreshing={isRefreshing}
        />

        <div className="page-content">
          {currentView === 'dashboard' && (
            <Dashboard
              appointments={appointments}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
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

          {currentView === 'clinic-info' && (
            <ClinicInfo
              patients={patients}
              appointments={appointments}
              expenses={expenses}
              syncStatus={syncStatus}
              onRefreshSync={handleRefreshSync}
              onResetDatabase={handleResetDatabase}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
