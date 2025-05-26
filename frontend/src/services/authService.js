import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth'; // Backend API address

// New user registration
const register = async (username, password, role = 'user') => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      role,
    });
    return response.data; // { message: 'User registered successfully.', userId: ... }
  } catch (error) {
    // We can make the error message more user-friendly or use the one directly from the backend.
    throw error.response?.data || { message: 'An error occurred during registration.' };
  }
};

// User login
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    // On successful login, backend returns token and user information
    // We are returning this information to pass to AuthContext.
    if (response.data.token) {
      return response.data; // { message: 'Login successful!', token: '...', user: { id, username, role } }
    }
    // Unexpected situation, if token is missing
    throw new Error('Token not found in login response.');
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login.' };
  }
};

// Helper function to add token to Authorization header (can be used later)
// export const setAuthToken = token => {
//   if (token) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common['Authorization'];
//   }
// };

const authServiceObject = {
  register,
  login,
  // setAuthToken, // Can be activated later if needed
};

export default authServiceObject;

 