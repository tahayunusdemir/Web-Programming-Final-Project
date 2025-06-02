import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create a new energy credit record
export const createEnergyCredit = async (creditData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/energy-credits`, creditData, config);
  return response.data;
};

// Get all energy credit records for a specific client
export const getEnergyCreditsByClient = async (clientId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/energy-credits/client/${clientId}`, config);
  return response.data;
};

// Get a specific energy credit record by its ID
export const getEnergyCreditById = async (creditId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/energy-credits/${creditId}`, config);
  return response.data;
};

// Update an existing energy credit record
export const updateEnergyCredit = async (creditId, creditData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/energy-credits/${creditId}`, creditData, config);
  return response.data;
};

// Delete an energy credit record
export const deleteEnergyCredit = async (creditId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/energy-credits/${creditId}`, config);
  return response.data;
}; 