/**
 *  HOMOEOPATHY - CLINIC MANAGEMENT SYSTEM
 * Advanced Neuro-psychiatric Homoeopathy
 * Application State, Routing & Interaction Engine
 */

// ==========================================
// 1. INITIAL SEED DATA (Matching all 12 images)
// ==========================================

const INITIAL_PATIENTS = [
  {
    id: "0842",
    fileId: "0842",
    firstName: "Nishiv",
    lastName: "Viraj Kansagra",
    email: "patelbrinda9978@gmail.com",
    mobile: "9978432492",
    dob: "2026-06-27",
    age: "4 months",
    gender: "Male",
    maritalStatus: "Unmarried",
    reference: "Maheshwariben Dobariya",
    education: "--",
    occupation: "--",
    branch: "Head Branch",
    bloodGroup: "Not Known",
    address: "B-3, Krishna Kunj, Chikuwadi raw house, Udhna, Surat",
    note: "Pediatric irritability, sleep disturbance and mild eczema.",
    createdDate: "19th Nov, 2026",
    remedyHistory: [
      { remedy: "SUL", potency: "0/1", createdDate: "19th Nov, 2026 11:53 AM" }
    ],
    appointments: [
      {
        date: "19th Nov, 2026",
        mode: "In Clinic",
        time: "15:31",
        charge: "500.00",
        status: "Closed"
      }
    ],
    caseSheet: {
      presentComplaints: "Chief complaints: Continuous night crying, restlessness after 11 PM. Aggravation from covering/warmth. Mild pruritic eruptions in skin folds.",
      pastHistory: "Mild neonatal jaundice treated with phototherapy.",
      familyHistory: "Maternal uncle has history of bronchial asthma. Paternal grandfather had hypertension.",
      treatmentHistory: "Used topical calamine lotion with transient relief.",
      birthHistory: "FTND, birth weight 3.1 kg, cried immediately, vaccinated as per age.",
      gynHistory: "--",
      appetite: "Good, nurses frequently.",
      desires: "Warm milk.",
      thermal: "Hot (kicks off blanket during sleep)",
      sleep: "Disturbed, wakes up frequently.",
      perspiration: "Profuse on occiput during sleep, stains yellow.",
      mindSymptoms: "Obstinate, irritable, soothed when carried outdoors.",
      rubrics: "MIND - RESTLESSNESS - night; GENERALS - HEAT - flushes of; SKIN - ERUPTIONS - itching - warmth agg.",
      remedy: "SULPHUR",
      potency: "0/1 (LM)",
      dosage: "1 globule stat",
      days: "15 days"
    },
    followUps: [
      {
        date: "19th Nov, 2026",
        text: "Mother reports night sleep has significantly improved. Itching is minimal. Bowels regular once daily.",
        weight: "7.4 kg",
        bp: "--",
        charge: "500.00",
        takenBy: "Dr. Divya Devani",
        remedy: "SUL",
        potency: "0/1",
        dosage: "1 dose empty stomach",
        repetition: "Weekly once",
        days: "15 days",
        prescriptionType: "Globules in milk sugar"
      }
    ]
  },
  {
    id: "06986",
    fileId: "06986",
    firstName: "Vipex",
    lastName: "Dhanjibhai Jasoliya",
    email: "jasoliyavip5110@gmail.com",
    mobile: "8866682419",
    dob: "1994-04-12",
    age: "32 years",
    gender: "Male",
    maritalStatus: "Married",
    reference: "Dr. Patel",
    education: "B.Com",
    occupation: "Diamond Merchant",
    branch: "Head Branch",
    bloodGroup: "B+",
    address: "Varachha Road, Surat",
    note: "Chronic tension headache and anxiety.",
    createdDate: "18th Nov, 2026",
    remedyHistory: [
      { remedy: "NUX VOMICA", potency: "200CH", createdDate: "18th Nov, 2026 12:15 PM" }
    ],
    appointments: [
      { date: "18th Nov, 2026", mode: "In Clinic", time: "11:00", charge: "500.00", status: "Closed" }
    ]
  },
  {
    id: "06985",
    fileId: "06985",
    firstName: "Keyur",
    lastName: "Mukheshbhai Patel",
    email: "keyur8758175628@gmail.com",
    mobile: "6353960979",
    dob: "1998-08-20",
    age: "28 years",
    gender: "Male",
    maritalStatus: "Unmarried",
    reference: "Self",
    education: "BE Computer",
    occupation: "Software Engineer",
    branch: "Head Branch",
    bloodGroup: "A+",
    address: "Pal Gam, Surat",
    note: "Allergic rhinitis and morning sneezing.",
    createdDate: "18th Nov, 2026",
    remedyHistory: [
      { remedy: "ALLIUM CEPA", potency: "30C", createdDate: "18th Nov, 2026 04:30 PM" }
    ],
    appointments: [
      { date: "18th Nov, 2026", mode: "In Clinic", time: "16:30", charge: "500.00", status: "Closed" }
    ]
  },
  {
    id: "06984",
    fileId: "06984",
    firstName: "Bhumika",
    lastName: "Rakesh Kathiriya",
    email: "admin@gmail.com",
    mobile: "9067777682",
    dob: "1992-02-15",
    age: "34 years",
    gender: "Female",
    maritalStatus: "Married",
    reference: "Maheshbhai",
    education: "BA",
    occupation: "Homemaker",
    branch: "Head Branch",
    bloodGroup: "Not Known",
    address: "Mota Varachha, Surat",
    note: "Migraine with nausea.",
    createdDate: "17th Nov, 2026",
    remedyHistory: [
      { remedy: "NATRUM MUR", potency: "200CH", createdDate: "17th Nov, 2026 11:20 AM" }
    ],
    appointments: [
      { date: "17th Nov, 2026", mode: "In Clinic", time: "11:15", charge: "500.00", status: "Closed" }
    ]
  },
  {
    id: "06982",
    fileId: "06982",
    firstName: "Aditi",
    lastName: "Raviprakash singh Rajput",
    email: "--",
    mobile: "9512044327",
    dob: "2001-11-04",
    age: "25 years",
    gender: "Female",
    maritalStatus: "Unmarried",
    reference: "Friend",
    education: "B.Sc Nursing",
    occupation: "Nurse",
    branch: "Head Branch",
    bloodGroup: "A+",
    address: "Adajan, Surat",
    note: "Acne vulgaris with hormonal flare-up.",
    createdDate: "16th Nov, 2026",
    remedyHistory: [
      { remedy: "PULSATILLA", potency: "200C", createdDate: "16th Nov, 2026 05:40 PM" }
    ],
    appointments: [
      { date: "16th Nov, 2026", mode: "In Clinic", time: "17:30", charge: "500.00", status: "Closed" }
    ]
  },
  {
    id: "06983",
    fileId: "06983",
    firstName: "Bhakti",
    lastName: "dilipbhai Pansala",
    email: "pansalabhakti0@gmail.com",
    mobile: "9824842242",
    dob: "2003-05-18",
    age: "23 years",
    gender: "Female",
    maritalStatus: "Unmarried",
    reference: "Relative",
    education: "B.Com",
    occupation: "Accountant",
    branch: "Pal Branch",
    bloodGroup: "A+",
    address: "Pal, Surat",
    note: "Gastritis with bloating.",
    createdDate: "12th Nov, 2026",
    remedyHistory: [
      { remedy: "LYCOPODIUM", potency: "30C", createdDate: "12th Nov, 2026 03:10 PM" }
    ],
    appointments: [
      { date: "12th Nov, 2026", mode: "In Clinic", time: "15:00", charge: "500.00", status: "Closed" }
    ]
  },
  {
    id: "06981",
    fileId: "06981",
    firstName: "Nency",
    lastName: "Hiren Viradiya",
    email: "hirenviradiy21@gmail.com",
    mobile: "7043260778",
    dob: "1997-09-10",
    age: "29 years",
    gender: "Female",
    maritalStatus: "Married",
    reference: "Hiren",
    education: "M.Com",
    occupation: "Teacher",
    branch: "Head Branch",
    bloodGroup: "Not Known",
    address: "Katargam, Surat",
    note: "Joint pains aggravated in cold weather.",
    createdDate: "07th Nov, 2026",
    remedyHistory: [
      { remedy: "RHUS TOX", potency: "200CH", createdDate: "07th Nov, 2026 10:45 AM" }
    ],
    appointments: [
      { date: "07th Nov, 2026", mode: "In Clinic", time: "10:30", charge: "500.00", status: "Closed" }
    ]
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: "apt-1",
    patientName: "Mukeshbhai Akbari",
    fileId: "01584",
    time: "10:50 To 11:00",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Closed"
  },
  {
    id: "apt-2",
    patientName: "Ronika Rahul Goti",
    fileId: "06263",
    time: "11:20 To 11:30",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Closed"
  },
  {
    id: "apt-3",
    patientName: "Rahul Subhashbhai Goti",
    fileId: "06862",
    time: "11:30 To 11:40",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Closed"
  },
  {
    id: "apt-4",
    patientName: "SANJAYBHAI VALLABHBHAI VALA",
    fileId: "06639",
    time: "15:21 To 15:31",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Closed"
  },
  {
    id: "apt-5",
    patientName: "Nishiv Viraj Kansagra",
    fileId: "0842",
    time: "15:31 To 15:41",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Closed"
  },
  {
    id: "apt-6",
    patientName: "granth yogeshbhai ukani",
    fileId: "0437",
    time: "17:01 To 17:11",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "In"
  },
  {
    id: "apt-7",
    patientName: "Hanish Dharmeshbhai Devani",
    fileId: "05490",
    time: "17:11 To 17:21",
    branch: "Head Branch",
    date: "2026-11-19",
    type: "In Clinic",
    charge: "500.00",
    status: "Confirmed"
  }
];

