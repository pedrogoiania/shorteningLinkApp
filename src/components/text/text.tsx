import { useMemo } from "react";
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleSheet,
} from "react-native";
import useColors from "../colors/useColors";

const buildStyles = (colors: ReturnType<typeof useColors>) => {
  return StyleSheet.create({
    small: {
      fontSize: 12,
    },
    medium: {
      fontSize: 16,
    },
    large: {
      fontSize: 20,
    },
    bold: {
      fontWeight: "bold",
    },
    regular: {
      fontWeight: "regular",
    },
    light: {
      fontWeight: "light",
    },
    primary: {
      color: colors.text,
    },
    secondary: {
      color: colors.text,
    },
  });
};

type TextProps = RNTextProps & {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  weight?: "light" | "regular" | "bold";
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
