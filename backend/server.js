const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'your_mongodb_connection_string';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/installations', require('./routes/installations'));
app.use('/api/production', require('./routes/production'));
app.use('/api/credits', require('./routes/credits'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Add a simple GET handler for the root path
app.get('/', (req, res) => {
    res.send('API is running...');
}); 