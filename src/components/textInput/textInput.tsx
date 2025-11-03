import { forwardRef, useCallback, useMemo, useRef } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
} from "react-native";
import useColors from "../colors/useColors";

import { FontAwesome6 } from "@expo/vector-icons";
import Text from "../text/text";

const buildStyles = (colors: ReturnType<typeof useColors>) => {
  return StyleSheet.create({
    container: {
      height: 60,
    },
    inputContainer: {
      flexDirection: "row",
      gap: 10,
      flex: 1,
      maxHeight: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      height: 20,
      marginTop: 4,
      paddingHorizontal: 20,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.gray,
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 20,
      color: colors.black,
      fontSize: 16,
      backgroundColor: colors.gray,
    },
    submitButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.gray,
      width: 60,
      height: 40,
      borderRadius: 20,
    },
  });
};

type TextInputProps = RNTextInputProps & {
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  error?: string;
};

export type TextInputRef = RNTextInput;

const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { showSubmitButton = false, error, ...props },
  ref
) {
  const colors = useColors();
  const styles = useMemo(() => buildStyles(colors), [colors]);

  const textInputStyle = useMemo(() => {
    return StyleSheet.flatten([props.style, styles.input]);
  }, [props.style]);

  const textInputRef = useRef<RNTextInput>(null);

  const handleSubmitButtonPress = useCallback(() => {
    props.onSubmit?.();
  }, [props.onSubmit, ref]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <RNTextInput
          {...props}
          ref={ref ? ref : textInputRef}
          style={textInputStyle}
        />
        {showSubmitButton ? (
          <Pressable
            onPress={handleSubmitButtonPress}
            style={styles.submitButton}
          >
            <FontAwesome6 name="paper-plane" size={24} color={colors.black} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.errorContainer}>
        {error ? (
          <Text size="small" weight="regular" variant="error">
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

export default TextInput;
