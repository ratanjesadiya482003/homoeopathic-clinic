/**
 * Clinic Real-Time Multi-User Synchronization Service
 * 
 * Centralized Data Management:
 * - Central database is the SINGLE source of truth
 * - Browser localStorage / local-only persistence for clinic data is completely removed
 * - Automatic real-time updates via Server-Sent Events (SSE)
 * - Automatic fallback background polling ensures all tabs/browsers/devices stay identical
 * - Cross-device and cross-user synchronization guaranteed
 */

import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_EXPENSES } from '../data/mockData';

// Legacy keys to purge completely so no stale local-only data interferes
const LEGACY_STORAGE_KEYS = [
  '_react_patients',
  '_react_appointments',
  '_react_expenses',
  '_patients',
  '_appointments',
  '_expenses',
  '_react_sync_version',
  '_react_last_synced'
];

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
    this.isReady = false;
    this.lastSyncedTime = new Date();
    this.currentVersion = 0;
    this.isInitialized = false;

    // Purge old local-only storage to guarantee centralized source of truth
    this.purgeLegacyStorage();

    // Central in-memory state (seeded temporarily until central database responds)
    this.data = {
      patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
      appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
      expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES))
    };

    // Setup cross-tab BroadcastChannel
    this.initBroadcastChannel();
  }

  /**
   * Purge any lingering localStorage items from previous versions
   */
  purgeLegacyStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      LEGACY_STORAGE_KEYS.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch {}
      });
    }
  }

  /**
   * Cross-tab broadcast within the same browser
   */
  initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('homoeopathy_clinic_sync_bus');
        this.broadcastChannel.onmessage = (event) => {
          const msg = event.data;
          if (msg && msg.type === 'CROSS_TAB_SYNC') {
            this.handleRemoteUpdate(msg.payload, true, msg.action || 'Tab update', msg.version);
          }
        };
      } catch (e) {
        console.warn('[Sync] BroadcastChannel init error:', e);
      }
    }
  }

  /**
   * Initialize sync engine:
   * 1. Fetch initial server data
   * 2. Connect real-time Server-Sent Events (SSE)
   * 3. Start background polling fallback
   */
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Fetch initial data from central database
    this.fetchServerData(true);

    // 2. Connect Real-Time SSE
    this.connectSSE();

    // 3. Fallback background sync polling (every 4 seconds)
    this.startPolling();
  }

  /**
   * Server-Sent Events (SSE) for instant cross-device updates
   */
  connectSSE() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
      this.eventSource = null;
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
            if (payload.version && payload.version !== this.currentVersion) {
              this.fetchServerData(false);
            } else {
              this.notifyStatus();
            }
          } else if (payload.data) {
            // Update broadcast from central server (action performed by another user/device)
            this.handleRemoteUpdate(payload.data, true, payload.action, payload.version);
          }
        } catch (e) {
          console.warn('[Sync] Error parsing SSE payload:', e);
        }
      };

      this.eventSource.onerror = () => {
        this.isLiveSynced = false;
        this.notifyStatus();
        if (this.eventSource) {
          try {
            this.eventSource.close();
          } catch {}
          this.eventSource = null;
        }

        // Reconnect after 3 seconds
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connectSSE();
        }, 3000);
      };
    } catch (e) {
      console.warn('[Sync] Could not initialize EventSource:', e);
      this.isLiveSynced = false;
      this.notifyStatus();
    }
  }

  /**
   * Periodic background polling to guarantee consistency even if SSE is interrupted
   */
  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.checkServerStatusOrData();
    }, 4000);
  }

  /**
   * Quick status check or data fetch
   */
  async checkServerStatusOrData() {
    try {
      const res = await fetch('/api/status', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      this.isServerReachable = true;

      // If server version is ahead of our current version, fetch complete updated dataset
      if (typeof json.version === 'number' && json.version !== this.currentVersion) {
        await this.fetchServerData(false);
      } else {
        this.notifyStatus();
      }
    } catch {
      this.isServerReachable = false;
      this.notifyStatus();
    }
  }

  /**
   * Fetch complete dataset from central database
   */
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
        this.isReady = true;
        this.lastSyncedTime = new Date();

        const hasChanged = json.version !== this.currentVersion || !this.isReady;
        this.currentVersion = json.version || this.currentVersion + 1;

        this.data = {
          patients: Array.isArray(json.data.patients) ? json.data.patients : [],
          appointments: Array.isArray(json.data.appointments) ? json.data.appointments : [],
          expenses: Array.isArray(json.data.expenses) ? json.data.expenses : []
        };

        if (hasChanged || notifyIfSame) {
          this.notifySubscribers({
            action: 'SERVER_REFRESH',
            isRemoteUserAction: false,
            data: this.data
          });
        }
        this.notifyStatus();
        return this.data;
      }
    } catch (err) {
      console.warn('[Sync] Could not fetch data from central server:', err.message);
      this.isServerReachable = false;
      this.notifyStatus();
    }
  }

  /**
   * Handle updates received from remote users or server
   */
  handleRemoteUpdate(newData, isRemoteUserAction = false, actionType = '', version = null) {
    if (!newData) return;

    if (version) {
      this.currentVersion = version;
    }

    this.data = {
      patients: Array.isArray(newData.patients) ? newData.patients : this.data.patients,
      appointments: Array.isArray(newData.appointments) ? newData.appointments : this.data.appointments,
      expenses: Array.isArray(newData.expenses) ? newData.expenses : this.data.expenses
    };

    this.lastSyncedTime = new Date();
    this.isReady = true;

    // Notify all UI subscribers
    this.notifySubscribers({
      action: actionType,
      isRemoteUserAction,
      data: this.data
    });

    this.notifyStatus();
  }

  /**
   * Broadcast changes to other tabs in the same browser
   */
  broadcastToTabs(actionType, data, version) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'CROSS_TAB_SYNC',
          action: actionType,
          payload: data,
          version,
          timestamp: Date.now()
        });
      } catch {}
    }
  }

  // ==========================================
  // CENTRALIZED CRUD OPERATIONS
  // All operations commit to the central database
  // ==========================================

  /**
   * Add or Edit Patient
   */
  async savePatient(patient, isEdit) {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient, isEdit })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to save patient (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    // Update in-memory state
    if (isEdit) {
      this.data.patients = this.data.patients.map(p =>
        String(p.fileId).trim() === String(patient.fileId).trim() ? { ...p, ...patient } : p
      );
    } else {
      this.data.patients = [patient, ...this.data.patients.filter(p => p.fileId !== patient.fileId)];
    }

    this.broadcastToTabs(isEdit ? 'EDIT_PATIENT' : 'ADD_PATIENT', this.data, this.currentVersion);
    this.notifySubscribers({
      action: isEdit ? 'EDIT_PATIENT' : 'ADD_PATIENT',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Delete Patient
   */
  async deletePatient(fileId) {
    const res = await fetch(`/api/patients/${encodeURIComponent(fileId)}`, {
      method: 'DELETE'
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to delete patient (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    this.data.patients = this.data.patients.filter(p => String(p.fileId).trim() !== String(fileId).trim());

    this.broadcastToTabs('DELETE_PATIENT', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'DELETE_PATIENT',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Update full patient record (e.g. Case sheet or Follow up)
   */
  async updatePatientDetails(fileId, updatedRecord) {
    const p = this.data.patients.find(x => String(x.fileId).trim() === String(fileId).trim());
    const fullPatient = { ...(p || {}), ...updatedRecord, fileId };
    return this.savePatient(fullPatient, true);
  }

  /**
   * Add or Edit Appointment
   */
  async saveAppointment(appointment, isEdit = false) {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment, isEdit })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to save appointment (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    const savedAppt = json.appointment || appointment;
    const index = this.data.appointments.findIndex(a => String(a.id) === String(savedAppt.id));
    if (index >= 0) {
      this.data.appointments[index] = { ...this.data.appointments[index], ...savedAppt };
    } else {
      this.data.appointments = [savedAppt, ...this.data.appointments];
    }

    this.broadcastToTabs('SAVE_APPOINTMENT', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'SAVE_APPOINTMENT',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Update Appointment Status (In / Closed / Cancelled)
   */
  async updateApptStatus(id, newStatus) {
    const res = await fetch('/api/appointments/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to update appointment status (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    this.data.appointments = this.data.appointments.map(a =>
      String(a.id) === String(id) ? { ...a, status: newStatus } : a
    );

    this.broadcastToTabs('UPDATE_APPT_STATUS', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'UPDATE_APPT_STATUS',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Delete Appointment
   */
  async deleteAppointment(id) {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to delete appointment (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    this.data.appointments = this.data.appointments.filter(a => String(a.id) !== String(id));

    this.broadcastToTabs('DELETE_APPOINTMENT', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'DELETE_APPOINTMENT',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Record Clinic Expense
   */
  async saveExpense(expense) {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to save expense (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    const savedExpense = json.expense || expense;
    this.data.expenses = [savedExpense, ...this.data.expenses];

    this.broadcastToTabs('ADD_EXPENSE', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'ADD_EXPENSE',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Delete Expense
   */
  async deleteExpense(id) {
    const res = await fetch(`/api/expenses/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to delete expense (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    this.data.expenses = this.data.expenses.filter(e => String(e.id) !== String(id));

    this.broadcastToTabs('DELETE_EXPENSE', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'DELETE_EXPENSE',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  /**
   * Reset Central Database to Default Seed Data
   */
  async resetToDefault() {
    const res = await fetch('/api/reset', { method: 'POST' });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to reset database (HTTP ${res.status})`);
    }

    this.currentVersion = json.version || this.currentVersion + 1;
    this.lastSyncedTime = new Date();

    this.data = {
      patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
      appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
      expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES))
    };

    this.broadcastToTabs('RESET_DATA', this.data, this.currentVersion);
    this.notifySubscribers({
      action: 'RESET_DATA',
      isRemoteUserAction: false,
      data: this.data
    });
    this.notifyStatus();

    return json;
  }

  // --- UI SUBSCRIPTIONS ---

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
      isReady: this.isReady,
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
