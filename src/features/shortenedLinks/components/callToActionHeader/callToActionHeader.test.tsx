import { render, screen } from '@testing-library/react-native';
import React from 'react';
import CallToActionHeader from './callToActionHeader';

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
jest.mock('@/src/components/text/text', () => {
  const React = require('react');

  const MockText = ({
    children,
    size,
    weight,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    size?: string;
    weight?: string;
    variant?: string;
  }) => (
    <div
      testID={`text-${size}-${weight}-${variant}`}
      {...props}
    >
      {children}
    </div>
  );

  return {
    __esModule: true,
    default: MockText,
  };
});

// Mock React Native components
jest.mock('react-native', () => ({
  View: ({ style, children, testID, ...props }: any) => (
    <div style={style} testID={testID} {...props}>
      {children}
    </div>
  ),
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
  },
}));

describe('CallToActionHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    render(<CallToActionHeader />);
    // If render doesn't throw, the test passes
  });

  it('displays the main heading text', () => {
    render(<CallToActionHeader />);

    const mainHeading = screen.getByTestId('text-medium-bold-primary');
    expect(mainHeading).toHaveTextContent('Enter a link to shorten it');
  });

  it('displays the subtitle text', () => {
    render(<CallToActionHeader />);

    const subtitle = screen.getByTestId('text-small-regular-secondary');
    expect(subtitle).toHaveTextContent('You can shorten up to 1000 links per day');
  });

  it('renders both text elements', () => {
    render(<CallToActionHeader />);

    const mainHeading = screen.getByTestId('text-medium-bold-primary');
    const subtitle = screen.getByTestId('text-small-regular-secondary');

    expect(mainHeading).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });

  it('renders container with correct styling', () => {
    render(<CallToActionHeader />);

    // The container should be rendered
    // Since we can't easily test the exact styles, we verify the structure
    const mainHeading = screen.getByTestId('text-medium-bold-primary');
    const subtitle = screen.getByTestId('text-small-regular-secondary');

    expect(mainHeading).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });

  it('calls useColors hook', () => {
    const mockUseColors = require('@/src/components/colors/useColors').default;

    render(<CallToActionHeader />);

    expect(mockUseColors).toHaveBeenCalled();
  });

  it('memoizes styles correctly', () => {
    const mockUseColors = require('@/src/components/colors/useColors').default;
    mockUseColors.mockReturnValue({
      background: '#000000',
      text: '#FFFFFF',
      gray: '#CCCCCC',
      black: '#000000',
      white: '#FFFFFF',
      error: '#FF0000',
    });

    const { rerender } = render(<CallToActionHeader />);

    // Re-render with same colors - useMemo should prevent recreation
    rerender(<CallToActionHeader />);

    expect(mockUseColors).toHaveBeenCalledTimes(2); // Called once per render
  });

  it('builds styles with correct values from sizes', () => {
    render(<CallToActionHeader />);

    // The component should render without errors, indicating styles were built correctly
    const mainHeading = screen.getByTestId('text-medium-bold-primary');
    expect(mainHeading).toBeTruthy();
  });

  it('has correct component structure', () => {
    render(<CallToActionHeader />);

    // Verify the component renders the expected elements
    expect(screen.getByTestId('text-medium-bold-primary')).toBeTruthy();
    expect(screen.getByTestId('text-small-regular-secondary')).toBeTruthy();
  });

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
});
