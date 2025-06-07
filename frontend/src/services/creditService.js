import axios from 'axios';

const API_URL = 'http://localhost:5001/api/credits';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const calculateCredits = (idClient) => {
    return axios.post(`${API_URL}/${idClient}/calculate`, {}, getAuthHeaders());
};

const creditService = {
    calculateCredits,
};

export default creditService; 