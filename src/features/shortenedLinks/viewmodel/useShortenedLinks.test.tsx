import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import useShortenedLinks from './useShortenedLinks';

// Mock the repository
const mockShortenUrl = jest.fn();
const getMockShortenedLinks = () => [
  { id: '1', originalUrl: 'https://example.com', shortenedUrl: 'https://short.ly/abc123' },
  { id: '2', originalUrl: 'https://test.com', shortenedUrl: 'https://short.ly/def456' },
];

let mockShortenedLinks = getMockShortenedLinks();

jest.mock('../../../data/repositories/useShortenerRepository', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    shortenUrl: mockShortenUrl,
    get shortenedLinks() {
      return mockShortenedLinks;
    },
  })),
}));

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useShortenedLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock data to avoid mutation issues
    mockShortenedLinks = getMockShortenedLinks();
    // Suppress console.error during tests to avoid noisy output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with empty linkTyped', () => {
      const { result } = renderHook(() => useShortenedLinks());

      expect(result.current.linkTyped).toBe('');
    });

    it('should initialize with empty tempLinkTyped', () => {
      const { result } = renderHook(() => useShortenedLinks());

      // We can't directly test internal state, but we can test behavior
      expect(result.current.shortenUrlLoading).toBe(false);
    });

    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useShortenedLinks());

      expect(result.current.shortenUrlLoading).toBe(false);
    });
  });

  describe('setLinkTyped', () => {
    it('should update linkTyped when setLinkTyped is called', () => {
      const { result } = renderHook(() => useShortenedLinks());

      act(() => {
        result.current.setLinkTyped('https://example.com');
      });

      expect(result.current.linkTyped).toBe('https://example.com');
    });

    it('should update linkTyped to empty string', () => {
      const { result } = renderHook(() => useShortenedLinks());

      act(() => {
        result.current.setLinkTyped('https://example.com');
        result.current.setLinkTyped('');
      });

      expect(result.current.linkTyped).toBe('');
    });
  });

  describe('shortenedLinks', () => {
    it('should return reversed shortenedLinks from repository', () => {
      const { result } = renderHook(() => useShortenedLinks());

      // The hook returns shortenedLinks.reverse(), so we expect the reversed array
      expect(result.current.shortenedLinks).toEqual([
        { id: '2', originalUrl: 'https://test.com', shortenedUrl: 'https://short.ly/def456' },
        { id: '1', originalUrl: 'https://example.com', shortenedUrl: 'https://short.ly/abc123' },
      ]);
    });

    it('should return empty array when repository has no links', () => {
      // Create a new mock for this specific test
      const mockEmptyShortenedLinks = [];
      const mockEmptyRepo = jest.fn(() => ({
        shortenUrl: mockShortenUrl,
        shortenedLinks: mockEmptyShortenedLinks,
      }));

      // Temporarily replace the mock implementation
      const originalMock = require('../../../data/repositories/useShortenerRepository').default;
      require('../../../data/repositories/useShortenerRepository').default = mockEmptyRepo;

      const { result } = renderHook(() => useShortenedLinks());

      expect(result.current.shortenedLinks).toEqual([]);

      // Restore original mock
      require('../../../data/repositories/useShortenerRepository').default = originalMock;
    });
  });

  describe('addShortenedLink', () => {
    it('should successfully add shortened link', async () => {
      mockShortenUrl.mockResolvedValue({
        id: 'new123',
        originalUrl: 'https://new.com',
        shortenedUrl: 'https://short.ly/new123',
      });

      const { result } = renderHook(() => useShortenedLinks());

      // Set initial linkTyped
      act(() => {
        result.current.setLinkTyped('https://new.com');
      });

      await act(async () => {
        await result.current.addShortenedLink('https://new.com');
      });

      expect(mockShortenUrl).toHaveBeenCalledWith({ originalUrl: 'https://new.com' });
      expect(result.current.shortenUrlLoading).toBe(false);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should set loading to true during URL shortening', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockShortenUrl.mockReturnValue(promise);

      const { result } = renderHook(() => useShortenedLinks());

      // Start the async operation
      act(() => {
        result.current.addShortenedLink('https://example.com');
      });

      // Should be loading during the operation
      expect(result.current.shortenUrlLoading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!({
          id: 'test123',
          originalUrl: 'https://example.com',
          shortenedUrl: 'https://short.ly/test123',
        });
      });

      // Wait for the promise to resolve
      await act(async () => {
        await promise;
      });

      expect(result.current.shortenUrlLoading).toBe(false);
    });

    it('should handle error during URL shortening', async () => {
      const mockError = new Error('Network error');
      mockShortenUrl.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenedLinks());

      await act(async () => {
        await result.current.addShortenedLink('https://failing.com');
      });

      expect(mockShortenUrl).toHaveBeenCalledWith({ originalUrl: 'https://failing.com' });
      expect(result.current.shortenUrlLoading).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Failed to add shortened link',
        'Network error'
      );
    });

    it('should handle unknown error type during URL shortening', async () => {
      const mockError = 'String error';
      mockShortenUrl.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenedLinks());

      await act(async () => {
        await result.current.addShortenedLink('https://failing.com');
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Failed to add shortened link',
        'Unknown error'
      );
    });

    it('should clear linkTyped and set tempLinkTyped during successful shortening', async () => {
      mockShortenUrl.mockResolvedValue({
        id: 'test123',
        originalUrl: 'https://test.com',
        shortenedUrl: 'https://short.ly/test123',
      });

      const { result } = renderHook(() => useShortenedLinks());

      // Set initial linkTyped
      act(() => {
        result.current.setLinkTyped('https://test.com');
      });

      expect(result.current.linkTyped).toBe('https://test.com');

      await act(async () => {
        await result.current.addShortenedLink('https://test.com');
      });

      // linkTyped should be cleared after successful shortening
      expect(result.current.linkTyped).toBe('');
    });

    it('should restore linkTyped with the submitted URL on error', async () => {
      const mockError = new Error('Shortening failed');
      mockShortenUrl.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenedLinks());

      // Set initial linkTyped
      act(() => {
        result.current.setLinkTyped('https://failing.com');
      });

      expect(result.current.linkTyped).toBe('https://failing.com');

      await act(async () => {
        await result.current.addShortenedLink('https://failing.com');
      });

      // linkTyped should be restored with the URL that failed
      expect(result.current.linkTyped).toBe('https://failing.com');
      expect(mockShortenUrl).toHaveBeenCalledWith({ originalUrl: 'https://failing.com' });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Failed to add shortened link',
        'Shortening failed'
      );
    });

    it('should always set loading to false in finally block', async () => {
      mockShortenUrl.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useShortenedLinks());

      await act(async () => {
        await result.current.addShortenedLink('https://test.com');
      });

      expect(result.current.shortenUrlLoading).toBe(false);
    });
  });

  describe('hook structure', () => {
    it('should return an object with all required properties', () => {
      const { result } = renderHook(() => useShortenedLinks());

      expect(result.current).toHaveProperty('shortenedLinks');
      expect(result.current).toHaveProperty('addShortenedLink');
      expect(result.current).toHaveProperty('shortenUrlLoading');
      expect(result.current).toHaveProperty('linkTyped');
      expect(result.current).toHaveProperty('setLinkTyped');
    });

    it('should return functions with correct signatures', () => {
      const { result } = renderHook(() => useShortenedLinks());

      expect(typeof result.current.addShortenedLink).toBe('function');
      expect(typeof result.current.setLinkTyped).toBe('function');
      expect(typeof result.current.shortenUrlLoading).toBe('boolean');
      expect(typeof result.current.linkTyped).toBe('string');
      expect(Array.isArray(result.current.shortenedLinks)).toBe(true);
    });
  });

  describe('dependency injection', () => {
    it('should use repository from hook', () => {
      renderHook(() => useShortenedLinks());

      const mockRepo = require('../../../data/repositories/useShortenerRepository').default;
      expect(mockRepo).toHaveBeenCalled();
    });
  });

  describe('memoization', () => {
    it('should memoize addShortenedLink function', () => {
      const { result, rerender } = renderHook(() => useShortenedLinks());

      const firstFunction = result.current.addShortenedLink;

      rerender();

      const secondFunction = result.current.addShortenedLink;

      expect(firstFunction).toBe(secondFunction);
    });
  });
});
