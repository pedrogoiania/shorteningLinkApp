import { z } from "zod";

export const ShortenedLinkSchema = z.object({
  id: z.string(),
  originalUrl: z.string(),
  shortenedUrl: z.string(),
});

export type ShortenedLink = z.infer<typeof ShortenedLinkSchema>;
