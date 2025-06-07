import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Link as MuiLink, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import AuthContext from '../context/AuthContext';
import { ColorModeContext } from '../context/ThemeContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                        Solar Energy Management
                    </Typography>
                    
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {user ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Outlet /> {/* Child routes will render here */}
            </Container>
            <Box component="footer" sx={{ p: 3, mt: 'auto', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                 <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <MuiLink color="inherit" href="https://github.com/tahayunusdemir/Web-Programming-Final-Project">
                            Solar Energy Management
                        </MuiLink>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 