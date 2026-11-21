/**
 * Netlify Serverless Function for Clinic API
 * Routes all /api/* calls when deployed to Netlify so they return JSON rather than SPA index.html
 */

import { getClinicData, saveToDisk, broadcastEvent } from '../../server/api.js';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_EXPENSES } from '../../src/data/mockData.js';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Extract clean pathname from Netlify event
  let pathname = event.path || '';
  if (pathname.includes('/.netlify/functions/api')) {
    pathname = pathname.replace('/.netlify/functions/api', '/api');
  }
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }
  pathname = pathname.split('?')[0].replace(/\/+$/, '');
  if (!pathname) pathname = '/api';

  const method = (event.httpMethod || 'GET').toUpperCase();
  const data = getClinicData();

  try {
    let rawBody = event.body || '';
    if (event.isBase64Encoded && rawBody) {
      try {
        rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
      } catch {}
    }

    let body = {};
    if (rawBody && typeof rawBody === 'string') {
      try {
        body = JSON.parse(rawBody);
      } catch {}
    } else if (rawBody && typeof rawBody === 'object') {
      body = rawBody;
    }

    // Server-Sent Events on Netlify: Return instant connected response rather than hanging container
    if (pathname === '/api/events') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          type: 'CONNECTED',
          version: data.version,
          lastUpdated: data.lastUpdated,
          connectedUsers: 1,
          timestamp: Date.now()
        })
      };
    }

    // Health / Status
    if (pathname === '/api/status' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'online',
          version: data.version,
          lastUpdated: data.lastUpdated,
          counts: {
            patients: data.patients.length,
            appointments: data.appointments.length,
            expenses: data.expenses.length
          }
        })
      };
    }

    // Full data
    if (pathname === '/api/data' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          version: data.version,
          lastUpdated: data.lastUpdated,
          data: {
            patients: data.patients,
            appointments: data.appointments,
            expenses: data.expenses
          }
        })
      };
    }

    // Patients save
    if (pathname === '/api/patients' && method === 'POST') {
      const { patient, isEdit } = body;
      if (!patient || !patient.fileId) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Patient data and fileId required' }) };
      }

      const fileIdClean = String(patient.fileId).trim();
      patient.fileId = fileIdClean;
      if (!patient.id) patient.id = fileIdClean;

      const existingIndex = data.patients.findIndex(p => String(p.fileId).trim().toLowerCase() === fileIdClean.toLowerCase());

      if (isEdit) {
        if (existingIndex >= 0) {
          data.patients[existingIndex] = { ...data.patients[existingIndex], ...patient };
        } else {
          data.patients.unshift(patient);
        }
      } else {
        if (existingIndex >= 0) {
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({ success: false, error: `A patient with File ID "${fileIdClean}" already exists.` })
          };
        }
        data.patients.unshift(patient);
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, patient, version: data.version })
      };
    }

    // Patient delete
    if (pathname.startsWith('/api/patients/') && method === 'DELETE') {
      const fileId = decodeURIComponent(pathname.replace('/api/patients/', '')).trim();
      const initialCount = data.patients.length;
      data.patients = data.patients.filter(p => String(p.fileId).trim() !== fileId);

      if (data.patients.length === initialCount) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Patient not found' }) };
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, fileId, version: data.version }) };
    }

    // Appointments save
    if (pathname === '/api/appointments' && method === 'POST') {
      const appt = body.appointment || body;
      if (!appt || (!appt.id && !appt.fileId)) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Appointment details required' }) };
      }
      if (!appt.id) appt.id = Date.now();

      const index = data.appointments.findIndex(a => String(a.id).trim().toLowerCase() === String(appt.id).trim().toLowerCase());
      if (index >= 0) {
        data.appointments[index] = { ...data.appointments[index], ...appt };
      } else {
        data.appointments.unshift(appt);
      }

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, appointment: appt, version: data.version }) };
    }

    // Appointment status change
    if (pathname === '/api/appointments/status' && method === 'POST') {
      const { id, status } = body;
      if (!id || !status) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Appointment id and status are required' }) };
      }

      const appt = data.appointments.find(a => String(a.id).trim().toLowerCase() === String(id).trim().toLowerCase());
      if (!appt) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: `Appointment "${id}" not found` }) };
      }

      appt.status = status;
      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, appointment: appt, version: data.version }) };
    }

    // Appointment delete
    if (pathname.startsWith('/api/appointments/') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/appointments/', '')).trim();
      data.appointments = data.appointments.filter(a => String(a.id).trim().toLowerCase() !== id.toLowerCase());

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id, version: data.version }) };
    }

    // Expenses save
    if (pathname === '/api/expenses' && method === 'POST') {
      const expense = body.expense || body;
      if (!expense.id) expense.id = Date.now();
      data.expenses.unshift(expense);

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, expense, version: data.version }) };
    }

    // Expenses delete
    if (pathname.startsWith('/api/expenses/') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/expenses/', '')).trim();
      data.expenses = data.expenses.filter(e => String(e.id).trim() !== id);

      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id, version: data.version }) };
    }

    // Reset database
    if (pathname === '/api/reset' && method === 'POST') {
      data.version = (data.version || 0) + 1;
      data.lastUpdated = new Date().toISOString();
      data.patients = JSON.parse(JSON.stringify(INITIAL_PATIENTS));
      data.appointments = JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS));
      data.expenses = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
      saveToDisk();

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, version: data.version }) };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: `API route not found: ${method} ${pathname}` })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
