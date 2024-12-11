// src/components/showedHideAnEventsDetails.test.js

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

const feature = loadFeature("./src/features/showHideAnEventsDetails.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });
  test("An event element is collapsed by default", ({ given, then }) => {
    let eventListItems;
    given("the user is viewing the list of events", async () => {
      render(<App />);

      await waitFor(() => {
        const eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
      });
    });

    then("all event elements should be in a collapsed state", async () => {
      eventListItems.forEach((event) => {
        expect(event).not.toHaveTextContent(event.description);
      });
    });
  });

  test("User can expand an event to see details", ({
    given,
    when,
    then,
    and,
  }) => {
    let eventList;
    given("the user is viewing the list of events", async () => {
      render(<App />);
      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        const eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
      });
    });

    let firstEvent;
    when("the user clicks on a collapsed event element", async () => {
      firstEvent = within(eventList).getAllByRole("listitem")[0];
      const showDetailsButton = within(firstEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton);
    });

    then("the event element should expand", () => {
      const firstEvent = within(eventList).getAllByRole("listitem")[0];
      expect(within(firstEvent).getByText(/hide details/i)).toBeInTheDocument();
    });

    and("the event details should be visible", () => {
      const firstEvent = within(eventList).getAllByRole("listitem")[0];
      expect(
        within(firstEvent).getByText(/about the event/i)
      ).toBeInTheDocument();
    });
  });

  test("User can collapse an event to hide details", ({
    given,
    when,
    then,
    and,
  }) => {
    let eventList;
    let firstEvent;
    given("the user is viewing an expanded event element", async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        const eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
        firstEvent = within(eventList).getAllByRole("listitem")[0];
      });

      const showDetailsButton = within(firstEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton);
      expect(within(firstEvent).getByText(/hide details/i)).toBeInTheDocument();
    });

    when("the user clicks on the expanded event element", async () => {
      const showDetailsButton = within(firstEvent).getByText(/hide details/i);
      await userEvent.click(showDetailsButton);
    });

    then("the event element should collapse", () => {
      expect(within(firstEvent).getByText(/show details/i)).toBeInTheDocument();
    });

    and("the event details should be hidden", () => {
      expect(
        within(firstEvent).queryByText(/about the event/i)
      ).not.toBeInTheDocument();
    });
  });

  test("User expands multiple event details", ({ given, when, then }) => {
    let eventList;
    let firstEvent;
    let secondEvent;
    given("the user is viewing the event list", async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        const eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
        firstEvent = within(eventList).getAllByRole("listitem")[0];
        secondEvent = within(eventList).getAllByRole("listitem")[1];
      });
    });

    when("the user clicks to show details for multiple events", async () => {
      const showDetailsButton1 = within(firstEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton1);

      const showDetailsButton2 = within(secondEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton2);
    });

    then(
      "the app should display expanded details for all selected events simultaneously",
      () => {
        expect(
          within(firstEvent).getByText(/hide details/i)
        ).toBeInTheDocument();
        expect(
          within(secondEvent).getByText(/hide details/i)
        ).toBeInTheDocument();
      }
    );
  });

  test("User collapses all expanded event details", ({ given, when, then }) => {
    let eventList;
    let eventListItems;
    let firstEvent;
    let secondEvent;
    given("multiple events have their details expanded", async () => {
      render(<App />);

      await waitFor(() => {
        eventList = screen.getByTestId("eventlist");
        eventListItems = within(eventList).getAllByRole("listitem");
        expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
        firstEvent = within(eventList).getAllByRole("listitem")[0];
        secondEvent = within(eventList).getAllByRole("listitem")[1];
      });
      const showDetailsButton1 = within(firstEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton1);

      const showDetailsButton2 = within(secondEvent).getByText(/show details/i);
      await userEvent.click(showDetailsButton2);
      expect(within(firstEvent).getByText(/hide details/i)).toBeInTheDocument();
      expect(
        within(secondEvent).getByText(/hide details/i)
      ).toBeInTheDocument();
    });

    when(`the user clicks a "Collapse All" button`, async () => {
      const collapseAllButton = screen.getByText("Hide All Event Details");
      await userEvent.click(collapseAllButton);
    });

    then("the app should hide the details for all events", async () => {
      eventListItems.forEach((event) => {
        expect(within(event).getByText(/show details/i)).toBeInTheDocument();
        expect(
          within(event).queryByText(/hide details/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
