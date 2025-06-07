const express = require('express');
const cors = require('cors');

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

/**
 * @route   GET /production
 * @desc    Get a random energy production value
 * @access  Public
 */
app.get('/production', (req, res) => {
    // Generate a random kW production value (e.g., between 1 and 10)
    const randomProduction = (Math.random() * 9) + 1;
    res.json({
        kilowatt: randomProduction.toFixed(2),
    });
});

app.listen(port, () => {
    console.log(`Mock Customer API listening at http://localhost:${port}`);
}); 