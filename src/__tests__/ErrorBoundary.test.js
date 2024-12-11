// src/__tests__/ErrorBoundary.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "../components/ErrorBoundary";

// Mock console.log to prevent log messages during tests
console.log = jest.fn();

const ThrowError = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("Something went wrong with the charts.")
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("calls console.log with error information", () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.log).toHaveBeenCalledWith(
      "Chart error:",
      expect.any(Error),
      expect.any(Object)
    );

    spy.mockRestore();
  });
});
