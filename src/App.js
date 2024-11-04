/* eslint-disable react-hooks/exhaustive-deps */
// src/App.js

import React, { useState, useEffect } from "react";
import EventList from "./components/EventList";
import CitySearch from "./components/CitySearch";
import NumberOfEvents from "./components/NumberOfEvents";
import { extractLocations, getEvents } from "./api";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");

  const handleNumberChange = (num) => {
    setCurrentNOE(num);
  };

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  useEffect(() => {
    console.log("Updated allLocations:", allLocations);
  }, [allLocations]);

  const fetchData = async () => {
    const allEvents = (await getEvents()) || [];
    const filteredEvents =
      currentCity === "See all cities"
        ? allEvents
        : allEvents.filter((event) => event.location === currentCity);
    setEvents(filteredEvents.slice(0, currentNOE));
    const extractedLocations = extractLocations(allEvents);

    if (extractedLocations.length > 0 && extractedLocations !== allLocations) {
      setAllLocations([...extractedLocations]); // Spread to create a new array reference
    }
  };

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents
        id="number-of-events"
        onChange={handleNumberChange}
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
      />
      <EventList events={events} />
    </div>
  );
};

export default App;
