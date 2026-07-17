const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Jalur Langit API is running',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      jobs: {
        all: 'GET /api/jobs',
        detail: 'GET /api/jobs/:id',
        search: 'GET /api/jobs/search?q=',
        apply: 'POST /api/jobs/apply/:id',
        match: 'POST /api/jobs/match/:id'
      },
      profile: {
        get: 'GET /api/profile',
        update: 'PUT /api/profile'
      }
    }
  });
});

// Start server
app.listen(port, () => {
  console.log('\n' + '='.repeat(70));
  console.log('JALUR LANGIT - SMART JOB DISCOVERY');
  console.log('='.repeat(70));
  console.log(`Server running on:  http://localhost:${port}`);
  console.log(`Environment:        ${process.env.NODE_ENV || 'development'}`);
  console.log(`Started at:         ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));
  
  console.log('\nAPI ENDPOINTS:');
  console.log('─'.repeat(70));
  
  console.log('\nJOBS');
  console.log('   ├─ GET    /api/jobs              - Get all jobs');
  console.log('   ├─ GET    /api/jobs/:id          - Get job by ID');
  console.log('   ├─ GET    /api/jobs/search?q=    - Search jobs (title, company, skills)');
  console.log('   ├─ GET    /api/jobs/search?location=  - Filter by location');
  console.log('   ├─ GET    /api/jobs/search?type=     - Filter by type');
  console.log('   ├─ POST   /api/jobs/apply/:id    - Apply to job (simulation)');
  console.log('   └─ POST   /api/jobs/match/:id    - Get match score with user profile');
  
  console.log('\nAUTHENTICATION');
  console.log('   ├─ POST   /api/auth/login        - Login user');
  console.log('   └─ POST   /api/auth/register     - Register new user');
  
  console.log('\nPROFILE');
  console.log('   ├─ GET    /api/profile           - Get user profile');
  console.log('   └─ PUT    /api/profile           - Update user profile');
  
  console.log('\nSYSTEM INFO:');
  console.log('   ├─ Jobs:    10 lowongan dummy');
  console.log('   ├─ Users:   2 akun dummy');
  console.log('   ├─ Skills:  5+ skill categories');
  console.log('   └─ Match:   Smart matching engine aktif');
  
  console.log('\nTEST CREDENTIALS:');
  console.log('   ├─ Email:    user@email.com');
  console.log('   └─ Password: password123');
  console.log('   ──────────────────────────────────');
  console.log('   ├─ Email:    test@email.com');
  console.log('   └─ Password: test123');
  
  console.log('\nCLIENT:');
  console.log(`   ├─ URL:      http://localhost:5173`);
  console.log('   ├─ Framework: React.js + Vite');
  console.log('   └─ Features:  Login, Register, Jobs, Match, Apply, Profile');
  
  console.log('\n' + '='.repeat(70));
  console.log('Server ready! Press Ctrl+C to stop');
  console.log('='.repeat(70) + '\n');
});
