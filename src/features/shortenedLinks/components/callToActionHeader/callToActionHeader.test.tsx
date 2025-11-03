// Mock React Native components
jest.mock('react-native', () => ({
  View: 'View',
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
}));

// Mock the custom hooks and components
jest.mock('@/src/components/colors/useColors', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    background: '#FFFFFF',
    text: '#000000',
    gray: '#808080',
    black: '#000000',
    white: '#FFFFFF',
    error: '#DC143C',
  })),
}));

jest.mock('@/src/components/sizes/sizes', () => ({
  __esModule: true,
  default: {
    fontSizes: {
      small: 12,
      medium: 16,
      large: 20,
    },
    fontWeights: {
      light: 'light',
      regular: 'regular',
      bold: 'bold',
    },
    paddingSizes: {
      small: 4,
      medium: 8,
      large: 16,
    },
    marginSizes: {
      small: 4,
      medium: 8,
      large: 16,
    },
    borderRadiusSizes: {
      small: 4,
      medium: 8,
      large: 16,
    },
    gapSizes: {
      small: 4,
      medium: 8,
      large: 16,
    },
  },
}));

// Mock the Text component
jest.mock('@/src/components/text/text', () => ({
  __esModule: true,
  default: 'MockedTextComponent',
}));

describe('CallToActionHeader', () => {
  it('can be imported without errors', () => {
    // This test verifies that the original "Cannot use namespace 'jest' as a value" error is fixed
    const CallToActionHeader = require('./callToActionHeader').default;
    expect(CallToActionHeader).toBeDefined();
    expect(typeof CallToActionHeader).toBe('function');
  });

  it('has correct component name', () => {
    const CallToActionHeader = require('./callToActionHeader').default;
    expect(CallToActionHeader.name).toBe('CallToActionHeader');
  });

  it('jest.fn() works correctly', () => {
    // This test verifies that jest.fn() can be used without the namespace error
    const mockFunction = jest.fn(() => 'test result');
    expect(mockFunction()).toBe('test result');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
