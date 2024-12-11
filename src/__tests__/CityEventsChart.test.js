// src/components/CityEventsChart.js
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import CityEventsChart from "../components/CityEventsChart";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getEvents, extractLocations } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const renderWithTheme = (component, { isDarkMode = false } = {}) => {
  return render(
    <ThemeProvider value={{ isDarkMode }}>{component}</ThemeProvider>
  );
};

describe("<CityEventsChart />", () => {
  let allLocations;

  beforeEach(() => {
    allLocations = extractLocations(mockData);
    getEvents.mockResolvedValue(mockData);
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  test("renders chart with correct data representation", async () => {
    renderWithTheme(
      <CityEventsChart events={mockData} allLocations={allLocations} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("scatterChart")).toBeInTheDocument();
    });

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();

    // Check for data points
    const dataPoints = screen.getAllByRole("img");
    expect(dataPoints.length).toBeGreaterThan(0);
  });

  test("renders chart with empty data set", async () => {
    renderWithTheme(<CityEventsChart events={[]} allLocations={[]} />);

    const noDataMessage = await screen.findByText(
      "No data available for chart"
    );
    expect(noDataMessage).toBeInTheDocument();
  });

  test("renders chart for small screens", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    renderWithTheme(
      <CityEventsChart events={mockData} allLocations={allLocations} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("scatterChart")).toBeInTheDocument();
    });

    const xAxisLabels = screen.getAllByTestId(/^XAxislabel-/);
    expect(xAxisLabels[0]).toHaveStyle({ fontSize: "10px" });
  });

  test("handles window resize", async () => {
    renderWithTheme(
      <CityEventsChart events={mockData} allLocations={allLocations} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("scatterChart")).toBeInTheDocument();
    });

    act(() => {
      global.innerWidth = 400;
      global.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      const xAxisLabels = screen.getAllByTestId(/^XAxislabel-/);
      expect(xAxisLabels[0]).toHaveStyle({ fontSize: "10px" });
    });
  });

  test("renders chart with single event data", async () => {
    const singleEventMockData = [mockData[0]];
    const singleEventLocations = extractLocations(singleEventMockData);

    renderWithTheme(
      <CityEventsChart
        events={singleEventMockData}
        allLocations={singleEventLocations}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("scatterChart")).toBeInTheDocument();
    });

    const dataPoints = screen.getAllByRole("img");
    expect(dataPoints).toHaveLength(1);
  });
});
