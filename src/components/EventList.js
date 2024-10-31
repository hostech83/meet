// src/components/EventList.js
import Event from "./Event";

const EventList = ({ events }) => {
  // TODO: add the NumberOfEvents here with the onChange function
  // to change how many events we see in the below events.map
  return (
    <ul id="event-list">
      {events
        ? events.map((event, index) => <Event key={index} event={event} />)
        : null}
    </ul>
  );
};

export default EventList;
