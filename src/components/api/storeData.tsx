import axios from 'axios';
import api from './api';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('API Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockLocation.href = '';
  });

  it('should create axios instance with correct configuration', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://127.0.0.1:8000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  });

  describe('Request Interceptor', () => {
    let requestInterceptor: any;
    let mockConfig: any;

    beforeEach(() => {
      // Captura o interceptor de request
      const createCall = mockedAxios.create.mock.calls[0];
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      };
      
      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      // Re-import para capturar os interceptors
      jest.resetModules();
      require('./api');
      
      requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0][0];
      
      mockConfig = {
        headers: {},
        url: '/test',
        method: 'GET',
      };
    });

    it('should add Authorization header when token exists', () => {
      const testToken = 'test-token-123';
      localStorageMock.getItem.mockReturnValue(testToken);

      const result = requestInterceptor(mockConfig);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result.headers.Authorization).toBe(`Bearer ${testToken}`);
    });

    it('should not add Authorization header when token does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = requestInterceptor(mockConfig);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle request interceptor error', () => {
      // Define mockInstance as in beforeEach
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      };
      mockedAxios.create.mockReturnValue(mockInstance as any);
      jest.resetModules();
      require('./api');
      const requestErrorHandler = mockInstance.interceptors.request.use.mock.calls[0][1];
      const error = new Error('Request error');

      expect(() => requestErrorHandler(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    let responseInterceptor: any;
    let responseErrorHandler: any;

    beforeEach(() => {
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      };
      
      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      jest.resetModules();
      require('./api');
      
      responseInterceptor = mockInstance.interceptors.response.use.mock.calls[0][0];
      responseErrorHandler = mockInstance.interceptors.response.use.mock.calls[0][1];
    });

    it('should return response when successful', () => {
      const mockResponse = {
        data: { message: 'Success' },
        status: 200,
        statusText: 'OK',
      };

      const result = responseInterceptor(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should remove token and redirect on 401 error', async () => {
      const error401 = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      localStorageMock.setItem('auth_token', 'test-token');

      try {
        await responseErrorHandler(error401);
      } catch (e) {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
        expect(mockLocation.href).toBe('/login');
        expect(e).toBe(error401);
      }
    });

    it('should not redirect on non-401 errors', async () => {
      const error500 = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
      };

      try {
        await responseErrorHandler(error500);
      } catch (e) {
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        expect(mockLocation.href).toBe('');
        expect(e).toBe(error500);
      }
    });

    it('should handle errors without response object', async () => {
      const networkError = new Error('Network Error');

      try {
        await responseErrorHandler(networkError);
      } catch (e) {
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        expect(mockLocation.href).toBe('');
        expect(e).toBe(networkError);
      }
    });
  });

  describe('API Instance Export', () => {
    it('should export the configured axios instance', () => {
      expect(api).toBeDefined();
      expect(typeof api).toBe('object');
    });
  });

  describe('MySQL Communication via Laravel API', () => {
    beforeEach(() => {
      // Mock successful API responses
      const mockInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      mockedAxios.create.mockReturnValue(mockInstance as any);
    });

    it('should be configured to communicate with Laravel API on port 8000', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://127.0.0.1:8000/api',
        })
      );
    });

    it('should have appropriate headers for Laravel API communication', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
      );
    });

    it('should have timeout configured for MySQL operations', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 10000,
        })
      );
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete authentication flow', () => {
      const mockInstance = {
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      mockedAxios.create.mockReturnValue(mockInstance as any);

      // Simulate setting token after login
      localStorageMock.setItem('auth_token', 'valid-jwt-token');

      jest.resetModules();
      const freshApi = require('./api').default;
      
      const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0][0];
      const config = { headers: {} };
      
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer valid-jwt-token');
    });

    it('should handle session expiration and cleanup', async () => {
      const mockInstance = {
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      mockedAxios.create.mockReturnValue(mockInstance as any);

      jest.resetModules();
      require('./api');

      const responseErrorHandler = mockInstance.interceptors.response.use.mock.calls[0][1];
      
      // Simulate expired token scenario
      localStorageMock.setItem('auth_token', 'expired-token');
      
      const expiredTokenError = {
        response: { status: 401 },
      };

      try {
        await responseErrorHandler(expiredTokenError);
      } catch (e) {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
        expect(mockLocation.href).toBe('/login');
      }
    });
  });
});


