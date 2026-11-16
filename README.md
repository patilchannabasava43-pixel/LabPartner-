# LabPartner Finder 🎓

> **A modern, full-stack academic study partner matchmaking web application for college and university students.**

LabPartner Finder empowers students to connect with peers taking identical coursework, sharing compatible study styles, having overlapping weekly schedules, and pursuing shared laboratory and project goals.

---

## 🚀 Key Features

1. **Authentication & Identity**:
   - Secure student registration and login with bcrypt password hashing.
   - Dual-mode JWT authentication (HttpOnly secure cookies + Bearer token in headers).
   - Rate limiting on authentication routes to mitigate brute-force attempts.
2. **Student Profile Engine**:
   - Detailed academic attributes: Department, Year of Study, Subjects, Skills, Interests, and Study Goals.
   - Granular weekly schedule matrix ($7 \text{ days} \times 3 \text{ time slots}$: Morning, Afternoon, Evening).
   - Dynamic profile completion calculation (0–100%) with actionable next steps.
3. **Smart Compatibility Matching Algorithm**:
   - 100% deterministic Jaccard Similarity model across 4 weighted academic dimensions:
     - **Shared Subjects (35%)**
     - **Availability Schedule Overlap (30%)**
     - **Shared Academic Interests (20%)**
     - **Compatible Study Goals (15%)**
   - 5 color-coded match tiers: *Excellent Match* (90–100%), *Great Match* (75–89%), *Good Match* (60–74%), *Moderate Match* (40–59%), and *Low Match* (0–39%).
   - Detailed synergy breakdown modal with why-you-match explanation statements and missing-data safety warnings.
4. **Find Study Partners Directory**:
   - Live debounced search across names, majors, colleges, subjects, skills, and interests.
   - Multi-criteria filter sidebar: Multi-subject selection, custom subject adder, day pills, time window toggles, academic interests, department dropdown, and minimum compatibility slider.
   - Sorting options: *Best Match*, *Most Shared Subjects*, *Most Shared Interests*, *Most Available Time Overlap*, *Recently Joined*, and *Alphabetical*.
   - Pagination and responsive mobile filter drawer.
5. **Partner Request & Collaboration Center**:
   - Outgoing and incoming request tracking with custom invitation messages.
   - Reciprocal request detection preventing duplicate or conflicting connections.
   - Atomic state transitions: *Pending*, *Accepted*, *Declined*, and *Cancelled*.
6. **My Partners Hub**:
   - Direct contact channels for accepted partners (Campus email, Discord, GitHub, LinkedIn).
   - Shared coursework pills and schedule preferences.
7. **SaaS Dashboard**:
   - Dynamic time-aware greeting (*"Good morning / afternoon / evening"*).
   - 4 metric tiles (Active Partners, Incoming Requests, Outgoing Requests, Recommendations).
   - Profile completion progress card, top recommendations feed, request action summary, and real-time activity log.

---

## 🛠 Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS
  - React Router v6
  - Lucide React Icons
  - Axios
- **Backend**:
  - Node.js & Express.js (REST API architecture)
  - Mongoose ODM & MongoDB
  - JSON Web Tokens (jsonwebtoken)
  - bcryptjs
  - express-validator & cookie-parser
  - express-rate-limit

---

## 📂 Project Architecture

```
labpartner-finder/
├── client/                     # Frontend React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios instance & Auth service
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── dashboard/      # Dashboard cards, top navbar & metrics
│   │   │   ├── discovery/      # Search bar, filter sidebar & pagination
│   │   │   ├── landing/        # Hero, features, testimonials, stats & CTA
│   │   │   ├── CompatibilityBadge.jsx
│   │   │   ├── CompatibilityModal.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── SchedulePicker.jsx
│   │   │   ├── SendRequestModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StudentCard.jsx
│   │   ├── context/            # AuthContext & Toast notifications
│   │   ├── pages/              # Route views (Landing, Dashboard, FindPartners, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/                     # Backend Express.js Server
    ├── config/                 # Database connection
    ├── middleware/             # Auth guards & centralized error handler
    ├── models/                 # User, StudentProfile & PartnerRequest schemas
    ├── routes/                 # Auth, Profile, Partners, Requests, Dashboard, Students
    ├── services/               # Matching service & Jaccard algorithms
    ├── utils/                  # Compatibility wrapper
    ├── server.js               # Application entry point
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (reference `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/labpartner_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 2. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (reference `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Start Backend Server
```bash
cd server
node server.js
# Server runs on http://localhost:5000
```

### Start Frontend Dev Server
```bash
cd client
npm run dev -- --host
# Client runs on http://localhost:3000
```

---

## 📡 Primary API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new student account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET  /api/auth/me` - Get authenticated student profile
- `POST /api/auth/logout` - Clear auth session & cookies
- `PUT  /api/auth/update-account` - Update name, college, major, year
- `PUT  /api/auth/update-password` - Change password

### Student Profile (`/api/profile` & `/api/profiles`)
- `GET  /api/profile/me` - Fetch authenticated user's complete profile
- `PUT  /api/profile/me` - Update coursework, skills, interests, availability
- `GET  /api/profile/:id` - Fetch public profile by ID

### Partner Discovery & Search (`/api/students`)
- `GET  /api/students` - Multi-filter search (supports `search`, `subjects`, `interests`, `days`, `timeSlots`, `department`, `yearOfStudy`, `studyMode`, `minScore`, `sort`, `page`, `limit`)
- `GET  /api/students/recommendations` - Top partner recommendations sorted by compatibility score
- `GET  /api/students/:id` - Public profile view with compatibility breakdown

### Collaboration Requests (`/api/requests`)
- `POST  /api/requests` - Send collaboration request
- `GET   /api/requests?type=incoming|outgoing` - View incoming or sent requests
- `PATCH /api/requests/:id/accept` - Accept incoming request
- `PATCH /api/requests/:id/reject` - Decline incoming request
- `PATCH /api/requests/:id/cancel` - Cancel outgoing request

### Partners Network (`/api/partners`)
- `GET  /api/partners` - List confirmed active partners
- `GET  /api/partners/stats` - Platform partnership metrics

### Dashboard (`/api/dashboard`)
- `GET  /api/dashboard/overview` - Complete dashboard metrics, top matches, request summaries, and recent activity log

---

## 🧪 Testing

### Run Algorithm Unit Tests
```bash
cd server
node -e "
const { calculateCompatibility, calculateSubjectSimilarity } = require('./services/matchingService');
console.log(calculateSubjectSimilarity(['DSA', 'DBMS'], ['DSA', 'DBMS', 'OS']));
"
```

### Demo Accounts for Testing
- `alex.chen@campus.edu` / `password123` (CS, 3rd Year)
- `elena.rostova@campus.edu` / `password123` (CS, 3rd Year)
- `lucas.r@campus.edu` / `password123` (CS, 4th Year)
- `sophia.patel@campus.edu` / `password123` (ECE, 4th Year)
- `marcus.vance@campus.edu` / `password123` (Data Science, 3rd Year)
