import React from 'react';
import InstallationRegistrationForm from '../components/InstallationRegistrationForm';
import { Container, Typography } from '@mui/material';

function InstallationRegistrationPage() {
  return (
    <Container maxWidth="md">
      {/* Optional: Add a page title or other layout elements here */}
      <InstallationRegistrationForm />
    </Container>
  );
}

export default InstallationRegistrationPage; 