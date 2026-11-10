import "@testing-library/jest-dom";

jest.mock("@convex-dev/auth/react", () => ({
  useConvexAuth: () => ({ isAuthenticated: false, isLoading: false }),
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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
