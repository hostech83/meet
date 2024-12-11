# src/features/specifyNumberOfEvents.feature

Feature: Specify Number of Events

Scenario: When user hasn't specified a number, 32 events are shown by default
  Given the user hasn't specified a number of events to display
  When the user loads the event list
  Then 32 events should be displayed

  Scenario: User can change the number of events displayed
  Given the user is viewing the event list
  When the user specifies a different number of events to display
  Then the specified number of events should be shown
  And the event list should update accordingly

Scenario: User requests more events than available
  Given there are 77 total events
  When user types "100" in the "Number of Events" textbox
  Then the app should display all 15 available events

Scenario: User changes number of events while filtered
  Given the user has filtered events for "Berlin"
  And there are 21 events in Berlin
  When the user changes the "Number of Events" to 5
  Then the app should display only 5 events from Berlin