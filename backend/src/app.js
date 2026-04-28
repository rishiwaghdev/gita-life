require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/client');

// Route imports
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const studentRoutes = require('./routes/student.routes');
const batchRoutes = require('./routes/batch.routes');
const sessionRoutes = require('./routes/session.routes');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: true });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', db: false, message: error.message });
  }
});

// Base route
app.get('/', (req, res) => {
  res.send('Gita Life Program API is running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
