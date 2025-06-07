const Installation = require('../models/Installation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'certificates');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter for PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Not a PDF file!'), false);
    }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// @desc    Create new installation
// @route   POST /api/installations
// @access  Private/Client
exports.createInstallation = async (req, res) => {
    const { technicalData, location } = req.body;

    try {
        const installation = new Installation({
            client: req.user._id,
            technicalData,
            location,
        });

        const createdInstallation = await installation.save();
        res.status(201).json(createdInstallation);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create installation', error: error.message });
    }
};

// @desc    Get all installations
// @route   GET /api/installations
// @access  Private/Technician
exports.getInstallations = async (req, res) => {
    try {
        const installations = await Installation.find({}).populate('client', 'username');
        res.json(installations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch installations', error: error.message });
    }
};

// @desc    Get logged in user installations
// @route   GET /api/installations/client
// @access  Private/Client
exports.getClientInstallations = async (req, res) => {
    try {
        const installations = await Installation.find({ client: req.user._id });
        res.json(installations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch client installations', error: error.message });
    }
};

// @desc    Validate an installation
// @route   PUT /api/installations/validate/:id
// @access  Private/Technician
exports.validateInstallation = async (req, res) => {
    try {
        const installation = await Installation.findById(req.params.id);

        if (installation) {
            installation.status = 'Validated';
            const updatedInstallation = await installation.save();
            res.json(updatedInstallation);
        } else {
            res.status(404).json({ message: 'Installation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to validate installation', error: error.message });
    }
};

// @desc    Upload certificate for an installation
// @route   POST /api/installations/certificate/:id
// @access  Private/Technician
exports.uploadCertificate = async (req, res) => {
    try {
        const installation = await Installation.findById(req.params.id);

        if (installation) {
            if (req.file) {
                installation.certificate = `/uploads/certificates/${req.file.filename}`;
                const updatedInstallation = await installation.save();
                res.json(updatedInstallation);
            } else {
                res.status(400).json({ message: 'Please upload a PDF file' });
            }
        } else {
            res.status(404).json({ message: 'Installation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload certificate', error: error.message });
    }
}; 