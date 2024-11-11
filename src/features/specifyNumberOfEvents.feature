Feature: Specify Number of Events

  Scenario: Show default number of events when user hasn’t specified a number
    Given the event app is displayed
    And the user has not specified the number of events to display
    When the user opens the event list
    Then ("32") events should be displayed by default

  Scenario: User can change the number of events displayed
    Given the event app is displayed
    And the user has specified the number of events to display as "10"
    When the user changes the number of events to display to "10"
    Then the event list should display "10" events  