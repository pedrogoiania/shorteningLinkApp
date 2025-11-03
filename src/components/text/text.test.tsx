import React from 'react';
import { render } from '@testing-library/react-native';
import Text from './text';

// Mock the colors hook
jest.mock('../colors/useColors', () => ({
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

// Mock sizes
jest.mock('../sizes/sizes', () => ({
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
  },
}));

describe('Text', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text content correctly', () => {
    const { getByText } = render(<Text>Test Content</Text>);
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies default styles (medium size, regular weight, primary variant)', () => {
    const { getByText } = render(<Text>Test</Text>);
    const textElement = getByText('Test');

    // Check that it has the expected style properties
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 16 }), // medium
        expect.objectContaining({ fontWeight: 'regular' }), // regular
        expect.objectContaining({ color: '#000000' }), // primary
      ])
    );
  });

  it('applies small size correctly', () => {
    const { getByText } = render(<Text size="small">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 12 }),
      ])
    );
  });

  it('applies large size correctly', () => {
    const { getByText } = render(<Text size="large">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 20 }),
      ])
    );
  });

  it('applies bold weight correctly', () => {
    const { getByText } = render(<Text weight="bold">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: 'bold' }),
      ])
    );
  });

  it('applies light weight correctly', () => {
    const { getByText } = render(<Text weight="light">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: 'light' }),
      ])
    );
  });

  it('applies secondary variant correctly', () => {
    const { getByText } = render(<Text variant="secondary">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#808080' }), // gray
      ])
    );
  });

  it('applies error variant correctly', () => {
    const { getByText } = render(<Text variant="error">Test</Text>);
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#DC143C' }), // error
      ])
    );
  });

  it('combines multiple style props correctly', () => {
    const { getByText } = render(
      <Text size="large" weight="bold" variant="error">
        Test
      </Text>
    );
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 20 }), // large
        expect.objectContaining({ fontWeight: 'bold' }), // bold
        expect.objectContaining({ color: '#DC143C' }), // error
      ])
    );
  });

  it('applies custom style alongside default styles', () => {
    const customStyle = { marginTop: 10 };
    const { getByText } = render(
      <Text style={customStyle}>Test</Text>
    );
    const textElement = getByText('Test');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ marginTop: 10 }),
        expect.objectContaining({ fontSize: 16 }), // default medium
      ])
    );
  });

  it('passes through other Text props', () => {
    const { getByText } = render(
      <Text numberOfLines={2} ellipsizeMode="tail">
        Test Content
      </Text>
    );
    const textElement = getByText('Test Content');

    expect(textElement.props.numberOfLines).toBe(2);
    expect(textElement.props.ellipsizeMode).toBe('tail');
  });
});
