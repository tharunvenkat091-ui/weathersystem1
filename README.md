# WeatherWatch — HTML, CSS and JavaScript version

This project has been converted from the React/Vite frontend and Spring Boot weather endpoint into a standalone HTML/CSS/JavaScript website.

## Run
1. Extract this ZIP file.
2. Open `index.html` in a modern browser.
3. Enter a city and choose **Search Weather**. An internet connection is required because the app reads current conditions from the public Open-Meteo geocoding and forecast APIs.

No npm install, React, Vite, Java, Spring Boot, or database is required for this frontend-only version.

## Files
- `index.html` — page structure
- `style.css` — original dashboard styling and responsive layout
- `app.js` — form behavior and weather API requests

## Note
The original server endpoint was replaced with direct browser requests to Open-Meteo so the project can run using HTML, CSS, and JavaScript only. The visible layout, labels, colors, card arrangement, and responsive styling are retained. API error messaging mentions the internet connection rather than the removed backend.
