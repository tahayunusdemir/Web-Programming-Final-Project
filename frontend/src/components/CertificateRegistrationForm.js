import React, { useState, useEffect } from 'react';
import certificateService from '../services/certificateService'; // We will create this service later
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete,
  Paper,
  Input // For styled file input
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Example icon for file upload
// import './CertificateRegistrationForm.css'; // We will create this CSS file later

function CertificateRegistrationForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Store the whole user object
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateFileName, setCertificateFileName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounced search function
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setSearchLoading(true);
      setError('');
      try {
        const users = await certificateService.searchUsers(searchQuery);
        setSearchResults(users || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to search users.');
        setSearchResults([]);
      }
      setSearchLoading(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
      setCertificateFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !certificateFile) {
      setError('Please select a user and a certificate file.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const formData = new FormData();
      formData.append('userId', selectedUser.id);
      formData.append('userName', selectedUser.name || selectedUser.username);
      formData.append('certificateFile', certificateFile);
      
      await certificateService.registerCertificate(formData);
      setSuccessMessage(`Certificate registered successfully for ${selectedUser.name || selectedUser.username}!`);
      // Reset form
      setSearchQuery('');
      setSelectedUser(null);
      setCertificateFile(null);
      setCertificateFileName('');
      // Reset Autocomplete input value if possible, or parent needs to control it
      // Reset file input
      const fileInput = document.getElementById('certificate-file-input');
      if(fileInput) fileInput.value = null;

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register certificate.');
    }
    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Adds space between form elements
      }}
    >
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>}

      <Autocomplete
        id="user-search-autocomplete"
        options={searchResults}
        getOptionLabel={(option) => `${option.name || option.username} (ID: ${option.id})`}
        inputValue={searchQuery} // Control input value
        onInputChange={(event, newInputValue) => {
          setSearchQuery(newInputValue);
        }}
        value={selectedUser}
        onChange={(event, newValue) => {
          setSelectedUser(newValue);
          if (newValue) {
            // Optional: Keep searchQuery in sync or clear it
            // setSearchQuery(newValue.name || newValue.username); 
          } else {
            setSearchQuery(''); // Clear search query when user is cleared
          }
        }}
        loading={searchLoading}
        filterOptions={(x) => x} // Added for server-side filtering best practice
        noOptionsText="No user found. Please check your search criteria." // Custom no options text
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search and Select User (ID or Name)"
            placeholder="Enter user ID or name..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name || option.username} (ID: {option.id})
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        fullWidth
        // PaperComponent={(props) => <Paper elevation={3} {...props} />} // Custom paper for dropdown
      />

      {selectedUser && (
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, color: 'black' }}>
          Selected User: <strong>{selectedUser.name || selectedUser.username}</strong> (ID: {selectedUser.id})
        </Typography>
      )}

      <Button
        variant="contained"
        component="label"
        fullWidth
        startIcon={<CloudUploadIcon />}
        disabled={loading}
      >
        {certificateFileName ? `File: ${certificateFileName}` : 'Upload Certificate (PDF)'}
        <Input 
          type="file" 
          id="certificate-file-input" 
          sx={{ display: 'none' }} 
          accept=".pdf" 
          onChange={handleFileChange} 
          required 
        />
      </Button>

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        disabled={loading || !selectedUser || !certificateFile}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Register Certificate'}
      </Button>
    </Box>
  );
}

export default CertificateRegistrationForm;