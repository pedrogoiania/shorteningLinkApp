import TextInput, { TextInputRef } from "@/src/components/textInput/textInput";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";

const buildStyles = () => {
  return StyleSheet.create({
    textInput: {
      textTransform: "lowercase",
    },
  });
};

const errorMessages = {
  dontAllowSpaces: "Spaces are not allowed",
  invalidUrl: "Should start with http:// or https://",
  empty: "Please enter a URL",
};

type UrlSubmitFormProps = {
  onSubmit: (url: string) => void;
  loading: boolean;
  textValue: string;
  setTextValue: (text: string) => void;
};

function UrlSubmitForm({
  onSubmit,
  loading,
  textValue,
  setTextValue,
}: UrlSubmitFormProps) {
  const styles = useMemo(() => buildStyles(), []);

  const [error, setError] = useState("");

  const defaultDismissErrorMessageTimeout = 10000;

  let intervalErrorMessage: NodeJS.Timeout | undefined;

  const textInputRef = useRef<TextInputRef>(null);

  const isValidUrl = useCallback((url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  }, []);

  const handleClearErrorMessage = useCallback(() => {
    setError("");
    if (intervalErrorMessage) {
      clearInterval(intervalErrorMessage);
    }
    intervalErrorMessage = undefined;
  }, []);

  const handleSubmit = useCallback(() => {
    if (loading) {
      return;
    }

    handleClearErrorMessage();

    if (!textValue.length) {
      return handleErrorMessage(errorMessages.empty);
    }

    if (!isValidUrl(textValue)) {
      return handleErrorMessage(errorMessages.invalidUrl);
    }

    textInputRef.current?.blur();

    onSubmit(textValue);
    setTextValue("");
  }, [textValue, onSubmit]);

  const handleErrorMessage = useCallback(
    (message: string) => {
      setError(message);

      intervalErrorMessage = setInterval(() => {
        handleClearErrorMessage();
      }, defaultDismissErrorMessageTimeout);
    },
    [error]
  );

  const handleChangeText = useCallback((text: string) => {
    if (loading) {
      return;
    }

    let valueToSet = text;

    if (text.includes(" ")) {
      valueToSet = valueToSet.trim();
      handleErrorMessage(errorMessages.dontAllowSpaces);
    }

    valueToSet = valueToSet.replace(/ /g, "");

    valueToSet = valueToSet.toLowerCase();

    setTextValue(valueToSet);
  }, []);

  return (
    <TextInput
      placeholder={
        loading ? "Creating shortened link..." : "Enter a URL to shorten"
      }
      editable={!loading}
      loading={loading}
      ref={textInputRef}
      keyboardType="url"
      showSubmitButton={true}
      onSubmit={handleSubmit}
      value={textValue}
      onChangeText={handleChangeText}
      error={error}
      style={[styles.textInput]}
      autoComplete="off"
      autoCapitalize="none"
      textContentType="none"
      autoCorrect={false}
      importantForAutofill="no"
    />
  );
}

export default UrlSubmitForm;
