/* eslint-disable testing-library/no-wait-for-multiple-assertions */
// src/__tests__/App.test.js

import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import { extractLocations, getEvents } from "../api";
import mockData from "../mock-data";
import userEvent from "@testing-library/user-event";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

describe("<App /> component", () => {
  beforeEach(() => {
    getEvents.mockClear();
    getEvents.mockResolvedValue(mockData);
    extractLocations(mockData);
  });

  test("renders CitySearch", async () => {
    render(<App />);
    await waitFor(() => {
      const citySearch = screen.getByTestId("city-search");
      expect(citySearch).toBeInTheDocument();
    });
  });

  test("renders NumberOfEvents", async () => {
    render(<App />);
    await waitFor(() => {
      const numberOfEvents = screen.getByTestId("number-of-events");
      expect(numberOfEvents).toBeInTheDocument();
    });
  });

  test("renders EventList", async () => {
    render(<App />);
    await waitFor(() => {
      const eventList = screen.getByTestId("eventlist");
      expect(eventList).toBeInTheDocument();
    });
  });

  test("renders CityEventsChart", async () => {
    render(<App />);
    await waitFor(async () => {
      const chartsContainer = screen.getByTestId("charts-container");
      expect(chartsContainer).toBeInTheDocument();
      const CityEventsChart = screen.queryByTestId("scatterChart");
      expect(CityEventsChart).toBeInTheDocument();
      expect(screen.getByTestId("pieChart")).toBeInTheDocument();
    });
  });
  test("renders EventGenresChart", async () => {
    render(<App />);
    await waitFor(async () => {
      const chartsContainer = screen.getByTestId("charts-container");
      expect(chartsContainer).toBeInTheDocument();
      expect(screen.getByTestId("pieChart")).toBeInTheDocument();
    });
  });

  test("renders list of events when events are available", async () => {
    render(<App />);
    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
    });
  });

  test("displays no events and no location suggestions when getEvents returns empty array", async () => {
    getEvents.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      const eventList = screen.getByTestId("eventlist");
      const events = within(eventList).queryAllByRole("listitem");
      expect(events).toHaveLength(0);
    });

    // Check that the CitySearch component shows no suggestions
    const citySearchInput = screen.getByTestId("city-search-input");
    await userEvent.click(citySearchInput);
    await userEvent.type(citySearchInput, "a");

    await waitFor(() => {
      const suggestionsList = screen.queryByTestId("suggestions-list");
      expect(suggestionsList).toBeInTheDocument();
      const suggestions = within(suggestionsList).queryAllByRole("listitem");
      // There should only be one item: "See all cities"
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toHaveTextContent("See all cities");
    });
  });

  test("handles null return from getEvents", async () => {
    getEvents.mockResolvedValue(null);
    render(<App />);

    await waitFor(() => {
      const eventList = screen.getByTestId("eventlist");
      const events = within(eventList).queryAllByRole("listitem");
      expect(events).toHaveLength(0);
    });

    const citySearchInput = screen.getByTestId("city-search-input");
    await userEvent.click(citySearchInput);

    await waitFor(() => {
      const suggestionsList = screen.queryByTestId("suggestions-list");
      expect(suggestionsList).toBeInTheDocument();
      const suggestions = within(suggestionsList).queryAllByRole("listitem");
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toHaveTextContent("See all cities");
    });
  });

  test("shows warning alert when offline", async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });

    // Mock localStorage
    const mockTimestamp = "1622505600000"; // June 1, 2021 UTC
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(mockTimestamp),
    };
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });

    getEvents.mockResolvedValue(mockData);

    render(<App />);

    await waitFor(() => {
      const warningAlert = screen.getByText(/You are currently offline/i);
      expect(warningAlert).toBeInTheDocument();

      // Format date to match the exact output
      const date = new Date(parseInt(mockTimestamp));
      const formattedDate = date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const expectedContent = `You are currently offline, the current data was last refreshed on ${formattedDate}`;
      expect(warningAlert).toHaveTextContent(expectedContent);
    });
  });

  test("hides warning alert when online", async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });

    getEvents.mockResolvedValue(mockData);

    render(<App />);

    await waitFor(() => {
      const warningAlert = screen.queryByText(/You are currently offline/i);
      expect(warningAlert).not.toBeInTheDocument();
    });
  });
});

describe("<App /> integration", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });
  test("renders a list of events matching the city selected by the user", async () => {
    render(<App />);

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Berlin");

    const suggestionList = await screen.findByTestId("suggestions-list");
    const berlinSuggestion =
      within(suggestionList).getByText("Berlin, Germany");
    await userEvent.click(berlinSuggestion);

    await waitFor(() => {
      const eventList = screen.getByTestId("eventlist");
      const allRenderedEventItems = within(eventList).getAllByRole("listitem");
      const berlinEvents = mockData.filter((event) =>
        event.location.includes("Berlin")
      );
      expect(allRenderedEventItems).toHaveLength(berlinEvents.length);
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      allRenderedEventItems.forEach((event) => {
        expect(event.textContent).toContain("Berlin, Germany");
      });
    });
  });
});
