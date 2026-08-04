# Jalur Langit

## Project Overview

Jalur Langit is a smart placement discovery and application platform designed specifically for undergraduate medical students in Indonesia. The platform helps medical students find suitable clinical clerkship (co-ass) and internship opportunities through intelligent matching and automated application features.

Developed as part of the Garuda Hacks 7.0 Competition at Universitas Multimedia Nusantara (UMN).

---

## Features

- User Authentication (Register/Login)
- Job Listings with Search and Filter
- Job Detail View
- Smart Match Score (4 Categories)
- Auto Apply to Jobs
- Applied History Tracking
- Healthcare Professional Profile Management
- Responsive Design

---

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- Vite

### Backend

- Node.js
- Express.js
- JSON File Storage (Dummy Data)

---

## Demo Video

https://youtu.be/bJcRBfS6WaE

---

## Project Structure

```text
jalur-langit/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.png
│   │   │   └── logo2.png
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── jobs/
│   │   │       ├── ApplyModal.jsx
│   │   │       ├── AppliedHistory.jsx
│   │   │       ├── JobCard.jsx
│   │   │       ├── JobFilter.jsx
│   │   │       ├── JobList.jsx
│   │   │       └── MatchScore.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── JobContext.jsx
│   │   ├── pages/
│   │   │   ├── AppliedHistory.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── server/
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── jobController.js
    │   │   └── profileController.js
    │   ├── data/
    │   │   ├── applications.json
    │   │   ├── jobs.json
    │   │   ├── profile.json
    │   │   └── users.json
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── jobRoutes.js
    │   │   └── profileRoutes.js
    │   ├── utils/
    │   │   └── matcher.js
    │   └── server.js
    ├── .env
    ├── package.json
    └── .gitignore
```

---

## Installation

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Server will run on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

Client will run on:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/auth/login |
| POST | /api/auth/register |

### Jobs

| Method | Endpoint |
|----------|----------|
| GET | /api/jobs |
| GET | /api/jobs/:id |
| GET | /api/jobs/search |
| POST | /api/jobs/apply/:id |
| POST | /api/jobs/match/:id |
| GET | /api/jobs/history |

### Profile

| Method | Endpoint |
|----------|----------|
| GET | /api/profile |
| PUT | /api/profile |

---

## Test Credentials

```text
Email: user@email.com
Password: password123

Email: test@email.com
Password: test123
```

---

## Match Score Categories

| Category | Weight |
|-----------|----------|
| Profession | 30% |
| Specialization | 30% |
| Experience | 20% |
| Location | 20% |

---

## Key Components

### Match Score

The platform calculates match scores based on the user's professional profile and job requirements. Scores are displayed with visual indicators and detailed breakdowns for each category.

### Auto Apply System

Applications are automatically sent to hospital recruiters' email addresses. The system records all applications in the user's history.

### Profile Management

Healthcare professionals can manage their:

- Personal Information
- Profession and Specialization
- Skills and Certifications
- Experience and Education
- License Numbers
- Portfolio Links

---

## Future Improvements

### Database Integration

The current implementation uses JSON files as data storage.

Future improvements include:

- PostgreSQL Integration
- MongoDB Integration
- Persistent User Data
- Scalable Data Management
- Advanced Query Capabilities

### Email API Integration

The current auto-apply feature simulates email delivery.

Future improvements include:

- Nodemailer Integration
- SendGrid Integration
- Real Email Delivery
- Application Status Notifications

### AI Training Model

The original platform concept included scraping job postings from social media platforms.

Future improvements include:

- Threads Integration
- X (Twitter) Integration
- Natural Language Processing
- Automatic Requirement Extraction
- Machine Learning Based Matching
- Real-Time Job Discovery

---

## Development Team

Developed by Doa Ibu Team.

- Abthal Akbar
- Stavey Jeremy Lahindah
- Francent Jienarta
