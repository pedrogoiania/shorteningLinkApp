import { useMemo } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import useColors from "../colors/useColors";
import sizes from "../sizes/sizes";

const buildStyles = (colors: ReturnType<typeof useColors>) => {
  return StyleSheet.create({
    // Sizes
    small: {
      fontSize: sizes.fontSizes.small,
    },
    medium: {
      fontSize: sizes.fontSizes.medium,
    },
    large: {
      fontSize: sizes.fontSizes.large,
    },

    // Weights
    bold: {
      fontWeight: "bold",
    },
    regular: {
      fontWeight: "regular",
    },
    light: {
      fontWeight: "light",
    },

    // Variants
    primary: {
      color: colors.text,
    },
    secondary: {
      color: colors.gray,
    },
    error: {
      color: colors.error,
    },
  });
};

type TextProps = RNTextProps & {
  variant?: "primary" | "secondary" | "error";
  size?: "small" | "medium" | "large";
  weight?: keyof typeof sizes.fontWeights;
};

function Text({ children, ...props }: TextProps) {
  const colors = useColors();

  const styles = useMemo(() => {
    return buildStyles(colors);
  }, [colors]);

  const textStyle = useMemo(() => {
    return [
      styles[props.size || "medium"],
      styles[props.weight || "regular"],
      styles[props.variant || "primary"],
      props.style,
    ];
  }, [props.style]);

  return (
    <RNText {...props} style={textStyle}>
      {children}
    </RNText>
  );
}

export default Text;
