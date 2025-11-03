import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ShortenedLink from './shortenedLink';

// Mock the components
jest.mock('../../../components/baseView/baseView', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <View testID="base-view">{children}</View>
    ),
  };
});

jest.mock('../../../components/text/text', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <Text testID="text-component">{children}</Text>
    ),
  };
});

describe('ShortenedLink View', () => {
  it('renders the component correctly', () => {
    render(<ShortenedLink />);

    expect(screen.getByTestId('base-view')).toBeTruthy();
    expect(screen.getByTestId('text-component')).toBeTruthy();
  });

  it('displays the correct text content', () => {
    render(<ShortenedLink />);

    expect(screen.getByTestId('text-component')).toHaveTextContent(
      'Page for shortened link details'
    );
  });

  it('renders BaseView as the root component', () => {
    render(<ShortenedLink />);

    const baseView = screen.getByTestId('base-view');
    expect(baseView).toBeTruthy();

    // The text component should be a child of BaseView
    const textComponent = screen.getByTestId('text-component');
    expect(baseView).toContainElement(textComponent);
  });
});
