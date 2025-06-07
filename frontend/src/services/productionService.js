import axios from 'axios';

const API_URL = 'http://localhost:5001/api/production';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const recordProduction = (idClient) => {
    return axios.post(`${API_URL}/${idClient}`, {}, getAuthHeaders());
};

const getClientProduction = (idClient) => {
    return axios.get(`${API_URL}/${idClient}`, getAuthHeaders());
};

const productionService = {
    recordProduction,
    getClientProduction,
};

export default productionService; 