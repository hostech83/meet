// src/components/filterEventsByCity.test.js

import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { getEvents } from "../api";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

const feature = loadFeature("./src/features/filterEventsByCity.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });
  test("When user hasn’t searched for a city, show upcoming events from all cities.", ({
    given,
    when,
    then,
  }) => {
    given("user hasn’t searched for any city", () => {
      // No action needed here, this is the initial state
    });

    when("the user opens the app", () => {
      render(<App />);
    });

    then("the user should see the list of all upcoming events", async () => {
      await waitFor(() => {
        const eventList = screen.getByTestId("eventlist");
        const eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
      });
    });
  });

  test("User should see a list of suggestions when they search for a city.", ({
    given,
    when,
    then,
  }) => {
    given("the main page is open", () => {
      render(<App />);
    });

    when("user starts typing in the city textbox", async () => {
      const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
      await userEvent.click(cityTextBox);
      await userEvent.type(cityTextBox, "Berlin");
    });

    then(
      "the user should recieve a list of cities (suggestions) that match what they’ve typed",
      async () => {
        const suggestionList = screen.getByTestId("suggestions-list");
        const suggestionItems = within(suggestionList).getAllByRole("listitem");
        expect(suggestionItems).toHaveLength(2);
      }
    );
  });

  test("User can select a city from the suggested list.", ({
    given,
    and,
    when,
    then,
  }) => {
    let cityTextBox;
    given("user was typing “Berlin” in the city textbox", async () => {
      render(<App />);
      cityTextBox = screen.getByRole("textbox", { name: /city search/i });
      await userEvent.click(cityTextBox);
      await userEvent.type(cityTextBox, "Berlin");
    });

    let suggestionList;
    let suggestionItems;
    and("the list of suggested cities is showing", async () => {
      suggestionList = await screen.findByTestId("suggestions-list");
      suggestionItems = within(suggestionList).getAllByRole("listitem");
      expect(suggestionItems).toHaveLength(2);
    });

    when(
      "the user selects a city (e.g., “Berlin, Germany”) from the list",
      async () => {
        await userEvent.click(suggestionItems[0]);
      }
    );

    then(
      "their city should be changed to that city (i.e., “Berlin, Germany”)",
      async () => {
        await expect(cityTextBox.value).toBe("Berlin, Germany");
      }
    );

    and(
      "the user should receive a list of upcoming events in that city",
      async () => {
        await waitFor(() => {
          const eventList = screen.getByTestId("eventlist");
          const allRenderedEventItems =
            within(eventList).getAllByRole("listitem");
          const berlinEvents = mockData.filter(
            (event) => event.location === cityTextBox.value
          );
          expect(allRenderedEventItems).toHaveLength(berlinEvents.length);
        });
      }
    );
  });
});
