import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllClients } from '../services/productionService';
import { createEnergyCredit, getEnergyCreditsByClient, updateEnergyCredit, deleteEnergyCredit } from '../services/energyCreditService';
import {
  Container, Typography, Select, MenuItem, FormControl, InputLabel, Button, TextField, Paper, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EnergyCreditsPage = () => {
  const { user, token } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [kwhGenerated, setKwhGenerated] = useState('');
  const [creditsEarned, setCreditsEarned] = useState('');
  const [notes, setNotes] = useState('');
  const [editingCredit, setEditingCredit] = useState(null); // Stores the credit object being edited

  // Load clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await getAllClients(); // This function works for technicians and operations managers
        setClients(data || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch clients');
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user && token) {
      fetchClients();
    }
  }, [user, token]);

  // Load credits when the selected client changes
  useEffect(() => {
    if (selectedClient) {
      const fetchCredits = async () => {
        try {
          setIsLoading(true);
          setSuccessMessage('');
          setError('');
          const data = await getEnergyCreditsByClient(selectedClient, token);
          setCredits(data || []);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch energy credits');
          setCredits([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCredits();
    }
  }, [selectedClient, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || kwhGenerated === '' || creditsEarned === '') {
      setError('Please select a client and fill in KWH Generated and Credits Earned.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const creditData = { clientId: selectedClient, kwhGenerated: parseFloat(kwhGenerated), creditsEarned: parseFloat(creditsEarned), notes };

    try {
      if (editingCredit) {
        await updateEnergyCredit(editingCredit._id, creditData, token);
        setSuccessMessage('Energy credit updated successfully!');
      } else {
        await createEnergyCredit(creditData, token);
        setSuccessMessage('Energy credit created successfully!');
      }
      // Reset form and editing state
      setKwhGenerated('');
      setCreditsEarned('');
      setNotes('');
      setEditingCredit(null);
      // Reload credits
      const data = await getEnergyCreditsByClient(selectedClient, token);
      setCredits(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save energy credit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (credit) => {
    setEditingCredit(credit);
    setKwhGenerated(credit.kwhGenerated.toString());
    setCreditsEarned(credit.creditsEarned.toString());
    setNotes(credit.notes || '');
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async (creditId) => {
    if (window.confirm('Are you sure you want to delete this energy credit record?')) {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      try {
        await deleteEnergyCredit(creditId, token);
        setSuccessMessage('Energy credit deleted successfully!');
        // Reload credits
        const data = await getEnergyCreditsByClient(selectedClient, token);
        setCredits(data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete energy credit');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearForm = () => {
    setKwhGenerated('');
    setCreditsEarned('');
    setNotes('');
    setEditingCredit(null);
    setError('');
    setSuccessMessage('');
  };

  if (!user || user.role !== 'operationsManager') {
    return <Typography>You are not authorized to view this page.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, color: 'black', textAlign: 'center' }}>
        Manage Energy Credits
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, color: 'black', textAlign: 'center' }}>
          {editingCredit ? 'Edit Energy Credit' : 'Add New Energy Credit'}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="client-select-label">Select Client</InputLabel>
                <Select
                  labelId="client-select-label"
                  value={selectedClient}
                  label="Select Client"
                  onChange={(e) => {
                      setSelectedClient(e.target.value);
                      setCredits([]); // Clear old credits when a new client is selected
                      clearForm(); // Clear the form
                  }}
                  disabled={!!editingCredit} // Client cannot be changed in edit mode
                >
                  <MenuItem value="">
                    <em>Select a client</em>
                  </MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.username} (ID: {client.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="KWH Generated"
                    type="number"
                    value={kwhGenerated}
                    onChange={(e) => setKwhGenerated(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ step: "0.01" }}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Credits Earned"
                    type="number"
                    value={creditsEarned}
                    onChange={(e) => setCreditsEarned(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ step: "0.01" }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Notes (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained" color="primary" disabled={isLoading || !selectedClient} sx={{ mr: 1 }}>
                  {editingCredit ? 'Update Credit' : 'Add Credit'}
                </Button>
                <Button variant="outlined" onClick={clearForm} disabled={isLoading}>
                    Cancel / Clear
                </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {selectedClient && (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Energy Credits for {clients.find(c => c.id === selectedClient)?.username || 'Selected Client'}
          </Typography>
          {credits.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Calculation Date</TableCell>
                    <TableCell align="right">KWH Generated</TableCell>
                    <TableCell align="right">Credits Earned</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {credits.map((credit) => (
                    <TableRow key={credit._id}>
                      <TableCell component="th" scope="row">
                        {new Date(credit.calculationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">{credit.kwhGenerated}</TableCell>
                      <TableCell align="right">{credit.creditsEarned}</TableCell>
                      <TableCell>{credit.notes}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(credit)} color="primary" aria-label="edit credit" disabled={isLoading}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(credit._id)} color="error" aria-label="delete credit" disabled={isLoading}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ mt: 2 }}>No energy credits found for this client.</Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default EnergyCreditsPage; 