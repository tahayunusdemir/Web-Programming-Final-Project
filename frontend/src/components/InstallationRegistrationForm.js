import React, { useState } from 'react';
import installationService from '../services/installationService';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'; // Correct import for DatePicker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // Correct adapter import

function InstallationRegistrationForm() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    panelModel: '',
    panelCount: '',
    notes: ''
  });
  const [installationDate, setInstallationDate] = useState(new Date());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setInstallationDate(newDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const submissionData = {
      ...formData,
      installationDate: installationDate ? installationDate.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
      panelCount: formData.panelCount ? Number(formData.panelCount) : undefined
    };

    try {
      const response = await installationService.registerInstallation(submissionData);
      setSuccessMessage(response.message || 'Installation registered successfully!');
      // Reset form
      setFormData({
        address: '',
        city: '',
        postalCode: '',
        panelModel: '',
        panelCount: '',
        notes: ''
      });
      setInstallationDate(new Date());
    } catch (err) {
      setError(err.message || err.errors?.message || 'Failed to register installation.');
    }
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Register New Solar Panel Installation
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="panelModel"
                label="Panel Model (Optional)"
                value={formData.panelModel}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="panelCount"
                label="Number of Panels (Optional)"
                type="number"
                value={formData.panelCount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={3} sx={{ alignSelf: 'center'}}>
                <DatePicker
                    label="Installation Date"
                    value={installationDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes (Optional)"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register Installation'}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}

export default InstallationRegistrationForm; 