import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View as MockView } from 'react-native';
import TextInput from './textInput';

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

// Mock the text component
jest.mock('../text/text', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <span testID="error-text" {...props}>
      {children}
    </span>
  ),
}));


// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  FontAwesome6: ({ name, size, color, ...props }: any) => (
    <MockView testID="icon" data-name={name} data-size={size} data-color={color} {...props} />
  ),
}));

describe('TextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders TextInput with default props', () => {
    const { getByTestId } = render(<TextInput />);
    expect(getByTestId('text-input-field')).toBeTruthy();
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('renders submit button when showSubmitButton is true', () => {
    const { getByTestId } = render(<TextInput showSubmitButton />);
    expect(getByTestId('submit-button')).toBeTruthy();
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('does not render submit button when showSubmitButton is false', () => {
    const { queryByTestId } = render(<TextInput showSubmitButton={false} />);
    expect(queryByTestId('submit-button')).toBeNull();
  });

  it('calls onSubmit when submit button is pressed', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <TextInput showSubmitButton onSubmit={onSubmit} />
    );

    fireEvent.press(getByTestId('submit-button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading is true', () => {
    const { getByTestId, queryByTestId } = render(
      <TextInput showSubmitButton loading />
    );

    // ActivityIndicator should be present
    expect(getByTestId('submit-button')).toBeTruthy();
    // Icon should not be present when loading
    expect(queryByTestId('icon')).toBeNull();
  });

  it('disables submit button when loading is true', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <TextInput showSubmitButton loading onSubmit={onSubmit} />
    );

    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const { getByTestId } = render(
      <TextInput error="This is an error" />
    );

    expect(getByTestId('error-text')).toBeTruthy();
  });

  it('does not display error message when error prop is not provided', () => {
    const { queryByTestId } = render(<TextInput />);
    expect(queryByTestId('error-text')).toBeNull();
  });

  it('passes through TextInput props correctly', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <TextInput
        value="test value"
        placeholder="Enter text"
        onChangeText={onChangeText}
        editable={true}
        keyboardType="email-address"
      />
    );

    const textInput = getByTestId('text-input-field');
    expect(textInput.props.value).toBe('test value');
    expect(textInput.props.placeholder).toBe('Enter text');
    expect(textInput.props.editable).toBe(true);
    expect(textInput.props.keyboardType).toBe('email-address');

    fireEvent.changeText(textInput, 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });


  it('forwards ref correctly', () => {
    const ref = React.createRef<any>();
    render(<TextInput ref={ref} />);

    expect(ref.current).toBeTruthy();
  });

  it('renders with correct container styles', () => {
    const { getByTestId } = render(<TextInput />);
    const container = getByTestId('text-input');

    // Should have the main container with height: 60
    expect(container.parent.props.style).toEqual(
      expect.objectContaining({ height: 60 })
    );
  });

  it('renders error container when error is provided', () => {
    const { getByTestId } = render(<TextInput error="Error" />);
    expect(getByTestId('error-text')).toBeTruthy();
  });
});
