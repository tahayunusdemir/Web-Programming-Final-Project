import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext, useThemeMode } from './context/ThemeContext';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ClientPage from './pages/ClientPage';
import TechnicianPage from './pages/TechnicianPage';
import OperationsManagerPage from './pages/OperationsManagerPage';

function App() {
  const [theme, colorMode] = useThemeMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Role-specific routes */}
                <Route 
                  path="/client" 
                  element={
                    <ProtectedRoute roles={['Client']}>
                      <ClientPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/technician" 
                  element={
                    <ProtectedRoute roles={['Technician']}>
                      <TechnicianPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/operations" 
                  element={
                    <ProtectedRoute roles={['Operations Manager']}>
                      <OperationsManagerPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App; 