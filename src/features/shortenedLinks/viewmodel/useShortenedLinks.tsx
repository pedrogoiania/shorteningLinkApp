import { useCallback } from "react";

function useShortenedLinks() {
  const addShortenedLink = useCallback((link: string) => {
    console.log(link);
  }, []);

  return {
    shortenedLinks: [],
    addShortenedLink,
  };
}

export default useShortenedLinks;
