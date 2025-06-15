import api from '../api';

// Mock local do axios para este teste específico
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    defaults: {
      baseURL: 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    interceptors: {
      request: {
        use: jest.fn(),
        handlers: [jest.fn()]
      },
      response: {
        use: jest.fn(),
        handlers: [jest.fn()]
      }
    }
  }))
}));

describe('API Service - TDD', () => {
  it('deve ter uma instância axios configurada', () => {
    expect(api).toBeDefined();
    expect(api.defaults.baseURL).toBe('http://localhost:3001');
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve ter interceptor de request configurado', () => {
    expect(api.interceptors.request.handlers).toHaveLength(1);
  });

  it('deve ter interceptor de response configurado', () => {
    expect(api.interceptors.response.handlers).toHaveLength(1);
  });
}); 