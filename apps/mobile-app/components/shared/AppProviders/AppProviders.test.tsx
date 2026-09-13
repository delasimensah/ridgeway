import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import AppProviders from "./AppProviders";

jest.mock("@convex-dev/auth/react", () => ({
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/hooks", () => ({
  FieldSessionProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock("@/utils", () => ({
  createConvexClient: () => ({}),
}));

describe("AppProviders", () => {
  it("renders children", () => {
    const { getByText } = render(
      <AppProviders>
        <Text>Ready</Text>
      </AppProviders>
    );
    expect(getByText("Ready")).toBeTruthy();
  });
});
