# About Nalshi
Nalshi is a term for *weather* in the Korean language. This is a basic weather app using Google's Places API and Weather.gov or National Weather Service's API.

# Updates
## MVP
MVP functionality includes the ability to do the following:
- get basic weather information for a general location in the USA on an hourly or weekly basis
- save locations to quickly gain the weather forecast for that spot

This phase focused on basic usability and functionality before anything else.

# Getting Started
After cloning this repo, run `npm start` to get started. This will spin up the app at the URL *http://localhost:3000*.

**You will need a Google API key.**
For more information on the Google Places API and how to get started and/or how to get an API key, refer to their [documentation](https://developers.google.com/maps/documentation/places/web-service/overview).

When you have your API key, save it as "*REACT_APP_API_KEY*" in a **.env** or **.env.development** file.
e.g. `REACT_APP_API_KEY = asl;dhjfl;aksjdflkj`
You may change the name, but you'll also have to change it in the script tag in */public/index.html* as well.

# Coming to Nalshi
- Proper responsiveness for all devices
- Column grid view for forecasts on larger screens making reading easier
- Implement a *NALSHI design* for this web app
- Unit tests for helpers, snapshot tests for components, and end-to-end testing
- Proper testing and updates for accessibility
- Performance testing and memoize any opportunities
- Better error handling in general and especially for user inputs and edge cases
- Transitions and animations for less jankiness and best application flows, or none based on user's browser settings
- Ability to delete favorited locations
- Fix any and all bugs

# Reporting bugs
Please file an issue on Github with information pertaining to the bug, your environment, and all other details which may help with debugging and resolving the bug.