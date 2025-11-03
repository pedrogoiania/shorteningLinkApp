import { create } from "zustand";

type ShortenedLinksState = {
  shortenedLinks: string[];
  addShortenedLink: (link: string) => void;
};

const useShortenedLinksStore = create<ShortenedLinksState>((set) => ({
  shortenedLinks: [],
  addShortenedLink: (link: string) =>
    set((state) => ({ shortenedLinks: [...state.shortenedLinks, link] })),
}));

export default useShortenedLinksStore;
