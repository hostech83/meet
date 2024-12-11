import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
configure({ asyncUtilTimeout: 5000 });

// Here, add portions of the warning messages you want to intentionally prevent from appearing
const MESSAGES_TO_IGNORE = [
  "When testing, code that causes React state updates should be wrapped into act(...):",
  "Error:",
  "The above error occurred",
  "The width(800) and height(800) are both fixed numbers,",
  "YAxis: Support for defaultProps will be removed in the next major release. Please use a custom hook to set default values.",
  "XAxis: Support for defaultProps will be removed in the next major release. Please use a custom hook to set default values.",
];

const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  if (
    /Warning.* Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead/.test(
      args[0]
    )
  ) {
    return;
  }
  const ignoreMessage = MESSAGES_TO_IGNORE.find((message) =>
    args.toString().includes(message)
  );
  if (!ignoreMessage) originalError(...args);
  originalError.call(console, ...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find((message) =>
    args.toString().includes(message)
  );
  if (!ignoreMessage) originalWarn(...args);
};

jest.setTimeout(30000);

const { ResizeObserver } = window;

beforeEach(() => {
  //@ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});
