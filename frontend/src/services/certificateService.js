import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/certificates';

// Function to get the token from sessionStorage
const getToken = () => sessionStorage.getItem('token');

// Search for users by ID or name (for technicians)
const searchUsers = async (query) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query },
      headers: { Authorization: `Bearer ${token}` } // Assuming JWT based auth
    });
    return response.data; // Array of user objects
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while searching users.' };
  }
};

// Register a new certificate
const registerCertificate = async (formData) => {
  const token = getToken();
  try {
    // Note: When sending FormData, axios will set the Content-Type to multipart/form-data automatically.
    // The backend needs to be configured to handle multipart/form-data (e.g., using multer).
    
    // Sending the FormData directly, which includes the file.
    // Remove the explicit 'Content-Type': 'application/json' header,
    // so Axios can set it to 'multipart/form-data' with the correct boundary.
    const response = await axios.post(`${API_URL}/register`, formData, {
        headers: { 
            Authorization: `Bearer ${token}`
        }
    });
    return response.data; // { message: 'Certificate registered successfully.', certificate: ... }
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during certificate registration.' };
  }
};

const certificateService = {
  searchUsers,
  registerCertificate,
};

export default certificateService; 