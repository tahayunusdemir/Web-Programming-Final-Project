const express = require('express');
const router = express.Router();
const {
    createInstallation,
    getInstallations,
    getClientInstallations,
    validateInstallation,
    uploadCertificate,
    upload
} = require('../controllers/installationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Client'), createInstallation)
    .get(protect, authorize('Technician', 'Operations Manager'), getInstallations);

router.route('/client')
    .get(protect, authorize('Client'), getClientInstallations);

router.route('/validate/:id')
    .put(protect, authorize('Technician', 'Operations Manager'), validateInstallation);

router.route('/certificate/:id')
    .post(protect, authorize('Technician', 'Operations Manager'), upload.single('certificate'), uploadCertificate);

module.exports = router; 