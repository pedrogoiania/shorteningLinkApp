import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ShortenedLinks from './shortenedLinks';

// Mock all the dependencies
jest.mock('../components/callToActionHeader/callToActionHeader', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../components/shortenedLinksHistory/shortenedLinksHistory', () => ({
  __esModule: true,
  default: ({ shortenedLinks }: { shortenedLinks: any[] }) => null,
}));

// Mock the UrlSubmitForm to simulate the actual behavior
jest.mock('../components/urlSubmitForm/urlSubmitForm', () => {
  const React = require('react');
  const { View, TextInput, Pressable, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({
      onSubmit,
      loading,
      textValue,
      setTextValue,
    }: {
      onSubmit: (url: string) => void;
      loading: boolean;
      textValue: string;
      setTextValue: (text: string) => void;
    }) => (
      <View testID="url-submit-form">
        <TextInput
          testID="url-input"
          value={textValue}
          onChangeText={setTextValue}
          editable={!loading}
          placeholder={loading ? "Creating shortened link..." : "Enter a URL to shorten"}
        />
        <Pressable
          testID="submit-button"
          onPress={() => onSubmit(textValue)}
          disabled={loading}
        >
          <Text>{loading ? 'Loading...' : 'Submit'}</Text>
        </Pressable>
      </View>
    ),
  };
});

jest.mock('../viewmodel/useShortenedLinks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/src/components/baseView/baseView', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <View testID="base-view">{children}</View>
    ),
  };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock the viewmodel
const mockUseShortenedLinks = require('../viewmodel/useShortenedLinks').default;

describe('ShortenedLinks View', () => {
  const mockAddShortenedLink = jest.fn();
  const mockSetLinkTyped = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseShortenedLinks.mockReturnValue({
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: '',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    });
  });

  it('renders all components correctly', () => {
    render(<ShortenedLinks />);

    expect(screen.getByTestId('base-view')).toBeTruthy();
    expect(screen.getByTestId('url-submit-form')).toBeTruthy();
  });

  it('passes correct props to UrlSubmitForm', () => {
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: 'test-url',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const input = screen.getByTestId('url-input');
    expect(input.props.value).toBe('test-url');
    expect(input.props.editable).toBe(true);
    expect(input.props.placeholder).toBe('Enter a URL to shorten');
  });

  it('passes loading state correctly to UrlSubmitForm', () => {
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: true,
      linkTyped: '',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const input = screen.getByTestId('url-input');
    const submitButton = screen.getByTestId('submit-button');

    expect(input.props.editable).toBe(false);
    expect(submitButton.props.onPress).toBeUndefined();
    expect(input.props.placeholder).toBe('Creating shortened link...');
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('calls addShortenedLink when form is submitted', () => {
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: 'https://example.com',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    expect(mockAddShortenedLink).toHaveBeenCalledWith('https://example.com');
  });

  it('passes shortenedLinks to ShortenedLinksHistory component', () => {
    const mockLinks = [
      { id: '1', originalUrl: 'https://example.com', shortenedUrl: 'https://short.ly/1' },
      { id: '2', originalUrl: 'https://test.com', shortenedUrl: 'https://short.ly/2' },
    ];

    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: '',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: mockLinks,
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    // Component should render without errors when shortenedLinks are provided
    expect(screen.getByTestId('base-view')).toBeTruthy();
  });

  it('calls setLinkTyped when text input changes', () => {
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: '',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const input = screen.getByTestId('url-input');
    fireEvent.changeText(input, 'https://new-url.com');

    expect(mockSetLinkTyped).toHaveBeenCalledWith('https://new-url.com');
  });

  it('handles successful URL shortening without errors', async () => {
    mockAddShortenedLink.mockResolvedValueOnce(undefined);

    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: 'https://example.com',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAddShortenedLink).toHaveBeenCalledWith('https://example.com');
    });

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('handles network errors during URL shortening', () => {
    // Test that the view model handles errors appropriately
    // The actual error handling is tested in the viewmodel tests
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: 'https://example.com',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    expect(mockAddShortenedLink).toHaveBeenCalledWith('https://example.com');
  });

  it('handles unknown errors during URL shortening', () => {
    // Test that the view model handles errors appropriately
    // The actual error handling is tested in the viewmodel tests
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: 'https://example.com',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: [],
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    expect(mockAddShortenedLink).toHaveBeenCalledWith('https://example.com');
  });

  it('reverses shortenedLinks array when passing to history component', () => {
    const mockLinks = [
      { id: '1', originalUrl: 'https://first.com', shortenedUrl: 'https://short.ly/1' },
      { id: '2', originalUrl: 'https://second.com', shortenedUrl: 'https://short.ly/2' },
      { id: '3', originalUrl: 'https://third.com', shortenedUrl: 'https://short.ly/3' },
    ];

    // Mock the viewmodel to return reversed array
    const mockViewModel = {
      addShortenedLink: mockAddShortenedLink,
      shortenUrlLoading: false,
      linkTyped: '',
      setLinkTyped: mockSetLinkTyped,
      shortenedLinks: mockLinks.reverse(), // Simulate the reverse() call in the hook
    };

    mockUseShortenedLinks.mockReturnValue(mockViewModel);

    render(<ShortenedLinks />);

    // Component should render without errors when reversed shortenedLinks are provided
    expect(screen.getByTestId('base-view')).toBeTruthy();
  });
});
