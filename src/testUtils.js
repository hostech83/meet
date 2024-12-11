// src/testUtils.js
import { act, render } from "@testing-library/react";

export const asyncRender = async (component) => {
  let result;
  await act(async () => {
    result = render(component);
  });

  // Wait for any suspended resources to load
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  return result;
};
