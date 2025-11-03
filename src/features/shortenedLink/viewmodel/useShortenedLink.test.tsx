import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import useShortenedLink from './useShortenedLink';

// Mock the repository
const mockGetShortenedLink = jest.fn();
jest.mock('../../../data/repositories/useShortenerRepository', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getShortenedLink: mockGetShortenedLink,
  })),
}));

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useShortenedLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests to avoid noisy output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getShortenedLinkData', () => {
    it('should successfully get shortened link data', async () => {
      const mockLink = {
        id: 'abc123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      };

      mockGetShortenedLink.mockResolvedValue(mockLink);

      const { result } = renderHook(() => useShortenedLink());

      const link = await result.current.getShortenedLinkData('abc123');

      expect(mockGetShortenedLink).toHaveBeenCalledWith('abc123');
      expect(link).toBe(mockLink);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should return null and show alert when repository throws an error', async () => {
      const mockError = new Error('Link not found');
      mockGetShortenedLink.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenedLink());

      const link = await result.current.getShortenedLinkData('nonexistent');

      expect(mockGetShortenedLink).toHaveBeenCalledWith('nonexistent');
      expect(link).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Failed to get shortened link data',
        'Link not found'
      );
    });

    it('should return null and show alert with unknown error message when error is not an Error instance', async () => {
      const mockError = 'String error';
      mockGetShortenedLink.mockRejectedValue(mockError);

      const { result } = renderHook(() => useShortenedLink());

      const link = await result.current.getShortenedLinkData('test');

      expect(link).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Failed to get shortened link data',
        'Unknown error'
      );
    });
  });

  describe('hook structure', () => {
    it('should return an object with getShortenedLinkData function', () => {
      const { result } = renderHook(() => useShortenedLink());

      expect(result.current).toHaveProperty('getShortenedLinkData');
      expect(typeof result.current.getShortenedLinkData).toBe('function');
    });
  });
});
