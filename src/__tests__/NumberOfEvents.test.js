/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
// src/__tests__/NumberOfEvents.test.js
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents /> component", () => {
  test("renders an input element with a role of textbox", () => {
    const { container } = render(
      <NumberOfEvents onChange={jest.fn()} setError={jest.fn()} />
    );
    const inputElement = container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
  });

  test("has a default value of 32", () => {
    const { getByTestId } = render(
      <NumberOfEvents onChange={jest.fn()} setError={jest.fn()} />
    );
    const inputElement = getByTestId("event-count-input");
    expect(inputElement.value).toBe("32");
  });

  test("updates the value when user types in it", async () => {
    const { getByTestId } = render(
      <NumberOfEvents onChange={jest.fn()} setError={jest.fn()} />
    );
    // const user = userEvent.setup();
    const inputElement = getByTestId("event-count-input");

    await userEvent.type(inputElement, "{backspace}{backspace}10");
    expect(inputElement.value).toBe("10");
  });

  test("calls onChange prop with correct value when input changes", async () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <NumberOfEvents onChange={handleChange} setError={jest.fn()} />
    );
    // const user = userEvent.setup();
    const inputElement = getByTestId("event-count-input");

    await userEvent.type(inputElement, "{backspace}{backspace}20");
    expect(handleChange).toHaveBeenCalledWith(20);
  });
});
