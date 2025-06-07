import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography component="h1" variant="h2" gutterBottom>
                    Welcome to the Energy Management System
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Manage solar panel installations, monitor energy production, and handle energy credits all in one place.
                </Typography>
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{ mt: 4 }}
                >
                    Get Started
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage; 