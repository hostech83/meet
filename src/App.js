/* eslint-disable react-hooks/exhaustive-deps */
// src/App.js

import React, { useState, useEffect } from "react";
import EventList from "./components/EventList";
import CitySearch from "./components/CitySearch";
import NumberOfEvents from "./components/NumberOfEvents";
import { extractLocations, getEvents } from "./api";
import { ErrorAlert, InfoAlert, WarningAlert } from "./components/Alert";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [error, setError] = useState("");
  const [warningAlertMessage, setWarningAlertMessage] = useState(""); // Renamed state

  const handleNumberChange = (num) => {
    setCurrentNOE(num);
  };

  console.log({ currentNOE });
  useEffect(() => {
    console.log("fetch events");
    const fetchData = async () => {
      try {
        const allEvents = await getEvents();
        const filteredEvents =
          currentCity === "See all cities"
            ? allEvents
            : allEvents.filter((event) => event.location === currentCity);
        setEvents(filteredEvents.slice(0, currentNOE));

        const extractedLocations = extractLocations(allEvents);
        if (
          extractedLocations.length > 0 &&
          JSON.stringify(extractedLocations) !== JSON.stringify(allLocations)
        ) {
          setAllLocations(extractedLocations);
        }
      } catch (error) {
        setError("Failed to fetch events. Please try again.");
      }
    };

    //check if user is online and show warning
    if (!navigator.onLine) {
      setWarningAlertMessage("You are offline. Events data may be outdated."); // Updated setter
    } else {
      setWarningAlertMessage(""); // Updated setter
    }
    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {error && <ErrorAlert text={error} />}
        {warningAlertMessage && <WarningAlert text={warningAlertMessage} />}
        {/* Updated variable */}
      </div>
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />
      <NumberOfEvents
        id="number-of-events"
        onChange={handleNumberChange}
        currentNOE={currentNOE}
        setError={setError}
      />
      <EventList events={events} />
    </div>
  );
};

export default App;
