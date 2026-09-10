import { MantineProvider } from "@mantine/core";
import {
  render as rtlRender,
  type RenderOptions,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { mantineTheme } from "@/theme/mantine-theme";

export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return rtlRender(ui, {
    ...options,
    wrapper: ({ children }) => (
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    ),
  });
}

export function setupUser() {
  return userEvent.setup({ delay: null });
}

export async function fillField(
  user: ReturnType<typeof setupUser>,
  element: HTMLElement,
  value: string
): Promise<void> {
  await user.click(element);
  await user.clear(element);
  await user.paste(value);
}
