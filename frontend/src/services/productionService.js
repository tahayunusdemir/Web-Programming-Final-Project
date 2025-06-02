import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/production';

// Function to get the token from sessionStorage
const getToken = () => sessionStorage.getItem('token');

// Get energy production data for a specific client
export const getProductionData = async (clientId) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { clientId, clientUsername, energyProduction: { kwh } }
  } catch (error) {
    console.error('Error fetching production data from frontend service:', error.response || error.message);
    throw error.response?.data || { message: 'An error occurred while fetching production data.' };
  }
};

// In Sprint 3, the main requirement is to fetch production data.
// We also need a way for the Operations Manager to find clients to monitor.
// This is similar to the user search in certificateService, but might list all 'client' role users.

export const getAllClients = async () => {
  const token = getToken();
  // Use the /api/certificates/search endpoint. If query is empty, it lists all clients.
  const searchApiUrl = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/certificates/search` : 'http://localhost:5001/api/certificates/search';
  try {
    const response = await axios.get(searchApiUrl, { // No query param, should list all clients
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Array of client user objects { id, username, name }

  } catch (error) {
     console.error('Error fetching all clients:', error.response || error.message);
    throw error.response?.data || { message: 'An error occurred while fetching client list.' };
  }
};

// Artık varsayılan dışa aktarma kullanmıyoruz, bunun yerine adlandırılmış dışa aktarmalar kullanılıyor.
// const productionService = {
//   getProductionData,
//   getAllClients,
// };
// export default productionService; 