const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const errorMessage = document.getElementById("error-message");

const temperatureValue = document.getElementById("temperature");
const humidityValue = document.getElementById("humidity");
const windSpeedValue = document.getElementById("wind-speed");
const stationMessage = document.getElementById("station-message");
const stationCityRow = document.getElementById("city-row");
const stationCity = document.getElementById("station-city");
const connectionStatus = document.getElementById("connection-status");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.textContent = isLoading ? "Loading..." : "Search Weather";
  connectionStatus.textContent = isLoading ? "Connecting..." : connectionStatus.textContent;
}

async function fetchWeather(event) {
  if (event) event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  setLoading(true);
  clearError();

  try {
    // Open-Meteo's public APIs support browser requests and do not require an API key.
    const geocodingUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geocodingUrl.search = new URLSearchParams({
      name: city,
      count: "1",
      language: "en",
      format: "json"
    }).toString();

    const geoResponse = await fetch(geocodingUrl);
    if (!geoResponse.ok) throw new Error("City lookup failed.");
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found or weather data unavailable.");
    }

    const place = geoData.results[0];
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.search = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,rain",
      timezone: "auto"
    }).toString();

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error("Weather lookup failed.");
    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      throw new Error("Weather data unavailable.");
    }

    const current = weatherData.current;
    temperatureValue.textContent = `${current.temperature_2m} °C`;
    humidityValue.textContent = `${current.relative_humidity_2m} %`;
    windSpeedValue.textContent = `${current.wind_speed_10m} km/h`;

    stationMessage.textContent = "Weather data received successfully from the backend.";
    stationCity.textContent = place.name;
    stationCityRow.hidden = false;
    connectionStatus.textContent = "Connected";
  } catch (error) {
    showError("Unable to load weather data. Please check your internet connection.");
    temperatureValue.textContent = "-- °C";
    humidityValue.textContent = "-- %";
    windSpeedValue.textContent = "-- km/h";
    stationMessage.textContent = "Search for a city to load its current weather data.";
    stationCityRow.hidden = true;
    connectionStatus.textContent = "Not connected yet";
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search Weather";
  }
}

form.addEventListener("submit", fetchWeather);
