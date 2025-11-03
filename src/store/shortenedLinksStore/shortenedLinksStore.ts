import { ShortenedLinkWireIn } from "@/src/data/models/ShortenedLink";
import { create } from "zustand";

type ShortenedLinksState = {
  shortenedLinks: ShortenedLinkWireIn[];
  addShortenedLink: (link: ShortenedLinkWireIn) => void;
};

const useShortenedLinksStore = create<ShortenedLinksState>((set) => ({
  shortenedLinks: [],
  addShortenedLink: (link: ShortenedLinkWireIn) =>
    set((state) => ({ shortenedLinks: [...state.shortenedLinks, link] })),
}));

export default useShortenedLinksStore;
