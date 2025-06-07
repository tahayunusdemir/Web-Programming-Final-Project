import React, { useState, useEffect, useContext } from 'react';
import { Typography, TextField, Button, Box, List, ListItem, ListItemText, Paper, Alert, CircularProgress } from '@mui/material';
import AuthContext from '../context/AuthContext';
import installationService from '../services/installationService';

const ClientPage = () => {
    const { user } = useContext(AuthContext);
    const [installations, setInstallations] = useState([]);
    const [technicalData, setTechnicalData] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchInstallations = async () => {
        setLoading(true);
        try {
            const res = await installationService.getClientInstallations();
            setInstallations(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch installations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchInstallations();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await installationService.createInstallation({ technicalData, location });
            setSuccess('Installation registered successfully!');
            setTechnicalData('');
            setLocation('');
            fetchInstallations(); // Refresh the list
        } catch (err) {
            setError('Failed to register installation.');
            setSuccess('');
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Client Area
            </Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Register New Solar Panel Installation
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="technicalData"
                        label="Technical Data"
                        name="technicalData"
                        value={technicalData}
                        onChange={(e) => setTechnicalData(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="location"
                        label="Location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register Installation
                    </Button>
                </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>
                My Installations
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {installations.map((inst) => (
                        <ListItem key={inst._id} divider>
                            <ListItemText
                                primary={`Location: ${inst.location}`}
                                secondary={`Technical Data: ${inst.technicalData} - Status: ${inst.status}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default ClientPage; 