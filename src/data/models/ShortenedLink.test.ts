import {
  BaseShortenedLinkSchema,
  ShortenedLinkWireInSchema,
  ShortenedLinkWireOutSchema,
  type BaseShortenedLink,
  type ShortenedLinkWireIn,
  type ShortenedLinkWireOut,
} from './ShortenedLink';

describe('ShortenedLink Models', () => {
  describe('BaseShortenedLinkSchema', () => {
    it('should validate valid base shortened link', () => {
      const validData = {
        originalUrl: 'https://example.com',
      };

      const result = BaseShortenedLinkSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject missing originalUrl', () => {
      const invalidData = {};

      const result = BaseShortenedLinkSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toContain('Required');
    });

    it('should reject non-string originalUrl', () => {
      const invalidData = {
        originalUrl: 123,
      };

      const result = BaseShortenedLinkSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toContain('string');
    });

    it('should accept empty string originalUrl', () => {
      const data = {
        originalUrl: '',
      };

      const result = BaseShortenedLinkSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.originalUrl).toBe('');
    });
  });

  describe('ShortenedLinkWireInSchema', () => {
    it('should validate valid wire-in data', () => {
      const validData = {
        originalUrl: 'https://example.com',
        id: 'abc123',
        shortenedUrl: 'https://short.ly/abc123',
      };

      const result = ShortenedLinkWireInSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject missing id', () => {
      const invalidData = {
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/abc123',
      };

      const result = ShortenedLinkWireInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing shortenedUrl', () => {
      const invalidData = {
        originalUrl: 'https://example.com',
        id: 'abc123',
      };

      const result = ShortenedLinkWireInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-string id', () => {
      const invalidData = {
        originalUrl: 'https://example.com',
        id: 123,
        shortenedUrl: 'https://short.ly/abc123',
      };

      const result = ShortenedLinkWireInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ShortenedLinkWireOutSchema', () => {
    it('should validate valid wire-out data', () => {
      const validData = {
        originalUrl: 'https://example.com',
      };

      const result = ShortenedLinkWireOutSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject missing originalUrl', () => {
      const invalidData = {};

      const result = ShortenedLinkWireOutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-string originalUrl', () => {
      const invalidData = {
        originalUrl: null,
      };

      const result = ShortenedLinkWireOutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Type exports', () => {
    it('should export BaseShortenedLink type', () => {
      const data: BaseShortenedLink = {
        originalUrl: 'https://example.com',
      };
      expect(data.originalUrl).toBe('https://example.com');
    });

    it('should export ShortenedLinkWireIn type', () => {
      const data: ShortenedLinkWireIn = {
        originalUrl: 'https://example.com',
        id: 'abc123',
        shortenedUrl: 'https://short.ly/abc123',
      };
      expect(data.id).toBe('abc123');
      expect(data.shortenedUrl).toBe('https://short.ly/abc123');
    });

    it('should export ShortenedLinkWireOut type', () => {
      const data: ShortenedLinkWireOut = {
        originalUrl: 'https://example.com',
      };
      expect(data.originalUrl).toBe('https://example.com');
    });
  });

  describe('Schema relationships', () => {
    it('ShortenedLinkWireIn should extend BaseShortenedLink', () => {
      const wireInData = {
        originalUrl: 'https://example.com',
        id: 'abc123',
        shortenedUrl: 'https://short.ly/abc123',
      };

      // Should pass both schemas
      expect(BaseShortenedLinkSchema.safeParse(wireInData).success).toBe(true);
      expect(ShortenedLinkWireInSchema.safeParse(wireInData).success).toBe(true);
    });

    it('ShortenedLinkWireOut should extend BaseShortenedLink', () => {
      const wireOutData = {
        originalUrl: 'https://example.com',
      };

      // Should pass both schemas
      expect(BaseShortenedLinkSchema.safeParse(wireOutData).success).toBe(true);
      expect(ShortenedLinkWireOutSchema.safeParse(wireOutData).success).toBe(true);
    });
  });
});
