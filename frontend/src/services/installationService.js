import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getToken = () => sessionStorage.getItem('token');

const registerInstallation = async (installationData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/installations/register`, installationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering installation:', error.response || error.message);
    throw error.response?.data || { message: error.message || 'Failed to register installation.' };
  }
};

const installationService = {
  registerInstallation,
};

export default installationService; 