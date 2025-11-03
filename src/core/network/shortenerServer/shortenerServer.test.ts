import { api } from './shortenerServer';

describe('shortenerServer', () => {
  it('should export an axios instance', () => {
    expect(api).toBeDefined();
    expect(typeof api).toBe('function'); // Axios instances are functions
  });

  it('should have axios instance methods', () => {
    // Axios instances have methods like get, post, put, delete, etc.
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.delete).toBe('function');
  });

  it('should have axios instance defaults', () => {
    expect(api.defaults).toBeDefined();
    expect(typeof api.defaults).toBe('object');
  });

  it('should have timeout configured', () => {
    expect(api.defaults.timeout).toBe(10000);
  });

  it('should have baseURL configured from environment variable', () => {
    const expectedBaseUrl = process.env.EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL;
    expect(api.defaults.baseURL).toBe(expectedBaseUrl);
  });
});
