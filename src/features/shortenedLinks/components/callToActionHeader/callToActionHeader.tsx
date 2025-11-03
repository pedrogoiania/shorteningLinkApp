import useColors from "@/src/components/colors/useColors";
import sizes from "@/src/components/sizes/sizes";
import Text from "@/src/components/text/text";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const buildStyles = (colors: ReturnType<typeof useColors>) => {
  return StyleSheet.create({
    container: {
      marginVertical: sizes.marginSizes.medium,
      gap: sizes.gapSizes.small,
    },
  });
};

function CallToActionHeader() {
  const colors = useColors();

  const styles = useMemo(() => buildStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text size="medium" weight="bold" variant="primary">
        Enter a link to shorten it
      </Text>
      <Text size="small" weight="regular" variant="secondary">
        You can shorten up to 1000 links per day
      </Text>
    </View>
  );
}

export default CallToActionHeader;
