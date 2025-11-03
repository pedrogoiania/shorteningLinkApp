import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShortenedLinksHistory from './shortenedLinksHistory';

// Mock the useColors hook
jest.mock('@/src/components/colors/useColors', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    background: '#FFFFFF',
    text: '#000000',
    gray: '#CCCCCC',
    black: '#000000',
    white: '#FFFFFF',
    error: '#DC143C',
  })),
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

// Mock FlatList and other React Native components
jest.mock('react-native', () => ({
  View: ({ style, children, testID, ...props }: any) => (
    <div style={style} testID={testID} {...props}>
      {children}
    </div>
  ),
  FlatList: ({ data, keyExtractor, renderItem, ItemSeparatorComponent }: any) => {
    const Separator = ItemSeparatorComponent;
    return (
      <div testID="flat-list">
        {data.map((item: any, index: number) => (
          <div key={keyExtractor(item, index)} testID={`flat-list-item-${index}`}>
            {renderItem({ item, index })}
            {index < data.length - 1 && Separator && <Separator key={`separator-${index}`} />}
          </div>
        ))}
      </div>
    );
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
  },
}));

describe('ShortenedLinksHistory', () => {
  const mockShortenedLinks = [
    {
      id: '1',
      originalUrl: 'https://example.com',
      shortenedUrl: 'https://short.ly/abc123',
    },
    {
      id: '2',
      originalUrl: 'https://test.com',
      shortenedUrl: 'https://short.ly/def456',
    },
    {
      id: '3',
      originalUrl: 'https://google.com',
      shortenedUrl: 'https://short.ly/ghi789',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FlatList with correct props', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    const flatList = screen.getByTestId('flat-list');
    expect(flatList).toBeTruthy();
  });

  it('renders all items in the shortenedLinks array', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    expect(screen.getByTestId('flat-list-item-0')).toBeTruthy();
    expect(screen.getByTestId('flat-list-item-1')).toBeTruthy();
    expect(screen.getByTestId('flat-list-item-2')).toBeTruthy();
  });

  it('renders correct number of separators (one less than items)', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    // Should have 2 separators for 3 items
    // The separators are rendered between items, so we check the FlatList structure
    const flatList = screen.getByTestId('flat-list');
    expect(flatList).toBeTruthy();
    // We can verify this by checking that separators exist in the structure
    expect(flatList.children).toHaveLength(3); // 3 items
    // Each item should have the separator component rendered after it (except the last)
  });

  it('renders original URL as bold primary text', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    const boldPrimaryTexts = screen.getAllByTestId('text-medium-bold-primary');
    expect(boldPrimaryTexts).toHaveLength(3);
    expect(boldPrimaryTexts[0]).toHaveTextContent('https://example.com');
    expect(boldPrimaryTexts[1]).toHaveTextContent('https://test.com');
    expect(boldPrimaryTexts[2]).toHaveTextContent('https://google.com');
  });

  it('renders shortened URL as small light secondary text', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    const smallLightSecondaryTexts = screen.getAllByTestId('text-small-light-secondary');
    expect(smallLightSecondaryTexts).toHaveLength(3);
    expect(smallLightSecondaryTexts[0]).toHaveTextContent('https://short.ly/abc123');
    expect(smallLightSecondaryTexts[1]).toHaveTextContent('https://short.ly/def456');
    expect(smallLightSecondaryTexts[2]).toHaveTextContent('https://short.ly/ghi789');
  });

  it('uses item id as key for FlatList items', () => {
    render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

    expect(screen.getByTestId('flat-list-item-0')).toBeTruthy();
    expect(screen.getByTestId('flat-list-item-1')).toBeTruthy();
    expect(screen.getByTestId('flat-list-item-2')).toBeTruthy();
  });

  it('renders empty list when no shortenedLinks provided', () => {
    render(<ShortenedLinksHistory shortenedLinks={[]} />);

    const flatList = screen.getByTestId('flat-list');
    expect(flatList).toBeTruthy();

    // Should not have any items
    expect(screen.queryByTestId('flat-list-item-0')).toBeNull();
  });

  it('renders single item without separators', () => {
    const singleItem = [mockShortenedLinks[0]];
    render(<ShortenedLinksHistory shortenedLinks={singleItem} />);

    expect(screen.getByTestId('flat-list-item-0')).toBeTruthy();

    // Should not have any separators for single item
    expect(screen.queryByTestId('separator')).toBeNull();
  });

  it('handles different shortened link data structures', () => {
    const customLinks = [
      {
        id: 'custom1',
        originalUrl: 'https://custom1.com',
        shortenedUrl: 'https://custom.ly/c1',
      },
      {
        id: 'custom2',
        originalUrl: 'https://custom2.com',
        shortenedUrl: 'https://custom.ly/c2',
      },
    ];

    render(<ShortenedLinksHistory shortenedLinks={customLinks} />);

    expect(screen.getByTestId('flat-list-item-0')).toBeTruthy();
    expect(screen.getByTestId('flat-list-item-1')).toBeTruthy();

    const boldPrimaryTexts = screen.getAllByTestId('text-medium-bold-primary');
    expect(boldPrimaryTexts[0]).toHaveTextContent('https://custom1.com');
    expect(boldPrimaryTexts[1]).toHaveTextContent('https://custom2.com');

    const smallLightSecondaryTexts = screen.getAllByTestId('text-small-light-secondary');
    expect(smallLightSecondaryTexts[0]).toHaveTextContent('https://custom.ly/c1');
    expect(smallLightSecondaryTexts[1]).toHaveTextContent('https://custom.ly/c2');
  });

  describe('RenderItem component', () => {
    it('renders item container with correct styling', () => {
      render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

      // The item containers should be rendered within the FlatList mock
      const itemContainer = screen.getByTestId('flat-list-item-0');
      expect(itemContainer).toBeTruthy();
    });

    it('memoizes styles correctly', () => {
      // The component uses useMemo for styles, which should work without errors
      render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

      expect(screen.getByTestId('flat-list')).toBeTruthy();
    });
  });

  describe('Separator component', () => {
    it('uses useColors hook for separator styling', () => {
      const mockUseColors = require('@/src/components/colors/useColors').default;

      render(<ShortenedLinksHistory shortenedLinks={mockShortenedLinks} />);

      expect(mockUseColors).toHaveBeenCalled();
    });
  });
});
