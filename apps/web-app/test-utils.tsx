import { MantineProvider } from "@mantine/core";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import React from "react";

import { mantineTheme } from "@/theme/mantine-theme";

export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return rtlRender(ui, {
    ...options,
    wrapper: ({ children }) => (
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    ),
  });
}
