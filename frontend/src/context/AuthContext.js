// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user'))); // Let's also store user information
  const [loading, setLoading] = useState(true); // For initial token check

  useEffect(() => {
    // Check token and user information in sessionStorage when page loads
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Check finished, loading complete
  }, []);

  const login = (newToken, newUserDetails) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUserDetails)); // Store user details as string
    setToken(newToken);
    setUser(newUserDetails);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token, // If token exists, user is considered authenticated
    isLoading: loading // Let's also add loading status to context
  };

  // Can return null or show a loading indicator until loading is complete.
  // In this example, children are not rendered until loading is finished.
  // return loading ? <p>Loading session information...</p> : <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children when loading is finished */}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 