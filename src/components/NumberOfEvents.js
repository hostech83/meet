/* eslint-disable jsx-a11y/no-redundant-roles */
// src/components/NumberOfEvents.js
import React, { useState } from "react";

const NumberOfEvents = ({ onChange }) => {
  const [eventCount, setEventCount] = useState(32);

  const handleInputChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setEventCount(newCount);
    onChange(newCount); // Callback function to inform the parent component
  };

  return (
    <div id="number-of-events">
      <label htmlFor="event-count-input">Number of Events:</label>
      <input
        type="number"
        role="textbox"
        data-testid="event-count-input"
        value={eventCount}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default NumberOfEvents;
