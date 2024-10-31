/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
// src/__tests__/App.test.js

import { render } from "@testing-library/react";
import App from "../App";

describe("<App /> component", () => {
  let AppDOM;
  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test("renders list of events", () => {
    expect(AppDOM.querySelector("#event-list")).toBeInTheDocument();
  });

  test("render CitySearch", () => {
    expect(AppDOM.querySelector("#city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents component", () => {
    expect(AppDOM.querySelector("#number-of-events")).toBeInTheDocument();
  });
});
