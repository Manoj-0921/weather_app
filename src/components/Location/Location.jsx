import axios from "axios";
import React, { useEffect, useState } from "react";

const WEATHER_API_KEY = "1be607d4afba889413076c346fa470e0"; // Replace with your OpenWeatherMap API key

const Location = ({ clouds }) => {
  // Expecting a function to send weather condition to parent
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setError(null);
    setWeather(null);
    setLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position, "pos");
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          console.log(lat, lon, "lat ");
          setCoords({ latitude: lat, longitude: lon });

          // Fetch weather using lat & lon
          await getWeather(lat, lon);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Function to fetch weather by latitude & longitude
  const getWeather = async (lat, lon) => {
    try {
      let response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      let data = response.data;
      console.log(data, "data");
      if (data && data.weather) {
        const weatherData = {
          description: data.weather[0].description,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          location: data.name || "Unknown Location",
          country: data.sys.country || "Unknown Country",
          cloud: data.weather[0].main,
        };

        setWeather(weatherData);
        clouds(data.weather[0].main);
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    }
  };

  console.log(weather, "weather");
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      {coords && (
        <div>
          {weather ? (
            <div className="weather-info">
              <h3>
                📍 Location: {weather.location}, {weather.country}
              </h3>
              <p>🌡 Temperature: {weather.temperature}°C</p>
              <p>🌤 Weather: {weather.description}</p>
              <p>💧 Humidity: {weather.humidity}%</p>
              <p>💨 Wind Speed: {weather.windSpeed} m/s</p>
            </div>
          ) : (
            <p>Weather data not available.</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </>
  );
};

export default Location;
