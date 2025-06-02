// backend/server.js
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module

// Import route definitions
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const productionRoutes = require('./routes/production'); // Added production routes
const installationRoutes = require('./routes/installations'); // Added installation routes
const energyCreditRoutes = require('./routes/energyCredits'); // Added energy credit routes

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses JSON bodies of incoming requests

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple test route
app.get('/', (req, res) => {
  res.send('Energy Management System Backend API is running!');
});

// API Routes
app.use('/api/auth', authRoutes); // Use authentication routes under /api/auth
app.use('/api/certificates', certificateRoutes); // Use certificate routes under /api/certificates
app.use('/api/production', productionRoutes); // Use production routes under /api/production
app.use('/api/installations', installationRoutes); // Use installation routes under /api/installations
app.use('/api/energy-credits', energyCreditRoutes); // Use energy credit routes under /api/energy-credits

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001; // Uses port 5001 if not in .env file

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB database.');
  // Start the server after successful database connection
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Backend server is running on port ${PORT} at http://127.0.0.1:${PORT}/ ...`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Terminate application on connection error
});

// Global error handler (optional, for more advanced scenarios)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'A server error occurred!', error: err.message });
}); 