const INITIAL_EXPENSES = [
  { branch: "Head Branch", title: "Medicinal Sugar of Milk & Bottles", amount: 1800, date: "19th Nov, 2026" },
  { branch: "Head Branch", title: "Clinic Disinfection & Sanitization", amount: 650, date: "18th Nov, 2026" }
];

const MATERIA_MEDICA_DB = [
  {
    name: "Sulphur",
    commonName: "Sublimed Sulphur",
    keynotes: "King of anti-psorics. Great heat in palms and soles, kicks off blankets. Irritable, philosophical mind. Hungry at 11 AM.",
    mind: "Selfish, critical, easily irritated, hurried movements, intellectual daydreamer.",
    modalities: "Aggravation: Warmth, bathing, night, standing. Amelioration: Dry warm weather, open air."
  },
  {
    name: "Lycopodium Clavatum",
    commonName: "Club Moss",
    keynotes: "Right-sided complaints. Craves sweets and warm drinks. Severe bloating 4 PM to 8 PM.",
    mind: "Lack of self-confidence yet tyrannical at home. Fear of public speaking, irritable on waking.",
    modalities: "Aggravation: 4 to 8 PM, right side, pressure of clothes. Amelioration: Warm food and drinks, motion."
  },
  {
    name: "Nux Vomica",
    commonName: "Poison Nut",
    keynotes: "Sedentary habits, high stress, excessive stimulants. Extremely chilly. Ineffective urging for stool.",
    mind: "Fiery, impatient, ambitious, cannot tolerate noise, light or contradiction.",
    modalities: "Aggravation: Morning on waking, cold air, mental exertion. Amelioration: Evening, resting, warmth."
  },
  {
    name: "Pulsatilla Pratensis",
    commonName: "Wind Flower",
    keynotes: "Mild, gentle, weeping disposition. Thirstless with dry mouth. Symptoms ever changing.",
    mind: "Seeks consolation, affectionate, easily moved to tears, fears darkness and loneliness.",
    modalities: "Aggravation: Warm close room, rich greasy food, evening. Amelioration: Open fresh air, gentle walking."
  },
  {
    name: "Natrum Muriaticum",
    commonName: "Sodium Chloride",
    keynotes: "Ailments from grief and emotional disappointment. Mapping on tongue. Severe throbbing headaches.",
    mind: "Introverted, dwells on past grievances, aggravated by consolation, seeks solitude to weep.",
    modalities: "Aggravation: 10 to 11 AM, sun heat, mental exertion. Amelioration: Open air, fasting."
  },
  {
    name: "Arsenicum Album",
    commonName: "White Oxide of Arsenic",
    keynotes: "Great prostration with intense anguish and restlessness. Burning pains relieved by heat. Thirst for small sips.",
    mind: "Extreme anxiety about health, fear of death, fastidious, needs everything orderly.",
    modalities: "Aggravation: Midnight 1 to 2 AM, cold drinks. Amelioration: Warm applications, hot food."
  }
];

