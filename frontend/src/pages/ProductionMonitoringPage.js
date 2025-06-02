import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { getAllClients, getProductionData } from '../services/productionService';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List, 
  ListItem, 
  ListItemText,
  Card, 
  CardContent,
  Grid
} from '@mui/material';

const ProductionMonitoringPage = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [productionData, setProductionData] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingProduction, setLoadingProduction] = useState(false);
  const [error, setError] = useState('');

  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    setError('');
    try {
      const clientList = await getAllClients();
      setClients(clientList || []);
      if (clientList && clientList.length > 0) {
        // Optionally auto-select the first client
        // setSelectedClientId(clientList[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch clients.');
      setClients([]);
    }
    setLoadingClients(false);
  }, []);

  useEffect(() => {
    if (user?.role === 'operationsManager') {
      fetchClients();
    }
  }, [user, fetchClients]);

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
    setProductionData(null); // Reset production data when client changes
    setError(''); // Clear previous errors
  };

  const handleFetchProduction = async () => {
    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }
    setLoadingProduction(true);
    setError('');
    setProductionData(null);
    try {
      const data = await getProductionData(selectedClientId);
      setProductionData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch production data.');
      setProductionData(null);
    }
    setLoadingProduction(false);
  };

  if (user?.role !== 'operationsManager') {
    return <Navigate to="/home" replace />;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'black' }}>
          Renewable Energy Production Monitoring
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth disabled={loadingClients || clients.length === 0}>
            <InputLabel id="client-select-label">Select Client</InputLabel>
            <Select
              labelId="client-select-label"
              value={selectedClientId}
              label="Select Client"
              onChange={handleClientChange}
            >
              {clients.length === 0 && !loadingClients && (
                <MenuItem value="" disabled>No clients available</MenuItem>
              )}
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name || client.username} (ID: {client.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loadingClients && <CircularProgress size={24} sx={{ ml: 2, verticalAlign: 'middle' }} />}
        </Box>

        <Button
          variant="contained"
          onClick={handleFetchProduction}
          disabled={!selectedClientId || loadingProduction}
          fullWidth
          sx={{ mb: 3 }}
        >
          {loadingProduction ? <CircularProgress size={24} color="inherit" /> : 'Fetch Production Data'}
        </Button>

        {productionData && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
                Production Report for: {productionData.clientUsername}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Client ID:</strong> {productionData.clientId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'green' }}>
                    Current Production: {productionData.energyProduction?.kwh} kWh
                  </Typography>
                </Grid>
              </Grid>
              {/* You can add more details here, like timestamps or graphs if the API provides more data */}
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default ProductionMonitoringPage; 