# Meetup Events App

# Description

Welcome to the Meetup Events App, a serverless progressive web app (PWA) built with Create-React-App and Amazon Web Services (AWS). This app allows users to discover and filter events happening in cities near them. Enjoy the convenience of accessing event data from Google Calendar through the power of serverless technology.

# Features & Highlights

Serverless Architecture:
This app leverages serverless functions, utilizing AWS Lambda to communicate with Google Calendar API. Every time the user triggers an action that requires API access (such as filtering events), a serverless function is executed to fetch the required data.

# Responsive & Progressive:

As a PWA, the app provides seamless performance, even when offline, making sure that you can always view previously accessed events regardless of your connection status.

Core Features and Test Scenarios
We follow Gherkin’s "Given-When-Then" syntax to describe user stories and scenarios for testing each feature.

- Feature 1: Filter Events By City
  User Story:
  As a user, I want to filter events by city so I can see events happening near me.

Scenario 1: Show upcoming events from all cities when no city is searched.
GIVEN the user hasn’t searched for a city,
WHEN they open the app,
THEN a list of upcoming events from all cities should be displayed.

Scenario 2: Display suggestions when searching for a city.
GIVEN the main page is open,
WHEN the user starts typing in the city search box,
THEN a list of city suggestions should appear.

Scenario 3: Select a city from the suggestions.
GIVEN the user has typed a city and suggestions are showing,
WHEN the user selects a city from the list,
THEN they should see a list of events happening in that city.

- Feature 2: Show/Hide Event Details
  User Story:
  As a user, I want to show or hide event details to learn more about specific events.

Scenario 1: Event details are collapsed by default.
GIVEN the user hasn't expanded any event details,
WHEN the events list loads,
THEN all event details should be collapsed.

Scenario 2: Expand event details.
GIVEN the user hasn’t opened any event details,
WHEN they want to know more about a specific event,
THEN they should be able to expand the event to view more details.

Scenario 3: Collapse event details.
GIVEN the user has expanded event details,
WHEN they choose to hide the details,
THEN the information should collapse back.

- Feature 3: Specify Number of Events
  User Story:
  As a user, I want to control how many events are displayed so I can limit or expand my viewing options.

Scenario 1: Default to showing 32 events when no number is specified.
GIVEN the user hasn’t specified how many events to show,
WHEN the event list loads,
THEN 32 events should be displayed by default.

Scenario 2: Change the number of displayed events.
GIVEN the user wants to adjust the number of events shown,
WHEN they input a new number,
THEN the app should display the specified number of events.

Feature 4: Use the App Offline
User Story:
As a user, I want to use the app even when I'm offline so I can always access event information.

Scenario 1: Display cached data when offline.
GIVEN the user is offline,
WHEN they try to use the app,
THEN previously viewed events should be shown from the app’s cache.

Scenario 2: Show error when attempting to change search settings while offline.
GIVEN the user is offline,
WHEN they try to change the city or number of events,
THEN an error message should be displayed.

# Feature 5: Add an App Shortcut

User Story:
As a user, I want to add the Meet app to my device's home screen for quicker access.

Scenario 1: Prompt to add the app as a shortcut.
GIVEN the user is accessing the app on a mobile device,
WHEN they visit the app,
THEN they should be prompted to add the app to their home screen.
Technical Stack
Frontend: React, Create-React-App
Backend: AWS Lambda, Serverless Functions
API Integration: Google Calendar API
Styling: SCSS for responsive design
Get Started
To run this app locally:

# Clone the repository.

Install dependencies:
bash
Copy code
npm install
Start the app:
bash
Copy code
npm start
For a full production build:

bash
Copy code
npm run build
With this serverless app, you’ll be able to easily explore, filter, and track events happening in cities around you. Enjoy!

# Author

Houssni Msehel
