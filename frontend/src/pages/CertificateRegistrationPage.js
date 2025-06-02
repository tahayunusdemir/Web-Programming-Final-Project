import React from 'react';
import CertificateRegistrationForm from '../components/CertificateRegistrationForm';
import { Container, Typography, Paper, Box } from '@mui/material';
// import './CertificateRegistrationPage.css'; // Styles are now managed by Material UI

function CertificateRegistrationPage() {
  return (
    <Container component="section" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: 'black' }}>
            Register Certificate
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Technicians can register new energy producer certificates here.
          </Typography>
        </Box>
        <CertificateRegistrationForm />
      </Paper>
    </Container>
  );
}

export default CertificateRegistrationPage; 