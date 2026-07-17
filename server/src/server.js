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
  res.json({ message: 'Jalur Langit API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Jalur Langit Server running on http://localhost:${port}`);
  console.log(`📋 API endpoints:`);
  console.log(`   - GET  /api/jobs`);
  console.log(`   - GET  /api/jobs/:id`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/profile`);
});
