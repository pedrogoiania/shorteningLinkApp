import { act, renderHook } from '@testing-library/react-native';
import { useColorScheme, Appearance } from 'react-native';
import useAppStore, { Theme, getInitialTheme, useInitializeTheme } from './appStore';

// Mock useColorScheme and Appearance
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
  Appearance: {
    getColorScheme: jest.fn(),
  },
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;
const mockGetColorScheme = Appearance.getColorScheme as jest.MockedFunction<typeof Appearance.getColorScheme>;

describe('getInitialTheme', () => {
  it('should return DARK theme when colorScheme is "dark"', () => {
    expect(getInitialTheme('dark')).toBe(Theme.DARK);
  });

  it('should return LIGHT theme when colorScheme is "light"', () => {
    expect(getInitialTheme('light')).toBe(Theme.LIGHT);
  });

  it('should return LIGHT theme when colorScheme is null', () => {
    expect(getInitialTheme(null)).toBe(Theme.LIGHT);
  });

  it('should return LIGHT theme when colorScheme is undefined', () => {
    expect(getInitialTheme(undefined)).toBe(Theme.LIGHT);
  });

  it('should return LIGHT theme for any other colorScheme value', () => {
    expect(getInitialTheme('unknown')).toBe(Theme.LIGHT);
    expect(getInitialTheme('')).toBe(Theme.LIGHT);
  });
});

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Set default return value for Appearance.getColorScheme
    mockGetColorScheme.mockReturnValue('light');
  });

  describe('Theme enum', () => {
    it('should have correct Theme values', () => {
      expect(Theme.LIGHT).toBe('light');
      expect(Theme.DARK).toBe('dark');
    });
  });


  describe('useInitializeTheme hook', () => {
    beforeEach(() => {
      // Reset store to default theme
      act(() => {
        useAppStore.getState().setTheme(Theme.LIGHT);
      });
    });

    it('should initialize with DARK theme when colorScheme is "dark"', () => {
      mockUseColorScheme.mockReturnValue('dark');

      renderHook(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.DARK);
    });

    it('should initialize with LIGHT theme when colorScheme is "light"', () => {
      mockUseColorScheme.mockReturnValue('light');

      renderHook(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.LIGHT);
    });

    it('should initialize with LIGHT theme when colorScheme is null', () => {
      mockUseColorScheme.mockReturnValue(null);

      renderHook(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.LIGHT);
    });

    it('should initialize with LIGHT theme when colorScheme is undefined', () => {
      mockUseColorScheme.mockReturnValue(undefined);

      renderHook(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.LIGHT);
    });

    it('should update theme when colorScheme changes', () => {
      mockUseColorScheme.mockReturnValue('light');

      const { rerender } = renderHook(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.LIGHT);

      // Change color scheme
      mockUseColorScheme.mockReturnValue('dark');

      rerender(() => useInitializeTheme());

      expect(useAppStore.getState().theme).toBe(Theme.DARK);
    });
  });

  describe('store functionality', () => {
    it('should allow theme switching from LIGHT to DARK', () => {
      const { result } = renderHook(() => useAppStore());

      // Set initial theme
      act(() => {
        useAppStore.getState().setTheme(Theme.LIGHT);
      });
      expect(result.current.theme).toBe(Theme.LIGHT);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.DARK);
    });

    it('should allow theme switching from DARK to LIGHT', () => {
      const { result } = renderHook(() => useAppStore());

      // Set initial theme
      act(() => {
        useAppStore.getState().setTheme(Theme.DARK);
      });
      expect(result.current.theme).toBe(Theme.DARK);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.LIGHT);
    });

    it('should toggle theme multiple times correctly', () => {
      const { result } = renderHook(() => useAppStore());

      // Set initial theme
      act(() => {
        useAppStore.getState().setTheme(Theme.LIGHT);
      });
      expect(result.current.theme).toBe(Theme.LIGHT);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.DARK);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.LIGHT);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.DARK);
    });
  });

  describe('store structure', () => {
    it('should return an object with theme, switchTheme, and setTheme', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('switchTheme');
      expect(result.current).toHaveProperty('setTheme');
      expect(typeof result.current.switchTheme).toBe('function');
      expect(typeof result.current.setTheme).toBe('function');
      expect(Object.values(Theme)).toContain(result.current.theme);
    });
  });

  describe('store state management', () => {
    it('should allow direct state access', () => {
      renderHook(() => useAppStore());

      // Test that we can access the store state directly
      const state = useAppStore.getState();
      expect(state).toHaveProperty('theme');
      expect(state).toHaveProperty('switchTheme');
      expect(state).toHaveProperty('setTheme');
      expect(typeof state.switchTheme).toBe('function');
      expect(typeof state.setTheme).toBe('function');
    });

    it('should allow direct state manipulation', () => {
      renderHook(() => useAppStore());

      // Set theme directly
      act(() => {
        useAppStore.setState({ theme: Theme.DARK });
      });

      const { theme } = useAppStore.getState();
      expect(theme).toBe(Theme.DARK);
    });
  });

  describe('switchTheme function', () => {
    it('should be a function that changes theme state', () => {
      const { result } = renderHook(() => useAppStore());

      const initialTheme = result.current.theme;
      const switchThemeFunction = result.current.switchTheme;

      expect(typeof switchThemeFunction).toBe('function');

      // Call the function
      act(() => {
        switchThemeFunction();
      });

      // Theme should have changed
      expect(result.current.theme).not.toBe(initialTheme);
    });

    it('should toggle between LIGHT and DARK themes', () => {
      const { result } = renderHook(() => useAppStore());

      // Test LIGHT -> DARK
      act(() => {
        useAppStore.getState().setTheme(Theme.LIGHT);
      });
      expect(result.current.theme).toBe(Theme.LIGHT);

      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.DARK);

      // Test DARK -> LIGHT
      act(() => {
        result.current.switchTheme();
      });
      expect(result.current.theme).toBe(Theme.LIGHT);
    });
  });

  describe('setTheme function', () => {
    it('should set theme to specified value', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme(Theme.DARK);
      });
      expect(result.current.theme).toBe(Theme.DARK);

      act(() => {
        result.current.setTheme(Theme.LIGHT);
      });
      expect(result.current.theme).toBe(Theme.LIGHT);
    });

    it('should be a function', () => {
      const { result } = renderHook(() => useAppStore());

      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('store subscription', () => {
    it('should allow subscribing to state changes', () => {
      const mockSubscriber = jest.fn();

      const unsubscribe = useAppStore.subscribe(mockSubscriber);

      // Trigger a state change
      act(() => {
        useAppStore.getState().switchTheme();
      });

      expect(mockSubscriber).toHaveBeenCalled();

      unsubscribe();
    });

    it('should stop calling subscriber after unsubscribe', () => {
      const mockSubscriber = jest.fn();

      const unsubscribe = useAppStore.subscribe(mockSubscriber);

      unsubscribe();

      // Trigger a state change - should not call subscriber anymore
      act(() => {
        useAppStore.getState().switchTheme();
      });

      expect(mockSubscriber).not.toHaveBeenCalled();
    });
  });
});
