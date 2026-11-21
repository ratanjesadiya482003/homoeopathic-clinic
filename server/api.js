/**
 * Homoeopathy Clinic - Central Data Store & Real-Time Sync Server Engine
 * Powers multi-user synchronization across all tabs, computers, and devices.
 * Supports:
 * - Persistent JSON database storage (data/clinic_db.json)
 * - REST API (/api/data, /api/patients, /api/appointments, /api/expenses)
 * - Real-Time Server-Sent Events (SSE) broadcasting (/api/events)
 * - Automatic seed initialization from src/data/mockData.js
 * - Cross-device & cross-browser synchronization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_EXPENSES } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'clinic_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[ClinicSync] Could not create DATA_DIR:', err.message);
  }
}

// In-memory active state
let clinicData = null;
const sseClients = new Set();

/**
 * Initialize or load database from central file
 */
export function getClinicData() {
  if (clinicData) return clinicData;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.patients)) {
        clinicData = {
          version: typeof parsed.version === 'number' ? parsed.version : 1,
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          patients: Array.isArray(parsed.patients) ? parsed.patients : [],
          appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
          expenses: Array.isArray(parsed.expenses) ? parsed.expenses : []
        };
        console.log(`[ClinicSync] Loaded database from disk: ${clinicData.patients.length} patients, ${clinicData.appointments.length} appointments, ${clinicData.expenses.length} expenses (version: ${clinicData.version}).`);
        return clinicData;
      }
    }
  } catch (err) {
    console.error('[ClinicSync] Error reading database file, reinitializing default data:', err.message);
  }

  // Fallback to initial seed data
  clinicData = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
    appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
    expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES))
  };

  saveToDisk();
  console.log(`[ClinicSync] Initialized default database with ${clinicData.patients.length} patients.`);
  return clinicData;
}

/**
 * Safe persistence to JSON file
 * Avoids Windows rename locking issues by writing directly with UTF-8
 */
export function saveToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const jsonString = JSON.stringify(clinicData, null, 2);
    fs.writeFileSync(DB_FILE, jsonString, 'utf8');
  } catch (err) {
    console.error('[ClinicSync] Failed to persist database to disk:', err.message);
    try {
      fs.writeFileSync(`${DB_FILE}.bak`, JSON.stringify(clinicData, null, 2), 'utf8');
    } catch (e2) {
      console.error('[ClinicSync] Backup write also failed:', e2.message);
    }
  }
}

/**
 * Broadcast event to all connected clients via Server-Sent Events (SSE)
 */
export function broadcastEvent(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  const deadClients = [];

  for (const client of sseClients) {
    try {
      client.write(payload);
      if (typeof client.flush === 'function') {
        client.flush();
      }
    } catch {
      deadClients.push(client);
    }
  }

  for (const dead of deadClients) {
    sseClients.delete(dead);
  }
}

// Heartbeat keep-alive every 15 seconds (unref so it doesn't block shutdown)
const heartbeatTimer = setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': heartbeat\n\n');
      if (typeof client.flush === 'function') {
        client.flush();
      }
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);
if (heartbeatTimer.unref) {
  heartbeatTimer.unref();
}

/**
 * Parse incoming JSON body
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Central API Request Router & Handler
 * Works with Node http.createServer, Vite Connect middleware, and serverless functions
 */
