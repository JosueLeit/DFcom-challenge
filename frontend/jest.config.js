module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Transformar módulos ES6 problemáticos
  transformIgnorePatterns: [
    'node_modules/(?!(axios|date-fns|react-icons|@testing-library)/)'
  ],
  
  // Mapeamento de módulos
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Configurações de cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
  ],
  
  // Configurações de teste
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  
  // Configurações de timeout
  testTimeout: 10000,
  
  // Configurações de módulos
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Configurações de transformação
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  
  // Configurações de ambiente
  globals: {
    'process.env': {
      NODE_ENV: 'test'
    }
  },
  
  // Configurações de verbose
  verbose: true,
  
  // Limpar mocks automaticamente
  clearMocks: true,
  
  // Restaurar mocks automaticamente
  restoreMocks: true,
}; 