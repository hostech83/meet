// src/App.js
import React, { useState } from "react";
import EventList from "./components/EventList";
import CitySearch from "./components/CitySearch";
import NumberOfEvents from "./components/NumberOfEvents";

const App = () => {
  const [events] = useState([]);
  const handleNumberChange = (num) => {
    // Update events based on new number
  };

  return (
    <div>
      <CitySearch />
      <NumberOfEvents id="number-of-events" onChange={handleNumberChange} />
      <EventList events={events} />
    </div>
  );
};

export default App;
