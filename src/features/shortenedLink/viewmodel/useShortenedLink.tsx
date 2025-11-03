import { ShortenedLinkWireIn } from "@/src/data/models/ShortenedLink";
import useShortenerRepository from "@/src/data/repositories/useShortenerRepository";
import { useCallback } from "react";
import { Alert } from "react-native";

function useShortenedLink() {
  const { getShortenedLink } = useShortenerRepository();

  const getShortenedLinkData = useCallback(
    async (
      id: ShortenedLinkWireIn["id"]
    ): Promise<ShortenedLinkWireIn | null> => {
      try {
        return await getShortenedLink(id);
      } catch (error) {
        Alert.alert(
          "Failed to get shortened link data",
          error instanceof Error ? error.message : "Unknown error"
        );
        return null;
      }
    },
    [getShortenedLink]
  );

  return { getShortenedLinkData };
}

export default useShortenedLink;