// ==========================================
// 2. STATE STORAGE MANAGER
// ==========================================

class ClinicStore {
  constructor() {
    this.patients = this.load("_patients", INITIAL_PATIENTS);
    this.appointments = this.load("_appointments", INITIAL_APPOINTMENTS);
    this.expenses = this.load("_expenses", INITIAL_EXPENSES);
    this.activePatientId = "0842";
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem("_patients", JSON.stringify(this.patients));
      localStorage.setItem("_appointments", JSON.stringify(this.appointments));
      localStorage.setItem("_expenses", JSON.stringify(this.expenses));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }

  getPatient(id) {
    return this.patients.find(p => p.id === id || p.fileId === id);
  }

  addPatient(patient) {
    this.patients.unshift(patient);
    this.save();
  }

  updatePatient(id, updated) {
    const idx = this.patients.findIndex(p => p.id === id || p.fileId === id);
    if (idx !== -1) {
      this.patients[idx] = { ...this.patients[idx], ...updated };
      this.save();
    }
  }

  deletePatient(id) {
    this.patients = this.patients.filter(p => p.id !== id && p.fileId !== id);
    this.save();
  }

  addAppointment(appt) {
    this.appointments.unshift(appt);
    this.save();
  }

  updateAppointmentStatus(id, newStatus) {
    const appt = this.appointments.find(a => a.id === id);
    if (appt) {
      appt.status = newStatus;
      this.save();
    }
  }

  addExpense(expense) {
    this.expenses.unshift(expense);
    this.save();
  }
}

const store = new ClinicStore();

// ==========================================
// 3. NAVIGATION & VIEW ROUTER
// ==========================================

function navigateTo(viewId, param = null) {
  // Update sidebar active classes
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    }
  });

  // Hide all views
  document.querySelectorAll(".app-view").forEach(v => v.style.display = "none");

  // Show target view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.style.display = "block";
  }

  // Update Topbar Title
  const titles = {
    "dashboard": "Dashboard",
    "patients": "Patient Management",
    "add-patient": "Add New Patient",
    "edit-patient": "Edit Patient",
    "patient-details": "Patient 360° Record",
    "appointment-details": "Appointment Details & Schedule",
    "book-appointment": "Book Appointment",
    "prescription": "Prescriptions & Case Records",
    "materia-medica": "Materia Medica Reference",
    "clinic-info": "Clinic Information & Doctors"
  };
  document.getElementById("page-header-title").textContent = titles[viewId] || " Homoeopathy";

  // View specific setups
  if (viewId === "dashboard") {
    renderDashboard();
  } else if (viewId === "patients") {
    renderPatientsTable();
  } else if (viewId === "appointment-details") {
    renderAppointmentSlots();
  } else if (viewId === "book-appointment") {
    initBookingWizard();
  } else if (viewId === "patient-details") {
    if (param) store.activePatientId = param;
    renderPatientDetailsView(store.activePatientId);
  } else if (viewId === "edit-patient") {
    if (param) populateEditPatientForm(param);
  } else if (viewId === "materia-medica") {
    renderMateriaMedica();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  submenu.classList.toggle("open");
}

// ==========================================
// 4. DYNAMIC AGE CALCULATION
// ==========================================

function calculateAge(dobInputId, ageOutputId) {
  const dobVal = document.getElementById(dobInputId).value;
  const ageInput = document.getElementById(ageOutputId);
  if (!dobVal) {
    ageInput.value = "0 day";
    return;
  }

  const birthDate = new Date(dobVal);
  // Default to system clinic date: 2026-11-19
  const today = new Date("2026-11-19");

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    days += 30;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 1) {
    ageInput.value = `${years} years`;
  } else if (years === 1) {
    ageInput.value = "1 year";
  } else if (months > 0) {
    ageInput.value = `${months} months`;
  } else if (days > 0) {
    ageInput.value = `${days} days`;
  } else {
    ageInput.value = "0 day";
  }
}

// Helper to choose file names in UI
function handleFileSelect(input, targetSpanId) {
  if (input.files && input.files[0]) {
    document.getElementById(targetSpanId).textContent = input.files[0].name;
  }
}

// ==========================================
// 5. DASHBOARD VIEW (Image 12)
// ==========================================

