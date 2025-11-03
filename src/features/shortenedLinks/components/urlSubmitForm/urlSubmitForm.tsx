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
};

function UrlSubmitForm() {
  const styles = useMemo(() => buildStyles(), []);

  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState("");

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
    handleClearErrorMessage();

    if (!textValue.length) {
      return handleErrorMessage("Please enter a URL");
    }

    if (!isValidUrl(textValue)) {
      return handleErrorMessage("Please enter a valid URL");
    }

    textInputRef.current?.blur();

    setTextValue("");
  }, [textValue]);

  const handleErrorMessage = useCallback(
    (message: string) => {
      setError(message);

      intervalErrorMessage = setInterval(() => {
        handleClearErrorMessage();
      }, 10000);
    },
    [error]
  );

  const handleChangeText = useCallback((text: string) => {
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
      ref={textInputRef}
      keyboardType="url"
      showSubmitButton={true}
      onSubmit={handleSubmit}
      value={textValue}
      onChangeText={handleChangeText}
      error={error}
      style={[styles.textInput]}
    />
  );
}

export default UrlSubmitForm;
