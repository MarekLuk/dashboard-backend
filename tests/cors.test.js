const originalEnv = process.env;

describe('Allowed Origins', () => {
  beforeEach(() => {
    jest.resetModules();  
    process.env = { ...originalEnv }; 
  });

  afterEach(() => {
    process.env = originalEnv; 
  });

  const getOrigins = () => {   
    return require('../config/corsConfig');
  };

  it('should return DEV_ORIGIN in development environment', () => {
    process.env.NODE_ENV = 'development';
    process.env.DEV_ORIGIN = 'http://localhost:3000';
    const origins = getOrigins();
    expect(origins).toEqual(['http://localhost:3000']);
  });

  it('should return PROD_ORIGIN in production environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.PROD_ORIGIN = 'https://production-url';
    const origins = getOrigins();
    expect(origins).toEqual(['https://production-url']);
  });

  it('should return an empty array when DEV_ORIGIN is undefined in development', () => {
    process.env.NODE_ENV = 'development';
    process.env.DEV_ORIGIN = '';
    const origins = getOrigins();
    expect(origins).toEqual([]);
  });

  it('should return an empty array when PROD_ORIGIN is undefined in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.PROD_ORIGIN = '';
    const origins = getOrigins();
    expect(origins).toEqual([]);
  });
});
