const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.MOCK_API_PORT || 5002;

app.use(cors());
app.use(express.json());

// Endpoint to simulate fetching energy production data
app.get('/production', (req, res) => {
  // Generate a random kilowatt value (e.g., between 1 and 1000)
  const randomKwh = Math.floor(Math.random() * 1000) + 1;
  console.log(`Mock API: GET /production - Responding with ${randomKwh} kWh`);
  res.json({ kwh: randomKwh });
});

app.listen(port, () => {
  console.log(`Mock Customer API server running on port ${port}`);
}); 