function renderDashboard() {
  const tbody = document.getElementById("dashboard-appointments-tbody");
  tbody.innerHTML = "";

  const todays = store.appointments.filter(a => a.date === "2026-11-19");

  todays.forEach(appt => {
    const tr = document.createElement("tr");

    let statusHtml = "";
    if (appt.status === "Closed") {
      statusHtml = `<span class="status-badge status-closed">Closed</span>`;
    } else if (appt.status === "In") {
      statusHtml = `
        <button class="btn btn-outline-success btn-xs" onclick="changeApptStatus('${appt.id}', 'In')">In</button>
        <button class="btn btn-outline-danger btn-xs" onclick="changeApptStatus('${appt.id}', 'Closed')">Close</button>
      `;
    } else {
      statusHtml = `
        <button class="btn btn-outline-success btn-xs" onclick="changeApptStatus('${appt.id}', 'In')">In</button>
        <button class="btn btn-outline-danger btn-xs" onclick="changeApptStatus('${appt.id}', 'Closed')">Close</button>
      `;
    }

    tr.innerHTML = `
      <td><b>${appt.patientName}</b></td>
      <td>${appt.fileId}</td>
      <td>${appt.time}</td>
      <td>${appt.branch}</td>
      <td>${statusHtml}</td>
      <td>
        <button class="btn btn-outline-primary btn-xs" onclick="viewPatientDetails('${appt.fileId}')">Detail</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderExpensesList();
}

function renderExpensesList() {
  const container = document.getElementById("expense-history-list");
  if (!store.expenses.length) {
    container.innerHTML = "No expenses recorded today.";
    return;
  }

  let html = `<div style="font-weight: 600; margin-bottom: 6px;">Recent Expenses:</div><ul style="list-style-type: disc; padding-left: 20px;">`;
  store.expenses.slice(0, 4).forEach(exp => {
    html += `<li><b>${exp.branch}:</b> ${exp.title} — ₹${exp.amount} <span style="color:#94a3b8; font-size:11px;">(${exp.date})</span></li>`;
  });
  html += `</ul>`;
  container.innerHTML = html;
}

function handleSaveExpense() {
  const branch = document.getElementById("expense-branch").value;
  const title = document.getElementById("expense-title").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);

  if (!title || isNaN(amount) || amount <= 0) {
    showToast("Please enter an expense title and valid amount.", "danger");
    return;
  }

  store.addExpense({
    branch,
    title,
    amount,
    date: "19th Nov, 2026"
  });

  document.getElementById("expense-title").value = "";
  document.getElementById("expense-amount").value = "0";
  renderExpensesList();
  showToast("Clinic expense saved successfully!", "success");
}

function changeApptStatus(apptId, newStatus) {
  store.updateAppointmentStatus(apptId, newStatus);
  renderDashboard();
  renderAppointmentSlots();
  showToast(`Appointment status updated to: ${newStatus}`, "success");
}

// ==========================================
// 6. PATIENT LIST VIEW (Image 2)
// ==========================================

function renderPatientsTable() {
  const tbody = document.getElementById("patients-table-tbody");
  tbody.innerHTML = "";

  const branchFilter = document.getElementById("patient-branch-filter").value;
  const search = document.getElementById("patient-search-input").value.toLowerCase().trim();
  const perPage = parseInt(document.getElementById("patients-per-page").value) || 10;

  let filtered = store.patients.filter(p => {
    const matchesBranch = branchFilter === "All" || p.branch === branchFilter;
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchesSearch = !search ||
      fullName.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search)) ||
      (p.mobile && p.mobile.includes(search)) ||
      (p.fileId && p.fileId.toLowerCase().includes(search)) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(search));
    return matchesBranch && matchesSearch;
  });

  filtered = filtered.slice(0, perPage);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #94a3b8;">No patients found matching your search.</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="patient-cell">
          <div class="patient-avatar-placeholder">👤</div>
          <div>
            <div style="font-weight: 600; color: #1e293b;">${p.firstName} ${p.lastName}</div>
          </div>
        </div>
      </td>
      <td>${p.email || "--"}</td>
      <td>${p.mobile || "--"}</td>
      <td><b>${p.fileId}</b></td>
      <td>${p.bloodGroup || "Not Known"}</td>
      <td>${p.createdDate || "19th Nov, 2026"}</td>
      <td>
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-xs" onclick="openEditPatient('${p.fileId}')">Edit</button>
          <button class="btn btn-outline-danger btn-xs" onclick="handleDeletePatient('${p.fileId}')">Delete</button>
          <button class="btn btn-outline-primary btn-xs" onclick="viewPatientDetails('${p.fileId}')">Details</button>
          <button class="btn btn-outline-secondary btn-xs" onclick="startBookingForPatient('${p.fileId}')">Book Appointment</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleDeletePatient(fileId) {
  const patient = store.getPatient(fileId);
  if (!patient) return;

  if (confirm(`Are you sure you want to delete patient record: ${patient.firstName} ${patient.lastName} (File ID: ${patient.fileId})?`)) {
    store.deletePatient(fileId);
    renderPatientsTable();
    showToast(`Patient ${patient.fileId} removed.`, "danger");
  }
}

// ==========================================
// 7. ADD & EDIT PATIENT (Images 1 & 3)
// ==========================================

function handleSavePatient(isEdit = false) {
  const prefix = isEdit ? "edit-" : "p-";

  const firstName = document.getElementById(`${prefix}first-name`).value.trim();
  const lastName = document.getElementById(`${prefix}last-name`).value.trim();
  const email = document.getElementById(`${prefix}email`).value.trim();
  const occupation = document.getElementById(`${prefix}occupation`).value.trim();
  const fileId = document.getElementById(`${prefix}file-id`).value.trim();
  const mobile = document.getElementById(`${prefix}mobile`).value.trim();
  const dob = document.getElementById(`${prefix}dob`).value;
  const age = document.getElementById(`${prefix}age`).value;
  const reference = document.getElementById(`${prefix}reference`).value.trim();
  const maritalStatus = document.getElementById(`${prefix}marital-status`).value;
  const education = document.getElementById(`${prefix}education`).value.trim();
  const genderRadio = document.querySelector(`input[name="${prefix}gender"]:checked`);
  const gender = genderRadio ? genderRadio.value : "Male";
  const branchRadio = document.querySelector(`input[name="${prefix}branch"]:checked`);
  const branch = branchRadio ? branchRadio.value : "Head Branch";
  const bloodGroup = document.getElementById(`${prefix}blood-group`).value;
  const address = document.getElementById(`${prefix}address`).value.trim();
  const note = document.getElementById(`${prefix}note`).value.trim();

  if (!firstName || !lastName || !fileId || !mobile || !dob || !address) {
    showToast("Please fill all required (*) fields.", "danger");
    return;
  }

  if (isEdit) {
    const origId = document.getElementById("edit-original-id").value;
    store.updatePatient(origId, {
      firstName,
      lastName,
      email,
      occupation,
      fileId,
      mobile,
      dob,
      age,
      reference,
      maritalStatus,
      education,
      gender,
      branch,
      bloodGroup,
      address,
      note
    });
    showToast(`Patient record ${fileId} updated successfully!`, "success");
    navigateTo("patients");
  } else {
    // Check duplicate file ID
    if (store.getPatient(fileId)) {
      showToast(`File ID ${fileId} already exists! Use a unique File ID.`, "danger");
      return;
    }

    const newPatient = {
      id: fileId,
      fileId,
      firstName,
      lastName,
      email,
      occupation,
      mobile,
      dob,
      age,
      reference,
      maritalStatus,
      education,
      gender,
      branch,
      bloodGroup,
      address,
      note,
      createdDate: "19th Nov, 2026",
      remedyHistory: [],
      appointments: [],
      followUps: []
    };

    store.addPatient(newPatient);
    showToast(`Patient ${firstName} ${lastName} added successfully!`, "success");
    document.getElementById("add-patient-form").reset();
    navigateTo("patients");
  }
}

function openEditPatient(fileId) {
  const p = store.getPatient(fileId);
  if (!p) return;
  populateEditPatientForm(p);
  navigateTo("edit-patient");
}

function populateEditPatientForm(p) {
  if (typeof p === "string") p = store.getPatient(p);
  if (!p) return;

  document.getElementById("edit-original-id").value = p.fileId;
  document.getElementById("edit-first-name").value = p.firstName;
  document.getElementById("edit-last-name").value = p.lastName;
  document.getElementById("edit-email").value = p.email || "";
  document.getElementById("edit-occupation").value = p.occupation || "";
  document.getElementById("edit-file-id").value = p.fileId;
  document.getElementById("edit-mobile").value = p.mobile;
  document.getElementById("edit-dob").value = p.dob;
  document.getElementById("edit-age").value = p.age || "4 months";
  document.getElementById("edit-reference").value = p.reference || "";
  document.getElementById("edit-marital-status").value = p.maritalStatus || "";
  document.getElementById("edit-education").value = p.education || "";

  const genderRadio = document.querySelector(`input[name="edit-gender"][value="${p.gender}"]`);
  if (genderRadio) genderRadio.checked = true;

  const branchRadio = document.querySelector(`input[name="edit-branch"][value="${p.branch}"]`);
  if (branchRadio) branchRadio.checked = true;

  document.getElementById("edit-blood-group").value = p.bloodGroup || "Not Known";
  document.getElementById("edit-address").value = p.address;
  document.getElementById("edit-note").value = p.note || "";
}

// ==========================================
// 8. PATIENT 360° DETAILS VIEW (Images 4-8)
// ==========================================

function viewPatientDetails(fileId) {
  store.activePatientId = fileId;
  navigateTo("patient-details", fileId);
}

function switchDetailTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-tab") === tabId) btn.classList.add("active");
  });

  document.querySelectorAll(".detail-tab-pane").forEach(pane => {
    pane.style.display = "none";
  });

  const activePane = document.getElementById(tabId);
  if (activePane) activePane.style.display = "block";
}

function renderPatientDetailsView(fileId) {
  const p = store.getPatient(fileId) || store.patients[0];
  if (!p) return;

  // Banner
  document.getElementById("detail-patient-heading").innerHTML = `
    ${p.firstName} ${p.lastName} <span style="font-weight: 500; color: #64748b; font-size: 15px;">(File ID: ${p.fileId})</span>
  `;

  // Tab 1: Personal Details (Image 4)
  document.getElementById("kv-file-id").textContent = p.fileId;
  document.getElementById("kv-name").textContent = `${p.firstName} ${p.lastName}`;
  document.getElementById("kv-email").textContent = p.email || "--";
  document.getElementById("kv-dob").textContent = p.dob ? formatDatePretty(p.dob) : "--";
  document.getElementById("kv-age").textContent = p.age || "--";
  document.getElementById("kv-gender").textContent = p.gender || "Male";
  document.getElementById("kv-mobile").textContent = p.mobile;
  document.getElementById("kv-marital").textContent = p.maritalStatus || "--";
  document.getElementById("kv-reference").textContent = p.reference || "--";
  document.getElementById("kv-education").textContent = p.education || "--";
  document.getElementById("kv-address").textContent = p.address;
  document.getElementById("kv-occupation").textContent = p.occupation || "--";
  document.getElementById("kv-blood-group").textContent = p.bloodGroup || "Not Known";
  document.getElementById("kv-image").textContent = "--";

  // Tab 2: Appointment Details (Image 5)
  const apptTimeline = document.getElementById("patient-appointments-timeline");
  apptTimeline.innerHTML = "";
  const appts = p.appointments && p.appointments.length > 0
    ? p.appointments
    : [{ date: "19th Nov, 2026", mode: "In Clinic", time: "15:31", charge: "500.00" }];

  appts.forEach(a => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        ${a.date} &nbsp;•&nbsp; Appointment By: ${a.mode} &nbsp;•&nbsp; Time: ${a.time} &nbsp;•&nbsp; Charge: ${a.charge}
      </div>
    `;
    apptTimeline.appendChild(item);
  });

  // Tab 3: Case Taking (Image 6)
  document.getElementById("case-sheet-meta-info").innerHTML = `
    <b>Name:</b> ${p.firstName} ${p.lastName} &nbsp;|&nbsp; <b>File ID:</b> ${p.fileId} &nbsp;|&nbsp; <b>Age/Sex:</b> ${p.age} / ${p.gender}<br>
    <b>Address:</b> ${p.address} &nbsp;|&nbsp; <b>Contact:</b> ${p.mobile} &nbsp;|&nbsp; <b>Date:</b> 19th Nov, 2026
  `;
  if (p.caseSheet) {
    document.getElementById("case-present-complaints").value = p.caseSheet.presentComplaints || "";
    document.getElementById("case-past-history").value = p.caseSheet.pastHistory || "";
    document.getElementById("case-family-history").value = p.caseSheet.familyHistory || "";
    document.getElementById("case-treatment-history").value = p.caseSheet.treatmentHistory || "";
    document.getElementById("case-birth-history").value = p.caseSheet.birthHistory || "";
    document.getElementById("case-gyn-history").value = p.caseSheet.gynHistory || "";
    document.getElementById("case-appetite").value = p.caseSheet.appetite || "";
    document.getElementById("case-desires").value = p.caseSheet.desires || "";
    document.getElementById("case-thermal").value = p.caseSheet.thermal || "Chilly";
    document.getElementById("case-sleep").value = p.caseSheet.sleep || "";
    document.getElementById("case-perspiration").value = p.caseSheet.perspiration || "";
    document.getElementById("case-mind-symptoms").value = p.caseSheet.mindSymptoms || "";
    document.getElementById("case-rubrics").value = p.caseSheet.rubrics || "";
    document.getElementById("case-remedy").value = p.caseSheet.remedy || "";
    document.getElementById("case-potency").value = p.caseSheet.potency || "";
    document.getElementById("case-dosage").value = p.caseSheet.dosage || "";
    document.getElementById("case-days").value = p.caseSheet.days || "";
  }

  // Tab 4: Follow Up (Image 7)
  renderFollowUpHistory(p);

  // Tab 5: Remedy History (Image 8)
  renderRemedyHistoryTable(p);

  // Tab 6: Print Preview
  document.getElementById("print-p-name").textContent = `${p.firstName} ${p.lastName}`;
  document.getElementById("print-p-file").textContent = p.fileId;
  document.getElementById("print-p-age").textContent = `${p.age} / ${p.gender}`;
}

