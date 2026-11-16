const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const partnersRoutes = require('./routes/partners');
const requestsRoutes = require('./routes/requests');
const dashboardRoutes = require('./routes/dashboard');
const studentsRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Determine allowed origins dynamically for local dev and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach(url => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin server requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by CORS for origin ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Morgan logger: concise in production, dev format in local development
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'LabPartner Finder API is operational',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes - Mount both singular and plural aliases for full compatibility
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentsRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/labpartner_db';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(' Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(` LabPartner Finder Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
  });
