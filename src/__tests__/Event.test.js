// src/__tests__/Event.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Event from "../components/Event";

describe("<Event /> component", () => {
  const mockEvent = {
    id: 1,
    summary: "Test Event",
    description: "This is a test event description",
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
  };

  test("renders event element with title and details collapsed by default", () => {
    render(<Event event={mockEvent} />);
    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();
    expect(screen.queryByText(mockEvent.description)).not.toBeInTheDocument();
  });

  test("renders event location", () => {
    render(<Event event={mockEvent} />);
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
  });

  test('shows "Show Details" button when event is collapsed', () => {
    render(<Event event={mockEvent} />);
    expect(screen.getByText("Show Details")).toBeInTheDocument();
    expect(screen.queryByText("Hide Details")).not.toBeInTheDocument();
  });

  test("expands event element when show details button is clicked", () => {
    render(<Event event={mockEvent} />);
    const showDetailsButton = screen.getByText("Show Details");

    fireEvent.click(showDetailsButton);

    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
  });

  test("renders event details when event is expanded", () => {
    render(<Event event={mockEvent} />);
    const showDetailsButton = screen.getByText("Show Details");

    fireEvent.click(showDetailsButton);

    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "See details on Google Calendar" })
    ).toHaveAttribute("href", mockEvent.htmlLink);
    expect(screen.getByText(mockEvent.organizer.email)).toBeInTheDocument();
  });

  test('shows "Hide Details" button when event is expanded', () => {
    render(<Event event={mockEvent} />);
    const showDetailsButton = screen.getByText("Show Details");

    fireEvent.click(showDetailsButton);

    expect(screen.getByText("Hide Details")).toBeInTheDocument();
    expect(screen.queryByText("Show Details")).not.toBeInTheDocument();
  });

  test("collapses expanded event element when hide details button is clicked", () => {
    render(<Event event={mockEvent} />);
    const showDetailsButton = screen.getByText("Show Details");

    fireEvent.click(showDetailsButton);
    const hideDetailsButton = screen.getByText("Hide Details");
    fireEvent.click(hideDetailsButton);

    expect(screen.queryByText(mockEvent.description)).not.toBeInTheDocument();
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });

  test("toggles event details and button text when clicked multiple times", () => {
    render(<Event event={mockEvent} />);
    const toggleButton = screen.getByText("Show Details");

    // First click: expand
    fireEvent.click(toggleButton);
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();

    // Second click: collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByText(mockEvent.description)).not.toBeInTheDocument();
    expect(screen.getByText("Show Details")).toBeInTheDocument();

    // Third click: expand again
    fireEvent.click(toggleButton);
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
  });
});
describe("Multiple events interaction", () => {
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

  test("expands multiple event details independently", () => {
    render(
      <>
        <Event event={mockEvents[0]} />
        <Event event={mockEvents[1]} />
      </>
    );

    const showDetailsButtons = screen.getAllByText("Show Details");

    fireEvent.click(showDetailsButtons[0]);
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getAllByText("Show Details")).toHaveLength(1);
    expect(screen.getByText("Hide Details")).toBeInTheDocument();

    fireEvent.click(showDetailsButtons[1]);
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getAllByText("Hide Details")).toHaveLength(2);
  });
});
