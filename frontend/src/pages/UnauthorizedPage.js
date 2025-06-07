import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const UnauthorizedPage = () => {
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
                <Typography component="h1" variant="h4" gutterBottom>
                    Unauthorized Access
                </Typography>
                <Typography variant="body1">
                    You do not have the necessary permissions to view this page.
                </Typography>
                <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default UnauthorizedPage; 