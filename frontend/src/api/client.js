// "API manager" or "middleman" between React ra Backend.

import axios from 'axios'; // axios vaneko API call garne library ho

// creating axios object with baseURL
const apiClient = axios.create({ 
    baseURL: 'http://localhost:8000',
})

// Request server ma janu vanda agadi run yo code
apiClient.interceptors.request.use((config) => {
    // get token from local storage
    const token = localStorage.getItem('token');

    // if token exists, add it to the request headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
});

export default apiClient;
