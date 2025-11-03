import { api } from "@/src/core/network/shortenerServer/shortenerServer";
import { useCallback } from "react";
import {
    ShortenedLinkWireIn,
    ShortenedLinkWireOut,
} from "../models/ShortenedLink";

const shortenerPaths = {
  alias: "/alias",
};

function useShortenerService() {
  const shortenUrl = useCallback(
    async (
      shortenedLinkWireOut: ShortenedLinkWireOut
    ): Promise<ShortenedLinkWireIn> => {
      try {
        const response = await api.post(shortenerPaths.alias, {
          url: shortenedLinkWireOut.originalUrl,
        });

        const shortenedLinkWireIn = {
          id: response.data.alias,
          originalUrl: response.data._links.self,
          shortenedUrl: response.data._link.short,
        };

        return shortenedLinkWireIn;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    []
  );

  const getShortenedLink = useCallback(
    async (id: string): Promise<ShortenedLinkWireIn> => {
      try {
        const response = await api.get(`${shortenerPaths.alias}/${id}`);

        const shortenedLinkWireIn = {
          id: response.data.alias,
          originalUrl: response.data._links.self,
          shortenedUrl: response.data._link.short,
        };
        
        return shortenedLinkWireIn;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    []
  );

  return {
    shortenUrl,
    getShortenedLink,
  };
}

export default useShortenerService;
