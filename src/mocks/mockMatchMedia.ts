export function mockMatchMedia(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).matchMedia
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })
}
