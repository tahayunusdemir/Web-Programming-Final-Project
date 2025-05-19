// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome, {user?.username}!</h1>
      <p>Your Role: {user?.role}</p>
      <p>This is your protected home page.</p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
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
              path="/home" 
              element={(
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              )}
            />
            <Route 
              path="*" 
              element={<NavigateToLandingPage />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function NavigateToLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

export default App; 