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
    endpoints: {
      jobs: '/api/jobs',
      jobDetail: '/api/jobs/:id',
      search: '/api/jobs/search?q=',
      apply: '/api/jobs/apply/:id',
      match: '/api/jobs/match/:id',
      login: '/api/auth/login',
      register: '/api/auth/register',
      profile: '/api/profile'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Jalur Langit Server running on http://localhost:${port}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   ────────────────────────────────`);
  console.log(`   📌 JOBS`);
  console.log(`   ├─ GET    /api/jobs              - Get all jobs`);
  console.log(`   ├─ GET    /api/jobs/:id          - Get job by ID`);
  console.log(`   ├─ GET    /api/jobs/search?q=    - Search jobs`);
  console.log(`   ├─ POST   /api/jobs/apply/:id    - Apply to job`);
  console.log(`   └─ POST   /api/jobs/match/:id    - Get match score`);
  console.log(`   ────────────────────────────────`);
  console.log(`   🔐 AUTH`);
  console.log(`   ├─ POST   /api/auth/login        - Login user`);
  console.log(`   └─ POST   /api/auth/register     - Register user`);
  console.log(`   ────────────────────────────────`);
  console.log(`   👤 PROFILE`);
  console.log(`   ├─ GET    /api/profile           - Get user profile`);
  console.log(`   └─ PUT    /api/profile           - Update user profile`);
  console.log(`   ────────────────────────────────`);
  console.log(`✨ Server ready! Press Ctrl+C to stop\n`);
});
