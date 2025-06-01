import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import { Container, Typography, Box, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function RegistrationPage() {
  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Create Account
        </Typography>
        <RegistrationForm />
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegistrationPage; 