// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CertificateRegistrationPage from './pages/CertificateRegistrationPage';
import ProductionMonitoringPage from './pages/ProductionMonitoringPage';
import { CssBaseline, Container, Typography, Button, Link, Box, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Example icon

const AppLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      {isAuthenticated && (
        <AppBar position="static">
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Energy Management System
            </Typography>
            {user?.role === 'technician' && (
              <Button color="inherit" component={RouterLink} to="/register-certificate">
                Register Certificate
              </Button>
            )}
            {user?.role === 'operationsManager' && (
              <Button color="inherit" component={RouterLink} to="/production-monitoring">
                Monitor Production
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
      )}
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 2, mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Taha Yunus Demir | Energy Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      <Typography variant="subtitle1">
        Your Role: {user?.role}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is your protected home page.
      </Typography>
    </Box>
  );
};

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

// Protected Route Component for Technicians
function TechnicianProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'technician') {
    return <Navigate to="/home" replace />; // Or an unauthorized page
  }
  return children;
}

// Protected Route Component for Operations Managers
function OperationsManagerProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'operationsManager') {
    return <Navigate to="/home" replace />; // Or an unauthorized page
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route 
              path="/login" 
              element={(
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              )}
            />
            <Route 
              path="/register"
              element={(
                <PublicRoute>
                  <RegistrationPage />
                </PublicRoute>
              )}
            />
            <Route 
              path="/home" 
              element={(
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              )}
            />
            <Route 
              path="/register-certificate"
              element={(
                <TechnicianProtectedRoute>
                  <CertificateRegistrationPage />
                </TechnicianProtectedRoute>
              )}
            />
            <Route 
              path="/production-monitoring"
              element={(
                <OperationsManagerProtectedRoute>
                  <ProductionMonitoringPage />
                </OperationsManagerProtectedRoute>
              )}
            />
            <Route 
              path="*" 
              element={<NavigateToLandingPage />} 
            />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

function NavigateToLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

export default App; 