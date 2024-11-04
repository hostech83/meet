/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/prefer-screen-queries */

// src/__tests__/EventList.test.js

import { render, within, waitFor } from "@testing-library/react";
import EventList from "../components/EventList";
import { getEvents } from "../api";
import App from "../App";

describe("<EventList /> component", () => {
  let EventListComponent;
  beforeEach(() => {
    EventListComponent = render(<EventList />);
  });

  test('has an element with "list" role', () => {
    expect(EventListComponent.queryByRole("list")).toBeInTheDocument();
  });

  test("renders correct number of events", async () => {
    const allEvents = await getEvents();
    EventListComponent.rerender(<EventList events={allEvents} />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(
      allEvents.length
    );
  });

  describe("<EventList /> integration", () => {
    test("renders a list of events when the app is mounted and rendered", async () => {
      const AppComponent = render(<App />);
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector("#event-list");

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole("listitem");
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });
  });
});