function handleSaveCaseSheet() {
  const p = store.getPatient(store.activePatientId);
  if (!p) return;

  p.caseSheet = {
    presentComplaints: document.getElementById("case-present-complaints").value,
    pastHistory: document.getElementById("case-past-history").value,
    familyHistory: document.getElementById("case-family-history").value,
    treatmentHistory: document.getElementById("case-treatment-history").value,
    birthHistory: document.getElementById("case-birth-history").value,
    gynHistory: document.getElementById("case-gyn-history").value,
    appetite: document.getElementById("case-appetite").value,
    desires: document.getElementById("case-desires").value,
    thermal: document.getElementById("case-thermal").value,
    sleep: document.getElementById("case-sleep").value,
    perspiration: document.getElementById("case-perspiration").value,
    mindSymptoms: document.getElementById("case-mind-symptoms").value,
    rubrics: document.getElementById("case-rubrics").value,
    remedy: document.getElementById("case-remedy").value,
    potency: document.getElementById("case-potency").value,
    dosage: document.getElementById("case-dosage").value,
    days: document.getElementById("case-days").value
  };

  store.save();
  showToast("Case taking sheet saved successfully!", "success");
}

function printCaseSheet() {
  window.print();
}

function formatEditor(command) {
  document.execCommand(command, false, null);
  document.getElementById("fu-editor").focus();
}

