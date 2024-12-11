// src/__tests__/EventList.test.js

import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventList from "../components/EventList";
import App from "../App";
import { getEvents } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api");
jest.mock("../components/CityEventsChart", () => {
  return function DummyCityEventsChart() {
    return <div>CityEventsChart</div>;
  };
});

describe("<EventList /> component", () => {
  beforeEach(() => {
    getEvents.mockClear();
  });
  const mockEvents = [
    {
      id: 1,
      summary: "Event 1",
      description: "Description 1",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
    {
      id: 2,
      summary: "Event 2",
      description: "Description 2",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
    {
      id: 3,
      summary: "Event 3",
      description: "Description 3",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
  ];

  test('has an element with "list" role', () => {
    render(<EventList events={mockEvents} />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });

  test("renders correct number of events", () => {
    getEvents.mockResolvedValue(mockEvents);
    render(<EventList events={mockEvents} />);
    const eventElements = screen.getAllByRole("listitem");
    expect(eventElements).toHaveLength(mockEvents.length);
  });

  test("renders all events", () => {
    render(<EventList events={mockEvents} />);
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.summary)).toBeInTheDocument();
    });
  });

  test('collapses all expanded event details when "Collapse All" is clicked', async () => {
    const user = userEvent.setup();
    render(<EventList events={mockEvents} />);

    // Expand all events
    const showDetailsButtons = screen.getAllByText("Show Details");
    for (const button of showDetailsButtons) {
      await user.click(button);
    }

    // Verify all events are expanded
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });

    // Click "Collapse All" button
    const collapseAllButton = screen.getByText("Hide All Event Details");
    await user.click(collapseAllButton);

    // Verify all events are collapsed
    mockEvents.forEach((event) => {
      expect(screen.queryByText(event.description)).not.toBeInTheDocument();
    });
  });
});

describe("<EventList /> integration", () => {
  test("renders a list of 32 events when the app is mounted and rendered", async () => {
    getEvents.mockResolvedValue(mockData);
    render(<App />);
    await waitFor(() => {
      const eventList = screen.getByTestId("eventlist");
      const eventItems = within(eventList).getAllByRole("listitem");
      expect(eventItems).toHaveLength(32);
    });
  });
  test("renders EventSkeleton components while loading", async () => {
    getEvents.mockResolvedValue(mockData);
    render(<App />);

    expect(screen.getAllByTestId("event-skeleton")).toHaveLength(5);

    await waitFor(() => {
      expect(screen.getAllByTestId(/^event-/)).toHaveLength(
        Math.min(32, mockData.length)
      );
    });

    expect(screen.queryAllByTestId("event-skeleton")).toHaveLength(0);
  });
});
