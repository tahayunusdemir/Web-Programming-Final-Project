import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Box, 
    Grid, 
    Alert, 
    CircularProgress, 
    Backdrop 
} from '@mui/material';
import installationService from '../services/installationService';

const TechnicianPage = () => {
    const [installations, setInstallations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchInstallations = async () => {
        setLoading(true);
        try {
            const res = await installationService.getInstallations();
            setInstallations(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch installations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstallations();
    }, []);

    const handleValidate = async (id) => {
        setError('');
        setSuccess('');
        try {
            await installationService.validateInstallation(id);
            setSuccess('Installation validated successfully!');
            fetchInstallations(); // Refresh list
        } catch (err) {
            setError('Failed to validate installation.');
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadCertificate = async (id) => {
        if (!selectedFile) {
            setError('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('certificate', selectedFile);
        
        setError('');
        setSuccess('');
        setUploading(true);
        try {
            await installationService.uploadCertificate(id, formData);
            setSelectedFile(null); // Clear file input
            setSuccess('Certificate uploaded successfully!');
            document.querySelector(`input[type="file"]#upload-cert-${id}`).value = '';
            fetchInstallations(); // Refresh list
        } catch (err) {
            setError('Failed to upload certificate.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={uploading}
            >
                <CircularProgress color="inherit" />
                <Typography sx={{ ml: 2 }}>Uploading certificate...</Typography>
            </Backdrop>

            <Typography variant="h4" gutterBottom>
                Technician Dashboard
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {installations.map((inst) => (
                        <Grid xs={12} md={6} lg={4} key={inst._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{inst.location}</Typography>
                                    <Typography color="textSecondary">Client: {inst.client ? inst.client.username : 'N/A'}</Typography>
                                    <Typography>Status: {inst.status}</Typography>
                                    <Typography>Technical Data: {inst.technicalData}</Typography>
                                    {inst.certificate && (
                                        <Button
                                            href={`http://localhost:5001${inst.certificate}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Certificate
                                        </Button>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {inst.status === 'Pending' && (
                                        <Button size="small" onClick={() => handleValidate(inst._id)}>
                                            Validate
                                        </Button>
                                    )}
                                    <Box>
                                        <Button component="label" size="small">
                                            Upload Cert
                                            <input type="file" hidden onChange={handleFileChange} accept=".pdf" id={`upload-cert-${inst._id}`} />
                                        </Button>
                                        <Button size="small" onClick={() => handleUploadCertificate(inst._id)} disabled={!selectedFile}>
                                            Submit
                                        </Button>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default TechnicianPage; 