function handleAddFollowUp() {
  const p = store.getPatient(store.activePatientId);
  if (!p) return;

  const note = document.getElementById("fu-editor").innerHTML.trim();
  const remedy = document.getElementById("fu-remedy").value.trim();
  const potency = document.getElementById("fu-potency").value.trim();

  if (!note || !remedy || !potency) {
    showToast("Please provide Follow Up notes, Remedy and Potency.", "danger");
    return;
  }

  const followUpItem = {
    date: "19th Nov, 2026",
    text: note,
    weight: document.getElementById("fu-weight").value.trim() || "--",
    bp: document.getElementById("fu-bp").value.trim() || "--",
    charge: document.getElementById("fu-charge").value.trim() || "500.00",
    takenBy: document.getElementById("fu-taken-by").value.trim() || "Dr. Divya Devani",
    remedy,
    potency,
    dosage: document.getElementById("fu-dosage").value.trim(),
    repetition: document.getElementById("fu-repetition").value.trim(),
    days: document.getElementById("fu-days").value.trim(),
    prescriptionType: document.getElementById("fu-prescription-type").value.trim()
  };

  if (!p.followUps) p.followUps = [];
  p.followUps.unshift(followUpItem);

  // Also add to remedy history
  if (!p.remedyHistory) p.remedyHistory = [];
  p.remedyHistory.unshift({
    remedy,
    potency,
    createdDate: "19th Nov, 2026 12:00 PM"
  });

  store.save();
  renderFollowUpHistory(p);
  renderRemedyHistoryTable(p);
  showToast("Follow-up visit record added successfully!", "success");
}

