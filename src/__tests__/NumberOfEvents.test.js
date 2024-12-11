// src/__tests__/NumberOfEvents.test.js

import React from "react";
import {
  render,
  screen,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NumberOfEvents from "../components/NumberOfEvents";
import App from "../App";
import { getEvents } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

import { asyncRender } from "../testUtils";
jest.mock("../api");
const setCurrentNOE = jest.fn();
const setErrorAlert = jest.fn();
jest.mock("../components/CityEventsChart", () => {
  return function DummyCityEventsChart() {
    return <div>CityEventsChart</div>;
  };
});

describe("<NumberOfEvents /> component", () => {
  beforeEach(() => {
    setCurrentNOE.mockClear();
    setErrorAlert.mockClear();
  });
  test("contains an element with the role of the textbox", () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByRole("textbox");
    expect(numberInput).toBeInTheDocument();
  });

  test("renders number input with default value of 32", () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue("32");
  });

  test("updates value when user types a valid number", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15");
    expect(numberInput).toHaveValue("15");
  });

  test("handleClear resets input value to 32", async () => {
    const setCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );

    const numberInput = screen.getByLabelText("Number of Events");
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    // Change the input value
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "10");
    expect(numberInput).toHaveValue("10");
    expect(setCurrentNOE).toHaveBeenCalledWith(10);

    // Reset the input value
    await userEvent.click(resetButton);

    expect(numberInput).toHaveValue("32");
    expect(setCurrentNOE).toHaveBeenCalledWith(32);
  });

  test("handleClear is called when reset icon is clicked", async () => {
    const setCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    await userEvent.click(resetButton);

    expect(setCurrentNOE).toHaveBeenCalledWith(32);
  });

  test("shows error for non-integer input", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "12.5");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Please enter a valid integer for the number of events."
    );
  });

  test("shows error for negative number", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "-5");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Please enter a positive number for the number of events."
    );
  });

  test("shows error for number greater than 250", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "300");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Maximum number of events is 250. Please enter a smaller number."
    );
  });

  test("sets error alert when number of events exceeds 250", async () => {
    const user = userEvent.setup();
    const mockSetErrorAlert = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={jest.fn()}
        setErrorAlert={mockSetErrorAlert}
      />
    );

    const input = screen.getByLabelText("Number of Events");
    await user.clear(input);
    await user.type(input, "251");

    expect(mockSetErrorAlert).toHaveBeenCalledWith(
      "Maximum number of events is 250. Please enter a smaller number."
    );
  });

  test("clears error alert when valid number is entered", async () => {
    const user = userEvent.setup();
    const mockSetErrorAlert = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={jest.fn()}
        setErrorAlert={mockSetErrorAlert}
      />
    );

    const input = screen.getByLabelText("Number of Events");
    await user.clear(input);
    await user.type(input, "251");
    await user.clear(input);
    await user.type(input, "200");

    expect(mockSetErrorAlert).toHaveBeenCalledWith("");
  });

  test("clears error when reset to default", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });
    await userEvent.click(resetButton);
    expect(setCurrentNOE).toHaveBeenCalledWith(32);
    expect(setErrorAlert).toHaveBeenCalledWith("");
  });

  test("displays tooltip with correct text when hovering over reset button", async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents setCurrentNOE={jest.fn()} setErrorAlert={jest.fn()} />
    );

    // Find the reset button
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    // Hover over the reset button
    await user.hover(resetButton);

    // Check if the tooltip is visible with the correct text
    const tooltipText = await screen.findByText("Reset to default value (32)");
    expect(tooltipText).toBeInTheDocument();
    expect(tooltipText).toHaveClass("tooltip-inner");

    // Check if there's a parent element with the 'bordered-tooltip' class
    const borderedTooltip = screen.getByTestId("bordered-tooltip");
    expect(borderedTooltip).toBeInTheDocument();
    expect(
      within(borderedTooltip).getByText("Reset to default value (32)")
    ).toBeInTheDocument();

    // Unhover to hide the tooltip
    await user.unhover(resetButton);

    // Wait for the tooltip to disappear
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Reset to default value (32)")
    );
  });

  test("shows tooltip on mobile devices", () => {
    // Mock window.innerWidth to simulate mobile device
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500, // Mobile width
    });

    // Trigger the useEffect
    window.dispatchEvent(new Event("resize"));

    render(
      <NumberOfEvents setCurrentNOE={jest.fn()} setErrorAlert={jest.fn()} />
    );

    const tooltipTrigger = screen.getByRole("img", {
      name: /reset number of events/i,
    });
    expect(tooltipTrigger).toBeInTheDocument();
  });

  test("does not show tooltip on desktop devices", () => {
    // Mock window.innerWidth to simulate desktop device
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });

    // Trigger the useEffect
    window.dispatchEvent(new Event("resize"));

    render(
      <NumberOfEvents setCurrentNOE={jest.fn()} setErrorAlert={jest.fn()} />
    );

    const tooltipTrigger = screen.getByRole("img", {
      name: /reset number of events/i,
    });
    expect(tooltipTrigger).not.toHaveAttribute("aria-describedby");
  });
});

describe("<NumberOfEvents /> integration", () => {
  test("changes the number of events displayed when NOE input changes", async () => {
    getEvents.mockResolvedValue(mockData);
    await asyncRender(<App />);

    await waitFor(() => {
      const noeInput = screen.getByLabelText("Number of Events");
      expect(noeInput).toBeInTheDocument();
    });

    const noeInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(noeInput);
    await userEvent.type(noeInput, "10");

    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems).toHaveLength(Math.min(10, mockData.length));
    });
  });
});
