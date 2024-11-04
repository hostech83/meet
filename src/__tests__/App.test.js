/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable no-undef */
/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
// src/__tests__/App.test.js

import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api";
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

  describe("<App /> integration", () => {
    test("renders a list of events matching the city selected by the user", async () => {
      //const user = userEvent.setup();
      window.location.href = "http://localhost";
      const AppComponent = render(<App />);
      const AppDOM = AppComponent.container.firstChild;

      const CitySearchDOM = AppDOM.querySelector("#city-search");
      const CitySearchInput = within(CitySearchDOM).queryByRole("textbox");

      await userEvent.type(CitySearchInput, "Berlin");
      // berlinSuggestionItem is undefined because the CitySearchDOM is not getting the locations during the testing
      // but it works fine when running the application
      // the strange part is when running the application, the app component is rendered 3 times
      // but in the testing it only renders 2 times
      // in the app (in the browser), the third time is when the data is pass down to the component
      const berlinSuggestionItem =
        within(CitySearchDOM).queryByText("Berlin, Germany");

      console.log(berlinSuggestionItem);
      console.log(AppComponent.debug(CitySearchDOM));
      await userEvent.click(berlinSuggestionItem);

      const EventListDOM = AppDOM.querySelector("#event-list");
      const allRenderedEventItems =
        within(EventListDOM).queryAllByRole("listitem");

      const allEvents = await getEvents();
      const berlinEvents = allEvents.filter(
        (event) => event.location === "Berlin, Germany"
      );
      expect(allRenderedEventItems.length).toBe(berlinEvents.length);

      allRenderedEventItems.forEach((event) => {
        expect(event.textContent).toContain("Berlin, Germany");
      });
    });
  });
});
