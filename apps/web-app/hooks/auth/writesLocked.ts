"use client";

import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
} from "react";

const WritesLockedContext = createContext(false);

export function WritesLockedProvider({
  locked,
  children,
}: {
  locked: boolean;
  children?: ReactNode;
}) {
  return createElement(
    WritesLockedContext.Provider,
    { value: locked },
    children
  );
}

export function useWritesLocked(): boolean {
  return useContext(WritesLockedContext);
}
