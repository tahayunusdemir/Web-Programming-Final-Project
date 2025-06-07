import axios from 'axios';

const API_URL = 'http://localhost:5001/api/installations';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const createInstallation = (installationData) => {
    return axios.post(API_URL, installationData, { headers: getAuthHeaders() });
};

const getInstallations = () => {
    return axios.get(API_URL, { headers: getAuthHeaders() });
};

const getClientInstallations = () => {
    return axios.get(`${API_URL}/client`, { headers: getAuthHeaders() });
};

const validateInstallation = (id) => {
    return axios.put(`${API_URL}/validate/${id}`, {}, { headers: getAuthHeaders() });
};

const uploadCertificate = (id, formData) => {
    return axios.post(`${API_URL}/certificate/${id}`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

const installationService = {
    createInstallation,
    getInstallations,
    getClientInstallations,
    validateInstallation,
    uploadCertificate,
};

export default installationService; 