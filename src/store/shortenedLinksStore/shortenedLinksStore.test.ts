import useShortenedLinksStore from './shortenedLinksStore';

describe('useShortenedLinksStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useShortenedLinksStore.setState({ shortenedLinks: [] });
  });

  describe('initial state', () => {
    it('should initialize with empty shortenedLinks array', () => {
      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toEqual([]);
    });
  });

  describe('addShortenedLink', () => {
    it('should add a shortened link to the store', () => {
      const mockLink = {
        id: 'test123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/test123',
      };

      useShortenedLinksStore.getState().addShortenedLink(mockLink);

      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toEqual([mockLink]);
    });

    it('should add multiple shortened links to the store', () => {
      const mockLink1 = {
        id: 'test123',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/test123',
      };

      const mockLink2 = {
        id: 'test456',
        originalUrl: 'https://test.com',
        shortenedUrl: 'https://short.ly/test456',
      };

      const { addShortenedLink } = useShortenedLinksStore.getState();

      addShortenedLink(mockLink1);
      addShortenedLink(mockLink2);

      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toEqual([mockLink1, mockLink2]);
    });

    it('should preserve existing links when adding new ones', () => {
      const existingLink = {
        id: 'existing',
        originalUrl: 'https://existing.com',
        shortenedUrl: 'https://short.ly/existing',
      };

      const newLink = {
        id: 'new',
        originalUrl: 'https://new.com',
        shortenedUrl: 'https://short.ly/new',
      };

      // Set initial state with existing link
      useShortenedLinksStore.setState({ shortenedLinks: [existingLink] });

      useShortenedLinksStore.getState().addShortenedLink(newLink);

      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toEqual([existingLink, newLink]);
    });

    it('should handle adding links with different data structures', () => {
      const link1 = {
        id: '1',
        originalUrl: 'https://example.com',
        shortenedUrl: 'https://short.ly/1',
      };

      const link2 = {
        id: '2',
        originalUrl: 'https://test.com',
        shortenedUrl: 'https://short.ly/2',
      };

      const { addShortenedLink } = useShortenedLinksStore.getState();

      addShortenedLink(link1);
      addShortenedLink(link2);

      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toHaveLength(2);
      expect(shortenedLinks[0]).toEqual(link1);
      expect(shortenedLinks[1]).toEqual(link2);
    });
  });

  describe('store state management', () => {
    it('should allow direct state manipulation', () => {
      const testLinks = [
        {
          id: 'direct1',
          originalUrl: 'https://direct.com',
          shortenedUrl: 'https://short.ly/direct1',
        },
      ];

      useShortenedLinksStore.setState({ shortenedLinks: testLinks });

      const { shortenedLinks } = useShortenedLinksStore.getState();
      expect(shortenedLinks).toEqual(testLinks);
    });

    it('should maintain immutability when adding links', () => {
      const initialLinks = [
        {
          id: 'initial',
          originalUrl: 'https://initial.com',
          shortenedUrl: 'https://short.ly/initial',
        },
      ];

      useShortenedLinksStore.setState({ shortenedLinks: initialLinks });

      const stateBefore = useShortenedLinksStore.getState();
      const linksBefore = stateBefore.shortenedLinks;

      const newLink = {
        id: 'new',
        originalUrl: 'https://new.com',
        shortenedUrl: 'https://short.ly/new',
      };

      useShortenedLinksStore.getState().addShortenedLink(newLink);

      const stateAfter = useShortenedLinksStore.getState();
      const linksAfter = stateAfter.shortenedLinks;

      // The original array should not be the same reference
      expect(linksBefore).not.toBe(linksAfter);
      // But should contain the original elements plus the new one
      expect(linksAfter).toEqual([...initialLinks, newLink]);
    });
  });

  describe('store subscription', () => {
    it('should allow subscribing to state changes', () => {
      const mockSubscriber = jest.fn();

      const unsubscribe = useShortenedLinksStore.subscribe(mockSubscriber);

      const newLink = {
        id: 'subscribed',
        originalUrl: 'https://subscribed.com',
        shortenedUrl: 'https://short.ly/subscribed',
      };

      useShortenedLinksStore.getState().addShortenedLink(newLink);

      expect(mockSubscriber).toHaveBeenCalled();

      unsubscribe();
    });

    it('should stop calling subscriber after unsubscribe', () => {
      const mockSubscriber = jest.fn();

      const unsubscribe = useShortenedLinksStore.subscribe(mockSubscriber);

      const newLink = {
        id: 'after-unsubscribe',
        originalUrl: 'https://after-unsubscribe.com',
        shortenedUrl: 'https://short.ly/after-unsubscribe',
      };

      unsubscribe();

      useShortenedLinksStore.getState().addShortenedLink(newLink);

      expect(mockSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('store structure', () => {
    it('should return an object with shortenedLinks and addShortenedLink', () => {
      const state = useShortenedLinksStore.getState();

      expect(state).toHaveProperty('shortenedLinks');
      expect(state).toHaveProperty('addShortenedLink');
      expect(typeof state.addShortenedLink).toBe('function');
      expect(Array.isArray(state.shortenedLinks)).toBe(true);
    });
  });
});
