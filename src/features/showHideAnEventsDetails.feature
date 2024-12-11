# src/features/showedHideAnEventsDetails.feature

Feature: Show/Hide Event Details

    Scenario: An event element is collapsed by default
        Given the user is viewing the list of events
        Then all event elements should be in a collapsed state

    Scenario: User can expand an event to see details
        Given the user is viewing the list of events
        When the user clicks on a collapsed event element
        Then the event element should expand
        And the event details should be visible

    Scenario: User can collapse an event to hide details
        Given the user is viewing an expanded event element
        When the user clicks on the expanded event element
        Then the event element should collapse
        And the event details should be hidden

    Scenario: User expands multiple event details
        Given the user is viewing the event list
        When the user clicks to show details for multiple events
        Then the app should display expanded details for all selected events simultaneously

    Scenario: User collapses all expanded event details
        Given multiple events have their details expanded
        When the user clicks a "Collapse All" button
        Then the app should hide the details for all events