import { renderHook, waitFor } from '@testing-library/react-native';
import { api } from '@/src/core/network/shortenerServer/shortenerServer';
import useShortenerService from './useShortenerService';

// Mock the API
jest.mock('@/src/core/network/shortenerServer/shortenerServer');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useShortenerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests to avoid noisy output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('shortenUrl', () => {
    it('should successfully shorten a URL', async () => {
      const mockResponse = {
        data: {
          alias: 'abc123',
          _links: {
            self: 'https://example.com',
            short: 'https://short.ly/abc123',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useShortenerService());

      const shortenedLinkWireOut = {
        originalUrl: 'https://example.com',
      };

      const shortenedLink = await result.current.shortenUrl(shortenedLinkWireOut);

      expect(mockedApi.post).toHaveBeenCalledWith('/alias', {
        url: 'https://example.com',
      });

      expect(shortenedLink).toEqual({
        id: 'abc123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      });
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      mockedApi.post.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenerService());

      const shortenedLinkWireOut = {
        originalUrl: 'https://example.com',
      };

      await expect(result.current.shortenUrl(shortenedLinkWireOut)).rejects.toThrow('Network error');

      expect(mockedApi.post).toHaveBeenCalledWith('/alias', {
        url: 'https://example.com',
      });
    });

    it('should handle different URL formats', async () => {
      const mockResponse = {
        data: {
          alias: 'def456',
          _links: {
            self: 'https://test.com/path?query=value',
            short: 'https://short.ly/def456',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useShortenerService());

      const shortenedLinkWireOut = {
        originalUrl: 'https://test.com/path?query=value',
      };

      const shortenedLink = await result.current.shortenUrl(shortenedLinkWireOut);

      expect(shortenedLink).toEqual({
        id: 'def456',
        originalUrl: 'https://test.com/path?query=value',
        shortenedUrl: 'https://short.ly/def456',
      });
    });
  });

  describe('getShortenedLink', () => {
    it('should successfully get a shortened link by id', async () => {
      const mockResponse = {
        data: {
          alias: 'abc123',
          _links: {
            self: 'https://example.com',
            short: 'https://short.ly/abc123',
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useShortenerService());

      const shortenedLink = await result.current.getShortenedLink('abc123');

      expect(mockedApi.get).toHaveBeenCalledWith('/alias/abc123');

      expect(shortenedLink).toEqual({
        id: 'abc123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      });
    });

    it('should throw error when get API call fails', async () => {
      const mockError = new Error('Not found');
      mockedApi.get.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenerService());

      await expect(result.current.getShortenedLink('nonexistent')).rejects.toThrow('Not found');

      expect(mockedApi.get).toHaveBeenCalledWith('/alias/nonexistent');
    });

    it('should handle different id formats', async () => {
      const mockResponse = {
        data: {
          alias: 'test-123',
          _links: {
            self: 'https://test.com',
            short: 'https://short.ly/test-123',
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useShortenerService());

      const shortenedLink = await result.current.getShortenedLink('test-123');

      expect(mockedApi.get).toHaveBeenCalledWith('/alias/test-123');
      expect(shortenedLink.id).toBe('test-123');
    });
  });

  describe('hook structure', () => {
    it('should return an object with shortenUrl and getShortenedLink functions', () => {
      const { result } = renderHook(() => useShortenerService());

      expect(result.current).toHaveProperty('shortenUrl');
      expect(result.current).toHaveProperty('getShortenedLink');
      expect(typeof result.current.shortenUrl).toBe('function');
      expect(typeof result.current.getShortenedLink).toBe('function');
    });

    it('should maintain function references between renders', () => {
      const { result, rerender } = renderHook(() => useShortenerService());

      const firstRenderFunctions = result.current;
      rerender();

      expect(result.current.shortenUrl).toBe(firstRenderFunctions.shortenUrl);
      expect(result.current.getShortenedLink).toBe(firstRenderFunctions.getShortenedLink);
    });
  });
});
