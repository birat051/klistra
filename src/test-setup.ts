import '@testing-library/jest-dom/vitest'

/* Framer Motion `whileInView` registers an IntersectionObserver; jsdom does not provide it. */
globalThis.IntersectionObserver = class IntersectionObserverMock {
  private readonly cb: IntersectionObserverCallback

  constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    void options
    this.cb = cb
  }
  disconnect(): void {}
  observe(element: Element): void {
    this.cb(
      [
        {
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          rootBounds: null,
          target: element,
          time: Date.now(),
        },
      ],
      this,
    )
  }
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  readonly root: Element | Document | null = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
} as unknown as typeof IntersectionObserver
