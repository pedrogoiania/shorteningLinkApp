import { renderHook } from '@testing-library/react-native';
import useShortenerRepository from './useShortenerRepository';

// Mock the service - create a mock service object
const mockService = {
  shortenUrl: jest.fn(),
  getShortenedLink: jest.fn(),
};

// Mock the service hook
jest.mock('../services/useShortenerService', () => ({
  __esModule: true,
  default: jest.fn(() => mockService),
}));

// Mock the store
jest.mock('@/src/store/shortenedLinksStore/shortenedLinksStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useShortenedLinksStore from '@/src/store/shortenedLinksStore/shortenedLinksStore';
const mockUseShortenedLinksStore = useShortenedLinksStore as jest.MockedFunction<typeof useShortenedLinksStore>;

describe('useShortenerRepository', () => {
  const mockStore = {
    shortenedLinks: [],
    addShortenedLink: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseShortenedLinksStore.mockReturnValue(mockStore);
    // Suppress console.error during tests to avoid noisy output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('shortenUrl', () => {
    it('should successfully shorten URL and add to store', async () => {
      const shortenedLinkWireIn = {
        id: 'abc123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      };

      mockService.shortenUrl.mockResolvedValue(shortenedLinkWireIn);

      const { result } = renderHook(() => useShortenerRepository());

      const shortenedLinkWireOut = {
        originalUrl: 'https://example.com',
      };

      const resultLink = await result.current.shortenUrl(shortenedLinkWireOut);

      expect(mockService.shortenUrl).toHaveBeenCalledWith(shortenedLinkWireOut);
      expect(mockStore.addShortenedLink).toHaveBeenCalledWith(shortenedLinkWireIn);
      expect(resultLink).toBe(shortenedLinkWireIn);
    });

    it('should throw error when service fails', async () => {
      const mockError = new Error('Service error');
      mockService.shortenUrl.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenerRepository());

      const shortenedLinkWireOut = {
        originalUrl: 'https://example.com',
      };

      await expect(result.current.shortenUrl(shortenedLinkWireOut)).rejects.toThrow('Service error');
      expect(mockStore.addShortenedLink).not.toHaveBeenCalled();
    });
  });

  describe('getShortenedLink', () => {
    it('should return cached link from store if available', async () => {
      const cachedLink = {
        id: 'abc123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      };

      const storeWithCachedLink = {
        ...mockStore,
        shortenedLinks: [cachedLink],
      };

      mockUseShortenedLinksStore.mockReturnValue(storeWithCachedLink);

      const { result } = renderHook(() => useShortenerRepository());

      const link = await result.current.getShortenedLink('abc123');

      expect(link).toBe(cachedLink);
      expect(mockService.getShortenedLink).not.toHaveBeenCalled();
    });

    it('should fetch from service when not in cache', async () => {
      const fetchedLink = {
        id: 'def456',
        originalUrl: 'https://test.com',
        shortenedUrl: 'https://short.ly/def456',
      };

      mockService.getShortenedLink.mockResolvedValue(fetchedLink);

      const { result } = renderHook(() => useShortenerRepository());

      const link = await result.current.getShortenedLink('def456');

      expect(mockService.getShortenedLink).toHaveBeenCalledWith('def456');
      expect(link).toBe(fetchedLink);
    });

    it('should throw error when service fetch fails', async () => {
      const mockError = new Error('Fetch failed');
      mockService.getShortenedLink.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenerRepository());

      await expect(result.current.getShortenedLink('nonexistent')).rejects.toThrow('Fetch failed');
    });

    it('should handle multiple links in cache correctly', async () => {
      const links = [
        {
          id: 'abc123',
          originalUrl: 'https://example.com',
          shortenedUrl: 'https://short.ly/abc123',
        },
        {
          id: 'def456',
          originalUrl: 'https://test.com',
          shortenedUrl: 'https://short.ly/def456',
        },
      ];

      const storeWithMultipleLinks = {
        ...mockStore,
        shortenedLinks: links,
      };

      mockUseShortenedLinksStore.mockReturnValue(storeWithMultipleLinks);

      const { result } = renderHook(() => useShortenerRepository());

      const link1 = await result.current.getShortenedLink('abc123');
      const link2 = await result.current.getShortenedLink('def456');

      expect(link1).toBe(links[0]);
      expect(link2).toBe(links[1]);
      expect(mockService.getShortenedLink).not.toHaveBeenCalled();
    });
  });

  describe('shortenedLinks', () => {
    it('should return shortenedLinks from store', () => {
      const links = [
        {
          id: 'abc123',
          originalUrl: 'https://example.com',
          shortenedUrl: 'https://short.ly/abc123',
        },
      ];

      const storeWithLinks = {
        ...mockStore,
        shortenedLinks: links,
      };

      mockUseShortenedLinksStore.mockReturnValue(storeWithLinks);

      const { result } = renderHook(() => useShortenerRepository());

      expect(result.current.shortenedLinks).toBe(links);
    });
  });

  describe('dependency injection', () => {
    it('should use provided service when passed as parameter', async () => {
      const customService = {
        shortenUrl: jest.fn().mockResolvedValue({
          id: 'custom123',
          originalUrl: 'https://custom.com',
          shortenedUrl: 'https://short.ly/custom123',
        }),
        getShortenedLink: jest.fn(),
      };

      const { result } = renderHook(() => useShortenerRepository(customService));

      const shortenedLinkWireOut = {
        originalUrl: 'https://custom.com',
      };

      await result.current.shortenUrl(shortenedLinkWireOut);

      expect(customService.shortenUrl).toHaveBeenCalledWith(shortenedLinkWireOut);
      expect(mockService.shortenUrl).not.toHaveBeenCalled();
    });
  });

  describe('hook structure', () => {
    it('should return an object with shortenUrl, getShortenedLink, and shortenedLinks', () => {
      const { result } = renderHook(() => useShortenerRepository());

      expect(result.current).toHaveProperty('shortenUrl');
      expect(result.current).toHaveProperty('getShortenedLink');
      expect(result.current).toHaveProperty('shortenedLinks');
      expect(typeof result.current.shortenUrl).toBe('function');
      expect(typeof result.current.getShortenedLink).toBe('function');
      expect(Array.isArray(result.current.shortenedLinks)).toBe(true);
    });
  });
});