export async function handleApiRequest(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || 'localhost';
  const urlObj = new URL(req.url, `http://${host}`);
  const pathname = urlObj.pathname;
  const method = req.method.toUpperCase();

  const data = getClinicData();

  const sendJson = (statusCode, obj) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    });
    res.end(JSON.stringify(obj));
  };

  try {
    // 1. Real-Time Server-Sent Events (SSE) Endpoint
    if (pathname === '/api/events' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=UTF-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*'
      });

      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }

      // Send initial connect notification
      res.write(`data: ${JSON.stringify({
        type: 'CONNECTED',
        version: data.version,
        lastUpdated: data.lastUpdated,
        connectedUsers: sseClients.size + 1,
        timestamp: Date.now()
      })}\n\n`);

      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    // 2. Health & Status
    if (pathname === '/api/status' && method === 'GET') {
      return sendJson(200, {
        status: 'online',
        version: data.version,
        lastUpdated: data.lastUpdated,
        connectedClients: sseClients.size,
        counts: {
          patients: data.patients.length,
          appointments: data.appointments.length,
          expenses: data.expenses.length
        }
      });
    }

    // 3. Get full database state
    if (pathname === '/api/data' && method === 'GET') {
      return sendJson(200, {
        success: true,
        version: data.version,
        lastUpdated: data.lastUpdated,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });
    }

    // 4. Batch Sync / Overwrite
    if (pathname === '/api/sync' && method === 'POST') {
      const body = await parseRequestBody(req);
      if (Array.isArray(body.patients)) data.patients = body.patients;
      if (Array.isArray(body.appointments)) data.appointments = body.appointments;
      if (Array.isArray(body.expenses)) data.expenses = body.expenses;

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'SYNC_UPDATE',
        action: body.action || 'FULL_SYNC',
        version: data.version,
        lastUpdated: data.lastUpdated,
        summary: body.summary || 'Database updated',
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, {
        success: true,
        version: data.version,
        lastUpdated: data.lastUpdated
      });
    }

    // 5. Patient Save (Add or Edit)
    if (pathname === '/api/patients' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { patient, isEdit } = body;

      if (!patient || !patient.fileId) {
        return sendJson(400, { success: false, error: 'Patient data and fileId are required' });
      }

      const fileIdClean = String(patient.fileId).trim();
      patient.fileId = fileIdClean;
      if (!patient.id) patient.id = fileIdClean;

      const existingIndex = data.patients.findIndex(
        p => String(p.fileId).trim().toLowerCase() === fileIdClean.toLowerCase()
      );

      if (isEdit) {
        if (existingIndex >= 0) {
          data.patients[existingIndex] = { ...data.patients[existingIndex], ...patient };
        } else {
          data.patients.unshift(patient);
        }
      } else {
        // New patient: prevent duplicate fileId
        if (existingIndex >= 0) {
          return sendJson(409, {
            success: false,
            error: `A patient with File ID "${fileIdClean}" already exists. Please choose a different File ID.`
          });
        }
        data.patients.unshift(patient);
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'PATIENT_SAVED',
        action: isEdit ? 'EDIT_PATIENT' : 'ADD_PATIENT',
        version: data.version,
        lastUpdated: data.lastUpdated,
        patient,
        isEdit,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, patient, version: data.version });
    }

    // 6. Patient Delete
    if (pathname.startsWith('/api/patients/') && method === 'DELETE') {
      const fileId = decodeURIComponent(pathname.replace('/api/patients/', '')).trim();
      const initialCount = data.patients.length;
      data.patients = data.patients.filter(p => String(p.fileId).trim() !== fileId);

      if (data.patients.length === initialCount) {
        return sendJson(404, { success: false, error: `Patient with File ID ${fileId} not found` });
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'PATIENT_DELETED',
        action: 'DELETE_PATIENT',
        version: data.version,
        lastUpdated: data.lastUpdated,
        fileId,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, fileId, version: data.version });
    }

    // 7. Appointment Save (Add or Update)
    if (pathname === '/api/appointments' && method === 'POST') {
      const body = await parseRequestBody(req);
      const appt = body.appointment || body;

      if (!appt || (!appt.id && !appt.fileId)) {
        return sendJson(400, { success: false, error: 'Appointment details are required' });
      }

      if (!appt.id) {
        appt.id = Date.now();
      }

      const index = data.appointments.findIndex(a => String(a.id) === String(appt.id));
      if (index >= 0) {
        data.appointments[index] = { ...data.appointments[index], ...appt };
      } else {
        data.appointments.unshift(appt);
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'APPOINTMENT_SAVED',
        action: index >= 0 ? 'EDIT_APPOINTMENT' : 'ADD_APPOINTMENT',
        version: data.version,
        lastUpdated: data.lastUpdated,
        appointment: appt,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, appointment: appt, version: data.version });
    }

    // 8. Appointment Status Change
    if (pathname === '/api/appointments/status' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { id, status } = body;

      const appt = data.appointments.find(a => String(a.id) === String(id));
      if (appt) {
        appt.status = status;
        data.version = (data.version || 0) + 1;
        data.lastUpdated = new Date().toISOString();
        saveToDisk();

        broadcastEvent({
          type: 'APPOINTMENT_STATUS_CHANGED',
          action: 'UPDATE_STATUS',
          version: data.version,
          lastUpdated: data.lastUpdated,
          id,
          status,
          appointment: appt,
          data: {
            patients: data.patients,
            appointments: data.appointments,
            expenses: data.expenses
          }
        });

        return sendJson(200, { success: true, appointment: appt, version: data.version });
      } else {
        return sendJson(404, { success: false, error: 'Appointment not found' });
      }
    }

    // 9. Appointment Delete
    if (pathname.startsWith('/api/appointments/') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/appointments/', '')).trim();
      const initialCount = data.appointments.length;
      data.appointments = data.appointments.filter(a => String(a.id) !== String(id));

      if (data.appointments.length === initialCount) {
        return sendJson(404, { success: false, error: 'Appointment not found' });
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'APPOINTMENT_DELETED',
        action: 'DELETE_APPOINTMENT',
        version: data.version,
        lastUpdated: data.lastUpdated,
        id,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, id, version: data.version });
    }

    // 10. Expense Save (Add)
    if (pathname === '/api/expenses' && method === 'POST') {
      const body = await parseRequestBody(req);
      const expense = body.expense || body;

      if (!expense.title || expense.amount === undefined) {
        return sendJson(400, { success: false, error: 'Expense title and amount are required' });
      }

      if (!expense.id) {
        expense.id = Date.now();
      }

      data.expenses.unshift(expense);
      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'EXPENSE_ADDED',
        action: 'ADD_EXPENSE',
        version: data.version,
        lastUpdated: data.lastUpdated,
        expense,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, expense, version: data.version });
    }

    // 11. Expense Delete
    if (pathname.startsWith('/api/expenses/') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/expenses/', '')).trim();
      const initialCount = data.expenses.length;
      data.expenses = data.expenses.filter(e => String(e.id) !== String(id));

      if (data.expenses.length === initialCount) {
        return sendJson(404, { success: false, error: 'Expense record not found' });
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      broadcastEvent({
        type: 'EXPENSE_DELETED',
        action: 'DELETE_EXPENSE',
        version: data.version,
        lastUpdated: data.lastUpdated,
        id,
        data: {
          patients: data.patients,
          appointments: data.appointments,
          expenses: data.expenses
        }
      });

      return sendJson(200, { success: true, id, version: data.version });
    }

    // 12. Reset Database to Default Seed Data
    if (pathname === '/api/reset' && method === 'POST') {
      clinicData = {
        version: (data.version || 0) + 1,
        lastUpdated: new Date().toISOString(),
        patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
        appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
        expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES))
      };
      saveToDisk();

      broadcastEvent({
        type: 'DATABASE_RESET',
        action: 'RESET_DATA',
        version: clinicData.version,
        lastUpdated: clinicData.lastUpdated,
        summary: 'Database reset to initial demo state',
        data: {
          patients: clinicData.patients,
          appointments: clinicData.appointments,
          expenses: clinicData.expenses
        }
      });

      return sendJson(200, { success: true, version: clinicData.version });
    }

    // 404 for unknown /api route
    return sendJson(404, { success: false, error: `API route not found: ${method} ${pathname}` });
  } catch (err) {
    console.error(`[ClinicSync API Error] ${method} ${pathname}:`, err);
    return sendJson(500, { success: false, error: err.message });
  }
}
