import "@testing-library/jest-dom";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: () => "blob:http://localhost/preview",
});

Object.defineProperty(URL, "revokeObjectURL", {
  writable: true,
  value: () => undefined,
});
