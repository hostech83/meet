// src/components/CitySearch.js

import React, { useState, useMemo, useEffect } from "react";
import { Form, InputGroup, ListGroup, CloseButton } from "react-bootstrap";

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [infoText, setInfoText] = useState("");

  const suggestions = useMemo(() => {
    return allLocations
      ? allLocations.filter((location) => {
          return location.toUpperCase().indexOf(query.toUpperCase()) > -1;
        })
      : [];
  }, [allLocations, query]);

  useEffect(() => {
    if (suggestions.length === 0 && query !== "") {
      setInfoText(
        "We can not find the city you are looking for. Please try another city"
      );
    } else {
      setInfoText("");
    }
    if (typeof setInfoAlert === "function") {
      setInfoAlert(infoText);
    }
  }, [suggestions, query, setInfoAlert, infoText]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleItemClicked = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setCurrentCity(suggestion);
    setInfoText("");
  };

  const handleAllCitiesClicked = () => {
    setQuery("");
    setShowSuggestions(false);
    setCurrentCity("all");
    setInfoText("");
  };

  const handleBlur = (event) => {
    // Delay hiding suggestions to allow for click events on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <Form
      id="city-search"
      data-testid="city-search"
      role="region"
      aria-label="City Search"
      className="d-flex flex-column align-items-center justify-content-center w-100"
      style={{ maxWidth: "500px" }}
    >
      <InputGroup className="w-100">
        <Form.Label
          htmlFor="city"
          size="lg"
          className="w-100 text-center mb-2 labelCity"
        >
          City Search:{" "}
        </Form.Label>
        <div className="position-relative w-100">
          <Form.Control
            id="city"
            type="text"
            size="lg"
            className="city mb-2 pe-5"
            aria-label="City search"
            value={query}
            onChange={handleInputChanged}
            placeholder="Search for a city"
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            data-testid="city-search-input"
          />
          {query && (
            <CloseButton
              className="buttonClear position-absolute top-50 end-0 translate-middle-y pe-3"
              onClick={handleAllCitiesClicked}
              aria-label="Clear selection"
              data-testid="clear-selection"
            />
          )}
        </div>
        {showSuggestions && (
          <ListGroup
            as="ul"
            className="suggestions w-100"
            data-testid="suggestions-list"
            aria-label="suggestions-list"
          >
            {suggestions.map((suggestion, index) => (
              <ListGroup.Item
                as="li"
                className="citiesListItem"
                onClick={() => handleItemClicked(suggestion)}
                key={suggestion}
                aria-label="listitem"
                data-testid={`suggestion-${index}`}
                action
                variant="dark"
              >
                {suggestion}
              </ListGroup.Item>
            ))}
            <ListGroup.Item
              as="li"
              className="citiesListItem"
              onClick={handleAllCitiesClicked}
              aria-label="listitem"
              data-testid="see-all-cities"
              key={"See all cities"}
              action
              variant="dark"
            >
              <b>See all cities</b>
            </ListGroup.Item>
          </ListGroup>
        )}
      </InputGroup>
    </Form>
  );
};

export default CitySearch;
