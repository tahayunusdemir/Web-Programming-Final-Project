// backend/server.js
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Rota tanımlamalarını içe aktar
const authRoutes = require('./routes/auth');

// Express uygulamasını oluştur
const app = express();

// Middleware'ler
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses JSON bodies of incoming requests

// Basit bir test rotası
app.get('/', (req, res) => {
  res.send('Energy Management System Backend API is running!');
});

// API Rotaları
app.use('/api/auth', authRoutes); // Use authentication routes under /api/auth

// MongoDB'ye Bağlanma
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001; // Uses port 5001 if not in .env file

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB database.');
  // Start the server after successful database connection
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}...`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Terminate application on connection error
});

// Global hata yakalayıcı (optional, for more advanced scenarios)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'A server error occurred!', error: err.message });
}); 