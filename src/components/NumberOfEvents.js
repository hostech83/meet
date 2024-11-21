/* eslint-disable jsx-a11y/no-redundant-roles */
// src/components/NumberOfEvents.js
import React, { useState } from "react";

const NumberOfEvents = ({ onChange, currentNOE = 32, setError }) => {
  const [numberOfEvents, setNumberOfEvents] = useState(currentNOE);
  const handleInputChanged = (e) => {
    const value = Number(e.target.value); // Ensure value is a number
    let errorText = "";

    if (isNaN(value) || value <= 0) {
      errorText = "Please enter a valid number greater than 0.";
      const newValue = parseInt(e.target.value) || "";
      setNumberOfEvents(newValue);
      if (onChange) onChange(parseInt(e.target.value) || "");
    } else {
      setNumberOfEvents(value);
      if (onChange) onChange(value); // Notify parent of the valid value
    }

    setError(errorText); // Update error state
  };

  return (
    <div id="number-of-events">
      <label htmlFor="event-count-input">Number of Events:</label>
      <input
        id="event-count-input"
        type="text"
        role="textbox"
        data-testid="event-count-input"
        value={numberOfEvents}
        onChange={handleInputChanged}
        aria-describedby="event-count-error"
      />
    </div>
  );
};

export default NumberOfEvents;
