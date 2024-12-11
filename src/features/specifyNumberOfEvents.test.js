// src/features/specifyNumberOfEvents.test.js

import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { getEvents } from "../api";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
  setCurrentNOE: jest.fn(),
}));

const feature = loadFeature("./src/features/specifyNumberOfEvents.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });

  test("When user hasn't specified a number, 32 events are shown by default", ({
    given,
    when,
    then,
  }) => {
    let eventListItems;
    given("the user hasn't specified a number of events to display", () => {
      render(<App />);
    });

    when("the user loads the event list", async () => {
      await waitFor(() => {
        const eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
      });
    });

    then("32 events should be displayed", () => {
      expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
    });
  });

  test("User can change the number of events displayed", ({
    given,
    when,
    then,
    and,
  }) => {
    let eventList;
    let eventListItems;
    let numberInput;
    given("the user is viewing the event list", async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
      });
    });

    when(
      "the user specifies a different number of events to display",
      async () => {
        numberInput = screen.getByLabelText("Number of Events");

        await userEvent.clear(numberInput);
        await userEvent.type(numberInput, "15");
      }
    );

    then("the specified number of events should be shown", async () => {
      await waitFor(() => {
        const updatedEventListItems =
          within(eventList).getAllByRole("listitem");
        expect(updatedEventListItems).toHaveLength(
          Math.min(15, mockData.length)
        );
      });
    });

    and("the event list should update accordingly", async () => {
      // Verify that the input value has been updated
      expect(numberInput).toHaveValue("15");

      // Verify that the events displayed are the first 15 (or fewer) from the mock data
      await waitFor(() => {
        const updatedEventListItems =
          within(eventList).getAllByRole("listitem");

        updatedEventListItems.forEach((item, index) => {
          expect(
            within(item).getByText(mockData[index].summary)
          ).toBeInTheDocument();
        });
      });
    });
  });

  test("User requests more events than available", ({
    given,
    when,
    then,
    and,
  }) => {
    let eventList;
    let eventListItems;
    let numberInput;
    given("there are 77 total events", async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(32);
      });
    });

    when(`user types "100" in the "Number of Events" textbox`, async () => {
      numberInput = screen.getByLabelText("Number of Events");

      await userEvent.clear(numberInput);
      await userEvent.type(numberInput, "100");
    });

    then("the app should display all 15 available events", async () => {
      await waitFor(() => {
        const updatedEventListItems =
          within(eventList).getAllByRole("listitem");
        expect(updatedEventListItems).toHaveLength(77);
      });
    });
  });

  test("User changes number of events while filtered", ({
    given,
    and,
    when,
    then,
  }) => {
    let eventList;
    let eventListItems;
    let numberInput;
    let cityTextBox;
    let suggestionList;
    let suggestionItems;
    given(`the user has filtered events for "Berlin"`, async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
      });
      cityTextBox = screen.getByRole("textbox", { name: /city search/i });
      await userEvent.click(cityTextBox);
      await userEvent.type(cityTextBox, "Berlin");
      suggestionList = await screen.findByTestId("suggestions-list");
      suggestionItems = within(suggestionList).getAllByRole("listitem");
      await userEvent.click(suggestionItems[0]);
    });

    and("there are 21 events in Berlin", async () => {
      await waitFor(() => {
        const filteredEventListItems =
          within(eventList).getAllByRole("listitem");
        expect(filteredEventListItems).toHaveLength(21);
      });
    });

    when(`the user changes the "Number of Events" to 5`, async () => {
      numberInput = screen.getByLabelText("Number of Events");
      await userEvent.clear(numberInput);
      await userEvent.type(numberInput, "5");
      expect(numberInput).toHaveValue("5");
    });

    then("the app should display only 5 events from Berlin", async () => {
      await waitFor(() => {
        const updatedfilteredEventListItems =
          within(eventList).getAllByRole("listitem");
        expect(updatedfilteredEventListItems).toHaveLength(5);
        updatedfilteredEventListItems.forEach((event) => {
          expect(
            within(event).getByText(/Berlin, Germany/i)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