function renderFollowUpHistory(p) {
  const container = document.getElementById("follow-up-history-container");
  if (!p.followUps || p.followUps.length === 0) {
    container.innerHTML = `<div style="color: #94a3b8; text-align: center; padding: 16px;">No Data Available.</div>`;
    return;
  }

  let html = "";
  p.followUps.forEach((fu, idx) => {
    html += `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); padding: 14px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 700; color: #0284c7;">Visit #${p.followUps.length - idx} &nbsp;•&nbsp; ${fu.date}</span>
          <span style="font-size: 12px; color: #64748b;">Dr: ${fu.takenBy} | Fee: ₹${fu.charge}</span>
        </div>
        <div style="font-size: 13.5px; color: #334155; margin-bottom: 10px;">${fu.text}</div>
        <div style="display: flex; gap: 20px; font-size: 12.5px; color: #475569; background: #fff; padding: 8px 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
          <div><b>Weight:</b> ${fu.weight}</div>
          <div><b>BP:</b> ${fu.bp}</div>
          <div><b>Rx:</b> <span style="font-weight: 700; color: #16a34a;">${fu.remedy} (${fu.potency})</span></div>
          <div><b>Dosage:</b> ${fu.dosage || "1 dose"} (${fu.days || "15 days"})</div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function renderRemedyHistoryTable(p) {
  const tbody = document.getElementById("remedy-history-tbody");
  tbody.innerHTML = "";

  const list = p.remedyHistory || [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 20px;">No Data Available.</td></tr>`;
    document.getElementById("remedy-entry-count").textContent = "Showing 0 to 0 of 0 entries";
    return;
  }

  list.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>${r.remedy}</b></td>
      <td>${r.potency}</td>
      <td>${r.createdDate}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("remedy-entry-count").textContent = `Showing 1 to ${list.length} of ${list.length} entries`;
}

// ==========================================
// 9. APPOINTMENT SCHEDULE DETAILS (Image 11)
// ==========================================

function renderAppointmentSlots() {
  const container = document.getElementById("appointment-slots-container");
  container.innerHTML = "";

  const branchRadio = document.querySelector('input[name="sched-branch"]:checked');
  const selectedBranch = branchRadio ? branchRadio.value : "Head Branch";
  const selectedDate = document.getElementById("sched-date").value || "2026-11-19";

  const appts = store.appointments.filter(a => a.branch === selectedBranch && a.date === selectedDate);

  if (appts.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No appointments booked for this branch and date.</div>`;
    return;
  }

  appts.forEach(a => {
    const card = document.createElement("div");
    card.className = "slot-card";

    let actionsHtml = "";
    if (a.status !== "Closed") {
      actionsHtml = `
        <div class="slot-actions">
          <button class="btn btn-outline-primary btn-xs" onclick="changeApptStatus('${a.id}', 'Cancelled')">Cancel</button>
          <button class="btn btn-outline-success btn-xs" onclick="changeApptStatus('${a.id}', 'In')">In</button>
          <button class="btn btn-outline-danger btn-xs" onclick="changeApptStatus('${a.id}', 'Closed')">Close</button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="slot-card-header">
        <span class="slot-time">${a.time}</span>
        <span class="status-badge status-confirmed">Confirmed</span>
      </div>
      <div class="slot-info-row">
        <span class="slot-info-label">Name :</span> ${a.patientName}
      </div>
      <div class="slot-info-row">
        <span class="slot-info-label">Appointment By :</span> ${a.type}
      </div>
      <div class="slot-info-row">
        <span class="slot-info-label">Charge :</span> ${a.charge}
      </div>
      ${actionsHtml}
    `;
    container.appendChild(card);
  });
}

// ==========================================
// 10. BOOK APPOINTMENT WIZARD (Images 9 & 10)
// ==========================================

let bookingState = {
  step: 1,
  role: "old",
  patient: null,
  branch: "Head Branch",
  date: "2026-11-19",
  slot: "17:31 To 17:41",
  mode: "In Clinic",
  charge: 500.00
};

function initBookingWizard() {
  setBookingStep(1);
  setBookingRole("old");
}

function setBookingStep(step) {
  bookingState.step = step;
  [1, 2, 3].forEach(s => {
    const card = document.getElementById(`step-card-${s}`);
    const pane = document.getElementById(`book-step-${s}`);
    if (card) card.classList.toggle("active", s === step);
    if (pane) pane.style.display = s === step ? "block" : "none";
  });
}

function setBookingRole(role) {
  bookingState.role = role;
  const oldBtn = document.getElementById("btn-role-old");
  const newBtn = document.getElementById("btn-role-new");
  const oldPane = document.getElementById("booking-old-patient-pane");
  const newPane = document.getElementById("booking-new-patient-pane");

  if (role === "old") {
    oldBtn.className = "btn btn-primary";
    newBtn.className = "btn btn-outline-secondary";
    oldPane.style.display = "block";
    newPane.style.display = "none";
  } else {
    oldBtn.className = "btn btn-outline-secondary";
    newBtn.className = "btn btn-primary";
    oldPane.style.display = "none";
    newPane.style.display = "block";
  }
}

function handleCheckFileNumber() {
  const fileNo = document.getElementById("book-search-file-id").value.trim();
  if (!fileNo) {
    showToast("Please enter a file number to check.", "danger");
    return;
  }

  const p = store.getPatient(fileNo);
  const box = document.getElementById("verified-patient-box");

  if (p) {
    bookingState.patient = p;
    box.style.display = "block";
    box.innerHTML = `
      <div style="font-weight: 700; color: #16a34a; margin-bottom: 4px;">✓ Patient Verified:</div>
      <div style="font-size: 13.5px; color: #1e293b;">
        <b>${p.firstName} ${p.lastName}</b> &nbsp;|&nbsp; File ID: ${p.fileId} &nbsp;|&nbsp; Mob: ${p.mobile} &nbsp;|&nbsp; Branch: ${p.branch}
      </div>
    `;
    showToast(`Found patient: ${p.firstName} ${p.lastName}`, "success");
  } else {
    bookingState.patient = null;
    box.style.display = "block";
    box.innerHTML = `
      <div style="color: #dc2626; font-weight: 600;">✕ No patient found with File ID: "${fileNo}". Please check or switch to "New Patient".</div>
    `;
    showToast("Patient file ID not found.", "danger");
  }
}

function startBookingForPatient(fileId) {
  navigateTo("book-appointment");
  setBookingRole("old");
  document.getElementById("book-search-file-id").value = fileId;
  handleCheckFileNumber();
}

function proceedToBookingStep2() {
  if (bookingState.role === "old") {
    if (!bookingState.patient) {
      showToast("Please check and verify patient file number first.", "danger");
      return;
    }
  } else {
    // Validate new patient fields
    const name = document.getElementById("bk-new-name").value.trim();
    const email = document.getElementById("bk-new-email").value.trim();
    const mobile = document.getElementById("bk-new-mobile").value.trim();
    const address = document.getElementById("bk-new-address").value.trim();

    if (!name || !mobile || !address) {
      showToast("Please complete the required new patient fields.", "danger");
      return;
    }

    // Create temporary new patient object
    const newId = "0" + (Math.floor(Math.random() * 9000) + 1000);
    bookingState.patient = {
      id: newId,
      fileId: newId,
      firstName: name.split(" ")[0] || name,
      lastName: name.split(" ").slice(1).join(" ") || "",
      email,
      mobile,
      address,
      dob: document.getElementById("bk-new-dob").value,
      gender: document.querySelector('input[name="bk-new-gender"]:checked').value,
      bloodGroup: document.getElementById("bk-new-blood-group").value,
      branch: "Head Branch",
      isNew: true
    };
  }

  setBookingStep(2);
  renderBookingAvailableSlots();
}

const AVAILABLE_SLOTS = [
  "10:00 To 10:10", "10:10 To 10:20", "10:20 To 10:30", "10:30 To 10:40",
  "10:40 To 10:50", "10:50 To 11:00", "11:00 To 11:10", "11:10 To 11:20",
  "11:20 To 11:30", "11:30 To 11:40", "15:21 To 15:31", "15:31 To 15:41",
  "17:01 To 17:11", "17:11 To 17:21", "17:31 To 17:41", "17:41 To 17:51"
];

function renderBookingAvailableSlots() {
  const container = document.getElementById("bk-available-slots-container");
  container.innerHTML = "";

  const branch = document.getElementById("bk-slot-branch").value;
  const date = document.getElementById("bk-slot-date").value;
  bookingState.branch = branch;
  bookingState.date = date;

  const bookedSlots = store.appointments
    .filter(a => a.branch === branch && a.date === date && a.status !== "Cancelled")
    .map(a => a.time);

  AVAILABLE_SLOTS.forEach(slot => {
    const isBooked = bookedSlots.includes(slot);
    const chip = document.createElement("div");
    chip.style.cssText = `
      border: 1px solid ${isBooked ? "#e2e8f0" : "#00a8e8"};
      background: ${isBooked ? "#f1f5f9" : (bookingState.slot === slot ? "#e0f2fe" : "#ffffff")};
      color: ${isBooked ? "#94a3b8" : "#1e293b"};
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      text-align: center;
      cursor: ${isBooked ? "not-allowed" : "pointer"};
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
    `;

    chip.innerHTML = `
      <div>${slot}</div>
      <div style="font-size: 11px; color: ${isBooked ? "#dc2626" : "#0284c7"};">${isBooked ? "Booked" : "Available"}</div>
    `;

    if (!isBooked) {
      chip.onclick = () => {
        bookingState.slot = slot;
        renderBookingAvailableSlots();
      };
    }

    container.appendChild(chip);
  });
}

function proceedToBookingStep3() {
  if (!bookingState.slot) {
    showToast("Please choose an available appointment slot.", "danger");
    return;
  }

  setBookingStep(3);

  // Update Summary
  const p = bookingState.patient;
  document.getElementById("bk-summary-patient").textContent = `${p.firstName} ${p.lastName} (${p.fileId})`;
  document.getElementById("bk-summary-date").textContent = `${bookingState.branch} • ${formatDatePretty(bookingState.date)}`;
  document.getElementById("bk-summary-slot").textContent = bookingState.slot;
  updateBookingCharge();
}

function updateBookingCharge() {
  const modeRadio = document.querySelector('input[name="bk-mode"]:checked');
  const mode = modeRadio ? modeRadio.value : "In Clinic";
  bookingState.mode = mode;
  bookingState.charge = mode === "Online Video" ? 700.00 : 500.00;
  document.getElementById("bk-total-charge").textContent = `₹ ${bookingState.charge.toFixed(2)}`;
}

function confirmAppointmentBooking() {
  const p = bookingState.patient;

  // If new patient, register in store
  if (p.isNew) {
    delete p.isNew;
    p.createdDate = "19th Nov, 2026";
    store.addPatient(p);
  }

  const newAppt = {
    id: "apt-" + Date.now(),
    patientName: `${p.firstName} ${p.lastName}`,
    fileId: p.fileId,
    time: bookingState.slot,
    branch: bookingState.branch,
    date: bookingState.date,
    type: bookingState.mode,
    charge: bookingState.charge.toFixed(2),
    status: "Confirmed"
  };

  store.addAppointment(newAppt);

  showToast(`Appointment confirmed for ${p.firstName} at ${bookingState.slot}!`, "success");
  navigateTo("appointment-details");
}

// ==========================================
// 11. MATERIA MEDICA SEARCH (Clinical Reference)
// ==========================================

function renderMateriaMedica() {
  const container = document.getElementById("materia-medica-container");
  container.innerHTML = "";
  const query = document.getElementById("mm-search")?.value.toLowerCase().trim() || "";

  const filtered = MATERIA_MEDICA_DB.filter(m =>
    !query ||
    m.name.toLowerCase().includes(query) ||
    m.commonName.toLowerCase().includes(query) ||
    m.keynotes.toLowerCase().includes(query) ||
    m.mind.toLowerCase().includes(query)
  );

  filtered.forEach(m => {
    const card = document.createElement("div");
    card.className = "slot-card";
    card.style.background = "#fff";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <span style="font-weight: 800; font-size: 15px; color: #0284c7;">${m.name}</span>
        <span style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px;">${m.commonName}</span>
      </div>
      <div style="font-size: 12.5px; line-height: 1.5; color: #334155;">
        <b>Keynotes:</b> ${m.keynotes}
      </div>
      <div style="font-size: 12.5px; line-height: 1.5; color: #475569;">
        <b>Mind:</b> ${m.mind}
      </div>
      <div style="font-size: 12px; color: #64748b; font-style: italic;">
        ${m.modalities}
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================
// 12. UTILITIES & TOASTS
// ==========================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === "success" ? "✓" : "⚠️"}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatDatePretty(dateStr) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const day = d.getDate();
  const suffix = (day === 1 || day === 21 || day === 31) ? "st"
    : (day === 2 || day === 22) ? "nd"
      : (day === 3 || day === 23) ? "rd" : "th";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}${suffix} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

// Auto-initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  navigateTo("dashboard");
});

