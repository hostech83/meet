/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
import Event from "../components/Event";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import mockData from "../mock-data";

const event = mockData[0];

describe("<Event /> component", () => {
  let EventComponent;
  beforeEach(() => {
    EventComponent = render(<Event event={event} />);
  });

  test("renders event title", () => {
    const eventTitle = EventComponent.queryByText(event.summary);
    expect(eventTitle).toBeInTheDocument();
  });

  test("renders event start time", () => {
    const eventTime = EventComponent.queryByText(event.created);
    expect(eventTime).toBeInTheDocument();
  });

  test("renders event location", () => {
    const eventLocation = EventComponent.queryByText(event.location);
    expect(eventLocation).toBeInTheDocument();
  });

  // Show Details button
  test("renders event details button", () => {
    const detailButton = EventComponent.queryByText("Show Details");
    expect(detailButton).toBeInTheDocument();
  });

  // Scenario 1
  test("event's details are hidden by default", () => {
    const eventDetails = EventComponent.container.querySelector(".details");
    expect(eventDetails).not.toBeInTheDocument();
  });

  // Scenario 2
  test('shows details after user clicks on button "Show Details"', async () => {
    // const user = userEvent.setup(); // Commented out

    const showDetailButton = EventComponent.queryByText("Show Details");
    await userEvent.click(showDetailButton); // Using userEvent directly

    const eventDetailsDom = EventComponent.container.firstChild;
    const eventDetails = eventDetailsDom.querySelector(".eventDetails");
    expect(eventDetails).toBeInTheDocument();
  });

  // Scenario 3
  test('hides details after user clicks on button "Hide details"', async () => {
    // const user = userEvent.setup(); // Commented out

    const showDetailButton = EventComponent.queryByText("Show Details");
    await userEvent.click(showDetailButton); // Using userEvent directly

    const hideDetailButton = EventComponent.queryByText("Hide Details");
    await userEvent.click(hideDetailButton); // Using userEvent directly

    const eventDetailsDom = EventComponent.container.firstChild;
    const eventDetails = eventDetailsDom.querySelector(".eventDetails");
    expect(eventDetails).not.toBeInTheDocument();
  });
});
