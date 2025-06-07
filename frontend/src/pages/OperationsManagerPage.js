import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Box,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import authService from '../services/authService';
import productionService from '../services/productionService';
import creditService from '../services/creditService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OperationsManagerPage = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [productionData, setProductionData] = useState([]);
    const [creditData, setCreditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await authService.getClients();
                setClients(response.data);
            } catch (err) {
                setError('Failed to fetch clients.');
                console.error(err);
            }
        };
        fetchClients();
    }, []);

    const handleSelectClient = async (client) => {
        setSelectedClient(client);
        setCreditData(null);
        setLoading(true);
        setError('');
        try {
            const response = await productionService.getClientProduction(client._id);
            setProductionData(response.data);
        } catch (err) {
            setError('Failed to fetch production data.');
            console.error(err);
            setProductionData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordProduction = async () => {
        if (!selectedClient) return;
        setLoading(true);
        setError('');
        try {
            await productionService.recordProduction(selectedClient._id);
            // Refresh production data
            handleSelectClient(selectedClient);
        } catch (err) {
            setError('Failed to record new production data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateCredits = async () => {
        if (!selectedClient) return;
        setLoading(true);
        setError('');
        try {
            const response = await creditService.calculateCredits(selectedClient._id);
            setCreditData(response.data);
        } catch (err) {
            setError('Failed to calculate credits.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 2 }}>
                Operations Manager Console
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Clients</Typography>
                                <List>
                                    {clients.map((client) => (
                                        <ListItem
                                            button
                                            key={client._id}
                                            selected={selectedClient?._id === client._id}
                                            onClick={() => handleSelectClient(client)}
                                        >
                                            <ListItemText primary={client.username} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3}>
                        <Card>
                            <CardContent>
                                {selectedClient ? (
                                    <>
                                        <Typography variant="h6">
                                            Energy Production for {selectedClient.username}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleRecordProduction}
                                                disabled={loading}
                                            >
                                                Record New Production
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleCalculateCredits}
                                                disabled={loading}
                                            >
                                                Calculate Monthly Credits
                                            </Button>
                                        </Box>
                                        {loading && <CircularProgress size={24} />}
                                        <Divider sx={{ my: 2 }} />
                                        {error && <Typography color="error">{error}</Typography>}

                                        {creditData && (
                                            <Card sx={{ my: 2, backgroundColor: '#f0f4f8' }}>
                                                <CardContent>
                                                    <Typography variant="h6">Credit Calculation Results</Typography>
                                                    <Typography>Total Production (Last Month): {creditData.totalProduction.toFixed(2)} kWh</Typography>
                                                    <Typography>Assumed Consumption: {creditData.consumption.toFixed(2)} kWh</Typography>
                                                    <Typography>Surplus Energy: {creditData.surplus.toFixed(2)} kWh</Typography>
                                                    <Typography variant="h6" color="primary">Credits Awarded: {creditData.creditsAwarded.toFixed(2)}</Typography>
                                                    <Typography>New Total Credits: {creditData.newCreditTotal.toFixed(2)}</Typography>
                                                </CardContent>
                                            </Card>
                                        )}

                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="production-history-content"
                                                id="production-history-header"
                                            >
                                                <Typography>Production History</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {productionData.length > 0 ? (
                                                    <List>
                                                        {productionData.map((data) => (
                                                            <ListItem key={data._id}>
                                                                <ListItemText
                                                                    primary={`Kilowatt: ${data.kilowatt}`}
                                                                    secondary={`Recorded on: ${new Date(data.timestamp).toLocaleString()}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography>No production data available.</Typography>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </>
                                ) : (
                                    <Typography variant="h6" sx={{ textAlign: 'center', p: 4 }}>
                                        Select a client to view their energy production data.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OperationsManagerPage; 