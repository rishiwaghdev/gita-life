require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

// Base route
app.get('/', (req, res) => {
  res.send('Gita Life Program API is running');
});

module.exports = app;
