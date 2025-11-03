import { renderHook } from '@testing-library/react-native';
import useColors from './useColors';

// Mock the app store
jest.mock('@/src/store/appStore/appStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    theme: 'LIGHT',
  })),
  Theme: {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
  },
}));

describe('useColors', () => {
  it('returns light colors when theme is LIGHT', () => {
    const mockStore = require('@/src/store/appStore/appStore');
    mockStore.default.mockReturnValue({ theme: 'LIGHT' });

    const { result } = renderHook(() => useColors());

    expect(result.current).toEqual({
      background: '#FFFFFF',
      text: '#000000',
      gray: '#808080',
      black: '#000000',
      white: '#FFFFFF',
      error: '#DC143C',
    });
  });

  it('returns dark colors when theme is DARK', () => {
    const mockStore = require('@/src/store/appStore/appStore');
    mockStore.default.mockReturnValue({ theme: 'DARK' });

    const { result } = renderHook(() => useColors());

    expect(result.current).toEqual({
      background: '#000000',
      text: '#FFFFFF',
      gray: '#808080',
      black: '#000000',
      error: '#DC143C',
    });
  });

  it('memoizes colors based on theme', () => {
    const mockStore = require('@/src/store/appStore/appStore');
    mockStore.default.mockReturnValue({ theme: 'LIGHT' });

    const { result, rerender } = renderHook(() => useColors());

    const firstResult = result.current;

    // Rerender with same theme
    rerender(() => useColors());
    const secondResult = result.current;

    // Should be the same object reference (memoized)
    expect(firstResult).toBe(secondResult);
  });

  it('updates colors when theme changes', () => {
    const mockStore = require('@/src/store/appStore/appStore');
    mockStore.default.mockReturnValue({ theme: 'LIGHT' });

    const { result, rerender } = renderHook(() => useColors());

    const lightColors = result.current;

    // Change theme to dark
    mockStore.default.mockReturnValue({ theme: 'DARK' });
    rerender(() => useColors());

    const darkColors = result.current;

    // Colors should be different
    expect(lightColors).not.toEqual(darkColors);
    expect(lightColors.background).toBe('#FFFFFF');
    expect(darkColors.background).toBe('#000000');
  });
});
