import React, { useEffect, useState } from 'react';
import './WeatherApp.css';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';
import drizzle_icon from '../Assets/drizzle.png';

const WeatherApp = () => {
  let api_key = "41635e6bed880627aa758c6171a0548a";

  const [wicon, setWicon] = useState(cloud_icon);
  const [errorMessage, setErrorMessage] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour >= 18); // Assuming night time is from 6 PM to 6 AM
  }, []);

  useEffect(() => {
    const inputElement = document.querySelector(".cityInput");
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        search();
      }
    };
    inputElement.addEventListener("keypress", handleKeyPress);
    return () => {
      inputElement.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return 0;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;

    let response = await fetch(url);
    let data = await response.json();

    if (data.cod === "404") {
      setErrorMessage("Please enter a correct city name");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    setWeatherData(data);

    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      setWicon(clear_icon);
    } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
      setWicon(cloud_icon);
    } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
      setWicon(drizzle_icon);
    } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
      setWicon(drizzle_icon);
    } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
      setWicon(rain_icon);
    } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
      setWicon(snow_icon);
    } else {
      setWicon(clear_icon);
    }
  };

  return (
    <div className={`container ${isNight ? 'night' : ''}`}>
      <div className='top-bar'>
        <input type="text" className="cityInput" placeholder="Search" />
        <div className="search-icon" onClick={search}>
          <img src={search_icon} alt="" />
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {weatherData ? (
        <>
          <div className="weather-image">
            <img src={wicon} alt="" />
          </div>
          <div className="weather-temp">{Math.floor(weatherData.main.temp)}°C</div>
          <div className="weather-location">{weatherData.name}</div>
          <div className="data-container">
            <div className="element">
              <img src={humidity_icon} alt="" className="icon" />
              <div className="data">
                <div className="humidity-percent">{weatherData.main.humidity}%</div>
                <div className="text">Humidity</div>
              </div>
            </div>
            <div className="element">
              <img src={wind_icon} alt="" className="icon" />
              <div className="data">
                <div className="wind-rate">{weatherData.wind.speed} km/h</div>
                <div className="text">Wind Speed</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="welcome-message">
          <h1>Welcome to the Weather App!</h1>
          <p>Please enter a city to get the weather information.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;