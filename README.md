#  Homoeopathy - React Web Application

**Advanced Neuro-psychiatric Homoeopathy**  
Chief Consultant: **Dr. Divya Devani** (B.H.M.S., MD Hom.)

A fully functional **React (Vite + Modern ES Modules)** clinic management & electronic medical record (EMR) application built exactly according to all 12 provided UI design images.

---

## 🏗️ Architecture & Component Hierarchy

```
-homeopathy-clinic/
├── src/
│   ├── main.jsx                       # React entry point
│   ├── App.jsx                        # Main state, routing & CRUD coordinator
│   ├── index.css                      # Complete styling, CSS tokens & print styles
│   ├── data/
│   │   └── mockData.js                # Initial dataset matching all 12 screenshots
│   └── components/
│       ├── Sidebar.jsx                #  leaf badge, navigation & doctor profile
│       ├── Navbar.jsx                 # Quick actions (+ Book Appointment, + Add Patient)
│       ├── Dashboard.jsx              # Today's appointments, clinic expenses, duty info (Img 12)
│       ├── PatientList.jsx            # Search, branch filter, table actions (Img 2)
│       ├── PatientForm.jsx            # Add & Edit forms with dynamic age calculation (Img 1 & 3)
│       ├── PatientDetails.jsx         # 6-Tab Patient 360° view (Img 4, 5, 6, 7, 8)
│       ├── AppointmentSchedule.jsx    # Live schedule cards by date/branch (Img 11)
│       ├── BookAppointmentWizard.jsx  # 3-Step Wizard: Old/New patient, slot, payment (Img 9 & 10)
│       ├── MateriaMedica.jsx          # Homeopathy remedy & keynote search
│       ├── ClinicInfo.jsx             # Doctor profile, branches & clinic timings
│       └── Toast.jsx                  # Floating alert notifications
├── dist/                              # Pre-built production bundle (ready to serve!)
├── index.html                         # Vite root HTML
├── vite.config.js                     # Vite React configuration
├── package.json                       # Scripts: dev, build, preview
├── server.js                          # Node.js production & preview server
└── start.bat                          # 1-click Windows runner
```

---

## ✨ Features & Functionality (All 12 Screenshots Covered)

1. **Dashboard** (*Image 12*):
   - **Today's Appointments** table with status badges (`Closed`, `In`, `Confirmed`).
   - Direct status triage actions (`In` clinic, `Close` consultation).
   - **Clinic Extra Expenses** recorder with branch dropdown and running expense history.
   - **Duty Information** banner featuring the circular *Advanced Neuro-psychiatric Homoeopathy* brain emblem and clinic hours.
   - Holidays & Upcoming Events tables.

2. **Patient Directory** (*Image 2*):
   - Branch filter (`Head Branch`, `Pal Branch`, ` Camp`, `All Branches`).
   - Instant search across `Name`, `Email`, `Mobile`, `File ID`, and `Blood Group`.
   - Action buttons: `Edit`, `Delete`, `Details`, and `Book Appointment`.
   - Seeded with patient records from screenshots (*Nishiv Viraj Kansagra 0842, Vipex Dhanjibhai Jasoliya 06986, Keyur Mukheshbhai Patel 06985, Bhumika Rakesh Kathiriya 06984, Aditi Raviprakash Rajput 06982, Bhakti Pansala 06983, Nency Viradiya 06981*).

3. **Add & Edit Patient** (*Images 1 & 3*):
   - First and Last name, Email, Occupation, File ID, Mobile Number, Reference, Marital Status, Education, Gender, Branch, Blood Group, Profile Image upload, Address, and Notes.
   - **Real-Time Dynamic Age Calculation**: Auto-calculates age (e.g., `4 months`, `28 years`, `0 day`) dynamically as soon as the birth date changes.

4. **Patient 360° Comprehensive Record** (*Images 4, 5, 6, 7, 8*):
   - **Tab 1: Personal Details**: 2-column biographical and demographic cards.
   - **Tab 2: Appointment Details**: Timeline of consultations with date, mode, time, and fee.
   - **Tab 3: Case Taking**: Classical homoeopathy clinical intake (Chief complaints, modalities, past/family/treatment history, physical generals, thermals, sleep/dreams, mental symptoms, repertory rubrics, and initial prescription).
   - **Tab 4: Follow Up**: Clinical visit logger with rich formatting toolbar, vitals (`Weight`, `BP`), fee, remedy, potency, dosage, repetition, duration, and expandable past visit history.
   - **Tab 5: Remedy History**: Ledger of prescribed remedies (`SUL 0/1`, etc.) with timestamps.
   - **Tab 6: Print**: Printable prescription slip with official clinic letterhead, doctor credentials, and signature block.

5. **3-Step Appointment Booking Wizard** (*Images 9 & 10*):
   - **Step 1 (User Account)**:
     - **Old Patient**: Enter File ID (e.g., `0842`) and click `Check file number` to verify and auto-fill patient profile.
     - **New Patient**: Inline registration form with dynamic file ID generation.
   - **Step 2 (Select Slot)**: Select branch, date, and interactive 10-minute slot chips with booked vs. available indicators.
   - **Step 3 (Payment)**: Select consultation mode (`In Clinic` ₹500 / `Online Video` ₹700), payment method, and confirm booking.

6. **Appointment Schedule Cards** (*Image 11*):
   - Branch filter radio & Date picker.
   - Time slot cards with patient name, consultation fee, and instant `Cancel`, `In`, and `Close` buttons.

7. **Materia Medica & Clinic Info**:
   - Quick clinical search reference for homeopathic remedies and neuro-psychiatric keynotes.
   - Doctor credentials and branch locations.

---

## 🚀 How to Run

### Development Server:
```bash
cd "C:\Users\Administrator\.gemini\antigravity\scratch\-homeopathy-clinic"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173).

### Production Server:
```bash
npm run build
node server.js
```
Open [http://localhost:3000](http://localhost:3000).

### Windows 1-Click Launcher:
Double click [start.bat](file:///C:/Users/Administrator/.gemini/antigravity/scratch/-homeopathy-clinic/start.bat).


---

## 🌐 Cloud Deployment with Render (Data Sync Backend) + Netlify (Live Site)

To host your website live so that all users and devices worldwide share the same centralized database in real-time:

### Step 1: Deploy Backend to Render.com (Free)
1. Go to [https://dashboard.render.com/](https://dashboard.render.com/) and sign in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository (`homoeopathic-clinic`).
4. Set the following options:
   - **Name**: `homoeopathic-clinic-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
5. Click **Create Web Service**.
6. Once deployed, Render will provide a free live URL, for example:
   ```
   https://homoeopathic-clinic-backend.onrender.com
   ```

### Step 2: Link Netlify to Your Render Backend
1. Go to your Netlify dashboard for your clinic website.
2. Navigate to **Site configuration** > **Environment variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://homoeopathic-clinic-backend.onrender.com` (your Render URL from Step 1)
4. Trigger a **Clear cache and deploy site** on Netlify.

Now, all users visiting your Netlify site will automatically connect to your centralized Render backend. Any patient added, appointment booked, or status changed will immediately synchronize to all users across all devices in real-time!
