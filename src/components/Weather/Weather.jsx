import React, { useState, useEffect } from "react";
import Location from "../Location/Location";
import axios from "axios";
import { countries } from "countries-list";
import { Country } from "country-state-city";
import Select from "react-select";
import { getCode } from "country-list";
import "./Weather.css";
import { message, Button, Modal } from "antd";

const API_KEY = "1be607d4afba889413076c346fa470e0";

const weatherBackgrounds = {
  Clear: "url('src/assets/clear.gif')",
  Rain: "url('src/assets/rain-raining-morning.gif')", // Rainy
  Clouds: "url('src/assets/Clouds.gif')", //Cloudy
  Snow: "url('src/assets/Snow.gif')", // Snowy src/assets/Thunderstorm.gif
  Thunderstorm: "url('src/src/assets/Thunderstorm.gif')",
  Drizzle: "linear-gradient(to right, #3a7bd5, #3a6073)", // Drizzle
  Default: "linear-gradient(to right, #4facfe, #00f2fe)", // Default
};

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [clouds, setClouds] = useState("");
  const [time, setTime] = useState("");
  console.log(clouds, "dd");

  const formatOptions = (data) =>
    data.map((item) => ({
      value: item.isoCode || item.name,
      label: item.name,
    }));

  const handleCloud = (data) => {
    setClouds(data);
  };
  const countryOptions = formatOptions(Country.getAllCountries());

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    const countryCode = getCode(option.label);

    if (countryCode && countries[countryCode]) {
      setCity(countries[countryCode].capital);
    }
  };
  const getLocalTimeFromOffset = (offsetInSeconds) => {
    const nowUTC =
      new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(nowUTC + offsetInSeconds * 1000);
    return localTime.toLocaleString();
  };

  const fetchWeather = async () => {
    if (!city) {
      Modal.warning({
        title: "Input Required",
        content: "Please enter a city or select a country.",
        okText: "OK",
        style: { top: 20 },
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setTime(getLocalTimeFromOffset(response.data.timezone));
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
      Modal.error({
        title: "Location Not Found",
        content: "City or country not found. Please enter a valid name.",
        okText: "Ok",
        style: { top: 20 },
      });
    }
  };
  console.log(weather, "weather");
  useEffect(() => {
    if (weather?.weather[0].main) {
      const weatherCondition = weather.weather[0].main;
      document.body.style.background =
        weatherBackgrounds[weatherCondition] || weatherBackgrounds[clouds];
    } else {
      document.body.style.background = weatherBackgrounds[clouds];
    }
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    document.body.style.transition = "background 0.5s ease-in-out";
  }, [weather?.weather[0].main, clouds]); // Update only when main weather changes

  console.log();
  // tine realted  informat
  return (
    <div className="container">
      <div className="weather-card">
        <h2>🌤 Weather App</h2>
        <input
          type="text"
          placeholder="Enter city or country"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field"
          required
        />
        <Select
          options={countryOptions}
          onChange={handleCountryChange}
          placeholder="Select a country"
          className="select-dropdown"
        />
        <Button onClick={fetchWeather} className="weather-button">
          Get Weather
        </Button>

        {weather ? (
          <div className="weather-info">
            <h3>
              📍 Location: {weather.name}, {weather.sys.country}
            </h3>
            <p>🕒 Time: {time}</p>

            <p>🌡 Temperature: {weather.main.temp}°C</p>
            <p>🌤 Weather: {weather.weather[0].description}</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <Location clouds={handleCloud} />
        )}
      </div>
    </div>
  );
};

export default Weather;
