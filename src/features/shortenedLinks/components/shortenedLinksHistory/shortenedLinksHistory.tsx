import useColors from "@/src/components/colors/useColors";
import Text from "@/src/components/text/text";
import { ShortenedLinkWireIn } from "@/src/data/models/ShortenedLink";
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

type ShortenedLinksHistoryProps = {
  shortenedLinks: ShortenedLinkWireIn[];
};

const buildStyles = (colors?: ReturnType<typeof useColors>) => {
  return StyleSheet.create({
    itemContainer: {
      padding: 16,
    },
    itemSeparator: {
      height: 1,
      backgroundColor: colors?.gray,
    },
  });
};

function RenderItem({ item }: { item: ShortenedLinkWireIn }) {
  const styles = useMemo(() => buildStyles(), []);

  return (
    <View style={styles.itemContainer}>
      <Text size="medium" weight="bold" variant="primary">
        {item.originalUrl}
      </Text>
      <Text size="small" weight="light" variant="secondary">
        {item.shortenedUrl}
      </Text>
    </View>
  );
}

function Separator() {
  const colors = useColors();

  const styles = useMemo(() => buildStyles(colors), [colors]);
  return <View style={styles.itemSeparator} />;
}

function ShortenedLinksHistory({ shortenedLinks }: ShortenedLinksHistoryProps) {
  return (
    <FlatList
      data={shortenedLinks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RenderItem item={item} />}
      ItemSeparatorComponent={Separator}
    />
  );
}

export default ShortenedLinksHistory;
