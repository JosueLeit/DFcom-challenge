import api from '../api';

describe('API Service - TDD', () => {
  it('deve ter uma instância axios configurada', () => {
    expect(api).toBeDefined();
    expect(api.defaults.baseURL).toBe(process.env.REACT_APP_API_URL || 'http://localhost:3001');
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve ter interceptor de request configurado', () => {
    expect(api.interceptors.request.handlers).toHaveLength(1);
  });

  it('deve ter interceptor de response configurado', () => {
    expect(api.interceptors.response.handlers).toHaveLength(1);
  });
}); 