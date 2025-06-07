import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const login = (username, password) => {
    return axios.post(`${API_URL}/login`, {
        username,
        password,
    });
};

const getClients = () => {
    return axios.get(`${API_URL}/clients`, getAuthHeaders());
};

const authService = {
    login,
    getClients,
};

export default authService; 