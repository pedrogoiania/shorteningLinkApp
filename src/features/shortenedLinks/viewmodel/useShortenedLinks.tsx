import { ShortenedLinkWireOut } from "@/src/data/models/ShortenedLink";
import useShortenerRepository from "@/src/data/repositories/useShortenerRepository";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

function useShortenedLinks() {
  const [linkTyped, setLinkTyped] = useState<
    ShortenedLinkWireOut["originalUrl"] | ""
  >("");

  const [tempLinkTyped, setTempLinkTyped] = useState<
    ShortenedLinkWireOut["originalUrl"] | ""
  >("");

  const [shortenUrlLoading, setShortenUrlLoading] = useState(false);

  const { shortenUrl, shortenedLinks } = useShortenerRepository();

  const addShortenedLink = useCallback(
    async (url: ShortenedLinkWireOut["originalUrl"]) => {
      setLinkTyped("");
      setTempLinkTyped(url);
      setShortenUrlLoading(true);
      try {
        await shortenUrl({ originalUrl: url });
        setTempLinkTyped("");
      } catch (error) {
        setLinkTyped(url);
        Alert.alert(
          "Failed to add shortened link",
          error instanceof Error ? error.message : "Unknown error"
        );
      } finally {
        setShortenUrlLoading(false);
      }
    },
    [shortenUrl]
  );

  return {
    shortenedLinks: shortenedLinks.reverse(),
    addShortenedLink,
    shortenUrlLoading,
    linkTyped,
    setLinkTyped,
  };
}

export default useShortenedLinks;
