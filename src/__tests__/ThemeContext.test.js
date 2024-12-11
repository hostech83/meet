// src/__tests__/ThemeContext.test.js

import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, ThemeContext } from "../contexts/ThemeContext";

const TestComponent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return <div>{isDarkMode ? "Dark Mode" : "Light Mode"}</div>;
};

describe("ThemeContext", () => {
  test("provides default theme (light mode)", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("Light Mode")).toBeInTheDocument();
  });

  test("responds to system color scheme changes", () => {
    const mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQueryList);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("Light Mode")).toBeInTheDocument();

    // Simulate system color scheme change
    act(() => {
      mockMediaQueryList.matches = true;
      mockMediaQueryList.addEventListener.mock.calls[0][1]({ matches: true });
    });

    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  test("cleans up event listener on unmount", () => {
    const mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQueryList);

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    unmount();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
  });
});
