import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container, Typography, Box, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
// import './LoginPage.css'; // Styles are now managed by Material UI

function LoginPage() {
  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom color="text.primary" sx={{ textAlign: 'center' }}>
          Welcome to the Energy Management System
        </Typography>
        <Typography component="p" variant="subtitle1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Please log in to continue.
        </Typography>
        <LoginForm />
        <Box mt={2} textAlign="center"> {/* Adjusted margin for spacing */}
          <Typography variant="body2" color="text.primary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" variant="body2">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage; 