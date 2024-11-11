Feature: Show/Hide Event Details

  Scenario:  An event element is collapsed by default
    Given user is on the app
    When the app display list of events
    Then the user should see the event element collapsed by default.
  
  Scenario: User can expand an event to see details
    Given the app is and events details are hidden
    When the user click the show event button 
    Then the user should see the hidden event expand to view.

  Scenario: User can collapse an event to hide details.
    Given the event is expanded and it's visible
    When user click then hide event button
    Then user should see the event collape and hidden