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

// The public website is hosted separately from this Express API.
// Redirect requests for the API root to the public frontend.
app.get('/', (req, res) => {
  const frontendOrigin = (process.env.CLIENT_URL || '')
    .split(',')
    .map(url => url.trim())
    .find(url => url.startsWith('https://') || url.startsWith('http://'));

  if (frontendOrigin) return res.redirect(302, frontendOrigin);

  return res.json({
    message: 'LabPartner API is running',
    health: '/api/health'
  });
});

// Report database readiness, not only HTTP availability.
app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
    message: databaseConnected
      ? 'LabPartner Finder API is operational'
      : 'LabPartner Finder API cannot reach the database',
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
const MONGODB_URI = process.env.MONGODB_URI;

// Never silently use localhost or an example Atlas host in production.
if (!MONGODB_URI || !(MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'))) {
  console.error('MONGODB_URI is missing or invalid. Set it in Render > Environment (or server/.env locally).');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Set a unique, strong secret in the server environment.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`LabPartner Finder Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Do not print credentials from the connection URI in production logs.
    console.error(`MongoDB connection failed (${err.code || err.name || 'unknown error'}).`);
    if (err.code === 'ENOTFOUND' || err.message?.includes('querySrv ENOTFOUND')) {
      console.error('Atlas hostname could not be resolved. Copy the exact URI from Atlas > Connect > Drivers, and check that the cluster is running.');
    } else {
      console.error('Verify the Atlas URI, credentials, cluster status, and Network Access settings.');
    }
    process.exit(1);
  });
