import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de request - adicionar tokens se necessário
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - tratamento de erros globais
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros globais
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized access');
    }
    
    if (error.response?.status >= 500) {
      console.error('🔥 Server error');
    }
    
    return Promise.reject(error);
  }
);

export default api; 