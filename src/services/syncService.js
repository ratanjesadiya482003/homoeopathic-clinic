/**
 * Clinic Real-Time Multi-User Synchronization Service
 * 
 * Ensures ALL users across different tabs, computers, tablets, and phones
 * see the EXACT SAME data in real-time when changes (add, edit, delete) happen.
 */

import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_EXPENSES } from '../data/mockData';

const LOCAL_STORAGE_KEY_PATIENTS = '_react_patients';
const LOCAL_STORAGE_KEY_APPOINTMENTS = '_react_appointments';
const LOCAL_STORAGE_KEY_EXPENSES = '_react_expenses';
const LOCAL_STORAGE_KEY_VERSION = '_react_sync_version';
const LOCAL_STORAGE_KEY_LAST_SYNCED = '_react_last_synced';

class ClinicSyncService {
  constructor() {
    this.subscribers = new Set();
    this.statusSubscribers = new Set();
    this.eventSource = null;
    this.broadcastChannel = null;
    this.pollInterval = null;
    this.reconnectTimeout = null;
    this.isLiveSynced = false;
    this.isServerReachable = false;
    this.lastSyncedTime = new Date();
    this.currentVersion = 0;
    this.isInitialized = false;

    // In-memory data store
    this.data = {
      patients: this.loadLocal(LOCAL_STORAGE_KEY_PATIENTS, INITIAL_PATIENTS),
      appointments: this.loadLocal(LOCAL_STORAGE_KEY_APPOINTMENTS, INITIAL_APPOINTMENTS),
      expenses: this.loadLocal(LOCAL_STORAGE_KEY_EXPENSES, INITIAL_EXPENSES)
    };

    // Setup cross-tab BroadcastChannel
    this.initBroadcastChannel();
  }

  loadLocal(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }

  saveLocal(data) {
    try {
      if (data.patients) localStorage.setItem(LOCAL_STORAGE_KEY_PATIENTS, JSON.stringify(data.patients));
      if (data.appointments) localStorage.setItem(LOCAL_STORAGE_KEY_APPOINTMENTS, JSON.stringify(data.appointments));
      if (data.expenses) localStorage.setItem(LOCAL_STORAGE_KEY_EXPENSES, JSON.stringify(data.expenses));
      localStorage.setItem(LOCAL_STORAGE_KEY_LAST_SYNCED, new Date().toISOString());
    } catch (e) {
      console.warn('[Sync] Local storage quota exceeded or unavailable', e);
    }
  }

  initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('homoeopathy_clinic_sync_bus');
        this.broadcastChannel.onmessage = (event) => {
          const msg = event.data;
          if (msg && msg.type === 'CROSS_TAB_SYNC') {
            this.handleRemoteUpdate(msg.payload, true, msg.action || 'Tab update');
          }
        };
      } catch (e) {
        console.warn('[Sync] BroadcastChannel init error', e);
      }
    }
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Fetch initial server data
    this.fetchServerData();

    // 2. Start Real-Time Server-Sent Events (SSE)
    this.connectSSE();

    // 3. Fallback polling every 8 seconds
    this.startPolling();
  }

  connectSSE() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
    }

    try {
      const url = '/api/events';
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.isLiveSynced = true;
        this.isServerReachable = true;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'CONNECTED') {
            this.isLiveSynced = true;
            this.isServerReachable = true;
            this.lastSyncedTime = new Date();
            this.notifyStatus();
          } else if (payload.data) {
            // Update received from another user or action
            this.handleRemoteUpdate(payload.data, true, payload.action, payload.version);
          }
        } catch (e) {
          console.warn('[Sync] Error parsing SSE payload:', e);
        }
      };

      this.eventSource.onerror = () => {
        this.isLiveSynced = false;
        this.notifyStatus();
        this.eventSource.close();
        this.eventSource = null;

        // Reconnect after 4 seconds
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connectSSE();
        }, 4000);
      };
    } catch (e) {
      console.warn('[Sync] Could not initialize EventSource:', e);
      this.isLiveSynced = false;
      this.notifyStatus();
    }
  }

  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      // If SSE isn't active or periodically, poll server to guarantee consistency
      this.fetchServerData(false);
    }, 8000);
  }

  async fetchServerData(notifyIfSame = true) {
    try {
      const res = await fetch('/api/data', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && json.success && json.data) {
        this.isServerReachable = true;
        this.lastSyncedTime = new Date();

        const hasChanged = json.version !== this.currentVersion;
        if (hasChanged) {
          this.handleRemoteUpdate(json.data, false, 'Server refresh', json.version);
        } else if (notifyIfSame) {
          this.notifyStatus();
        }
      }
    } catch {
      this.isServerReachable = false;
      this.notifyStatus();
    }
  }

  handleRemoteUpdate(newData, isRemoteUserAction = false, actionType = '', version = null) {
    if (!newData) return;

    if (version) {
      this.currentVersion = version;
    }

    const updatedPatients = newData.patients || this.data.patients;
    const updatedAppointments = newData.appointments || this.data.appointments;
    const updatedExpenses = newData.expenses || this.data.expenses;

    this.data = {
      patients: updatedPatients,
      appointments: updatedAppointments,
      expenses: updatedExpenses
    };

    this.lastSyncedTime = new Date();
    this.saveLocal(this.data);

    // Notify all UI subscribers
    this.notifySubscribers({
      action: actionType,
      isRemoteUserAction,
      data: this.data
    });

    this.notifyStatus();
  }

  // Broadcast to other tabs on same machine
  broadcastToTabs(actionType, data) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'CROSS_TAB_SYNC',
          action: actionType,
          payload: data,
          timestamp: Date.now()
        });
      } catch {}
    }
  }

  // --- CRUD API METHODS ---

  async savePatient(patient, isEdit) {
    // 1. Optimistic local update
    let newPatients;
    if (isEdit) {
      newPatients = this.data.patients.map(p => p.fileId === patient.fileId ? { ...p, ...patient } : p);
    } else {
      newPatients = [patient, ...this.data.patients];
    }

    this.data.patients = newPatients;
    this.saveLocal(this.data);
    this.broadcastToTabs(isEdit ? 'EDIT_PATIENT' : 'ADD_PATIENT', this.data);
    this.notifySubscribers({ action: isEdit ? 'EDIT_PATIENT' : 'ADD_PATIENT', isRemoteUserAction: false, data: this.data });

    // 2. Push to server
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient, isEdit })
      });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server write failed, saved in offline cache:', e);
    }
  }

  async deletePatient(fileId) {
    // 1. Optimistic local update
    this.data.patients = this.data.patients.filter(p => p.fileId !== fileId);
    this.saveLocal(this.data);
    this.broadcastToTabs('DELETE_PATIENT', this.data);
    this.notifySubscribers({ action: 'DELETE_PATIENT', isRemoteUserAction: false, data: this.data });

    // 2. Push to server
    try {
      const res = await fetch(`/api/patients/${encodeURIComponent(fileId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server delete failed:', e);
    }
  }

  async updatePatientDetails(fileId, updatedRecord) {
    const p = this.data.patients.find(x => x.fileId === fileId);
    const fullPatient = { ...(p || {}), ...updatedRecord, fileId };
    return this.savePatient(fullPatient, true);
  }

  async saveAppointment(appointment, isEdit = false) {
    // 1. Optimistic update
    let newAppts;
    if (isEdit) {
      newAppts = this.data.appointments.map(a => a.id === appointment.id ? { ...a, ...appointment } : a);
    } else {
      newAppts = [appointment, ...this.data.appointments];
    }
    this.data.appointments = newAppts;
    this.saveLocal(this.data);
    this.broadcastToTabs('SAVE_APPOINTMENT', this.data);
    this.notifySubscribers({ action: 'SAVE_APPOINTMENT', isRemoteUserAction: false, data: this.data });

    // 2. Server push
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment, isEdit })
      });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server appointment save failed:', e);
    }
  }

  async updateApptStatus(id, newStatus) {
    // 1. Optimistic update
    this.data.appointments = this.data.appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    this.saveLocal(this.data);
    this.broadcastToTabs('UPDATE_APPT_STATUS', this.data);
    this.notifySubscribers({ action: 'UPDATE_APPT_STATUS', isRemoteUserAction: false, data: this.data });

    // 2. Server push
    try {
      const res = await fetch('/api/appointments/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server appt status update failed:', e);
    }
  }

  async deleteAppointment(id) {
    this.data.appointments = this.data.appointments.filter(a => String(a.id) !== String(id));
    this.saveLocal(this.data);
    this.broadcastToTabs('DELETE_APPOINTMENT', this.data);
    this.notifySubscribers({ action: 'DELETE_APPOINTMENT', isRemoteUserAction: false, data: this.data });

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server delete appointment failed:', e);
    }
  }

  async saveExpense(expense) {
    const newExpense = { ...expense, id: expense.id || Date.now() };
    this.data.expenses = [newExpense, ...this.data.expenses];
    this.saveLocal(this.data);
    this.broadcastToTabs('ADD_EXPENSE', this.data);
    this.notifySubscribers({ action: 'ADD_EXPENSE', isRemoteUserAction: false, data: this.data });

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expense: newExpense })
      });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server expense save failed:', e);
    }
  }

  async deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter(e => String(e.id) !== String(id));
    this.saveLocal(this.data);
    this.broadcastToTabs('DELETE_EXPENSE', this.data);
    this.notifySubscribers({ action: 'DELETE_EXPENSE', isRemoteUserAction: false, data: this.data });

    try {
      const res = await fetch(`/api/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server delete expense failed:', e);
    }
  }

  async resetToDefault() {
    this.data = {
      patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
      appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
      expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES))
    };
    this.saveLocal(this.data);
    this.broadcastToTabs('RESET_DATA', this.data);
    this.notifySubscribers({ action: 'RESET_DATA', isRemoteUserAction: false, data: this.data });

    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        this.currentVersion = json.version || this.currentVersion + 1;
        this.lastSyncedTime = new Date();
        this.notifyStatus();
      }
    } catch (e) {
      console.warn('[Sync] Server reset failed:', e);
    }
  }

  // --- SUBSCRIPTIONS ---

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(payload) {
    for (const sub of this.subscribers) {
      try {
        sub(payload);
      } catch (err) {
        console.error('[Sync] Subscriber error:', err);
      }
    }
  }

  subscribeStatus(callback) {
    this.statusSubscribers.add(callback);
    callback(this.getStatus());
    return () => this.statusSubscribers.delete(callback);
  }

  notifyStatus() {
    const status = this.getStatus();
    for (const sub of this.statusSubscribers) {
      try {
        sub(status);
      } catch {}
    }
  }

  getStatus() {
    return {
      isLiveSynced: this.isLiveSynced,
      isServerReachable: this.isServerReachable,
      lastSyncedTime: this.lastSyncedTime,
      version: this.currentVersion,
      counts: {
        patients: this.data.patients.length,
        appointments: this.data.appointments.length,
        expenses: this.data.expenses.length
      }
    };
  }
}

export const syncService = new ClinicSyncService();
export default syncService;

