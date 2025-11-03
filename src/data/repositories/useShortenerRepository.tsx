import {
    ShortenedLinkWireIn,
    ShortenedLinkWireOut,
} from "@/src/data/models/ShortenedLink";
import useShortenerService from "@/src/data/services/useShortenerService";
import useShortenedLinksStore from "@/src/store/shortenedLinksStore/shortenedLinksStore";
import { useCallback } from "react";

function useShortenerRepository(shortenerService = useShortenerService()) {
  const { shortenedLinks, addShortenedLink } = useShortenedLinksStore();

  const shortenUrl = useCallback(
    async (
      shortenedLinkWireOut: ShortenedLinkWireOut
    ): Promise<ShortenedLinkWireIn> => {
      try {
        const shortenedLinkWireIn = await shortenerService.shortenUrl(
          shortenedLinkWireOut
        );
        addShortenedLink(shortenedLinkWireIn);
        return shortenedLinkWireIn;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [shortenerService, addShortenedLink]
  );

  const getShortenedLink = useCallback(
    async (id: ShortenedLinkWireIn["id"]): Promise<ShortenedLinkWireIn> => {
      // Check store first
      const cachedLink = shortenedLinks.find((link) => link.id === id);
      if (cachedLink) {
        return cachedLink;
      }

      try {
        // If not in store, make network request
        const shortenedLinkWireIn = await shortenerService.getShortenedLink(id);
        return shortenedLinkWireIn;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [shortenerService, shortenedLinks, addShortenedLink]
  );

  return {
    shortenUrl,
    getShortenedLink,
    shortenedLinks,
  };
}

export default useShortenerRepository;
