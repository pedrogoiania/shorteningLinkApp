import { z } from "zod";

// Base model with originalUrl as required property
export const BaseShortenedLinkSchema = z.object({
  originalUrl: z.string(),
});

export type BaseShortenedLink = z.infer<typeof BaseShortenedLinkSchema>;

// WireIn model - for incoming data (API responses)
export const ShortenedLinkWireInSchema = BaseShortenedLinkSchema.extend({
  id: z.string(),
  shortenedUrl: z.string(),
});

export type ShortenedLinkWireIn = z.infer<typeof ShortenedLinkWireInSchema>;

// WireOut model - for outgoing data (API requests)
export const ShortenedLinkWireOutSchema = BaseShortenedLinkSchema.extend({
  originalUrl: z.string(), // explicitly required as per user request
});

export type ShortenedLinkWireOut = z.infer<typeof ShortenedLinkWireOutSchema>;

// Keep the original ShortenedLink type for backward compatibility if needed
export type ShortenedLink = ShortenedLinkWireIn;
