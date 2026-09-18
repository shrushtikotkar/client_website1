const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Support .env in server directory as well as root
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const connectDB = require('./config/db');
const { autoSeedFleet } = require('./seed');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB and auto-seed if needed
connectDB().then((conn) => {
  if (conn) {
    autoSeedFleet();
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded vehicle images statically
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint for Render / monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Sadguru Tours & Travels API'
  });
});

// API Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));

// Serve Frontend in Production (when dist folder exists)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving production frontend build from ${distPath}`);
  app.use(express.static(distPath));

  // Express 5 compatible fallback for SPA client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.send('Sadguru Tours & Travels API is running. (Run npm run build to serve frontend)');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  🚀 Server running on port ${PORT}`);
  console.log(`  ➜  Local:    http://localhost:${PORT}/`);
  console.log(`  ➜  Health:   http://localhost:${PORT}/api/health`);
  console.log(`  ➜  API:      http://localhost:${PORT}/api/vehicles`);
  console.log(`  ➜  API:      http://localhost:${PORT}/api/bookings\n`);
});