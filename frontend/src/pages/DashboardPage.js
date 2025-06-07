import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                Dashboard
            </Typography>
            {user && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h6">Welcome, {user.username}!</Typography>
                    <Typography variant="body1">Your Role: {user.role}</Typography>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {user.role === 'Client' && (
                            <Button component={RouterLink} to="/client" variant="contained">
                                My Installations
                            </Button>
                        )}
                        {user.role === 'Technician' && (
                            <Button component={RouterLink} to="/technician" variant="contained">
                                Manage Installations
                            </Button>
                        )}
                        {user.role === 'Operations Manager' && (
                            <Button component={RouterLink} to="/operations" variant="contained">
                                Operations Console
                            </Button>
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={logout}
                        sx={{ mt: 3 }}
                    >
                        Logout
                    </Button>
                </Box>
            )}
        </>
    );
};

export default DashboardPage; 