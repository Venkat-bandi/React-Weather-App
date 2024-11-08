

/*const WeatherDisplay = ({ weatherData, forecastData, unit }) => {
    if (!weatherData) {
      return <p>No weather data available. Please try searching again.</p>;
    }
  
    return (
      <div className="weather-display">
        <div className="current-weather">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>{weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
        </div>
  
        {forecastData && (
          <div className="forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-items">
              {forecastData.map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <p>{forecast.dt_txt}</p>
                  <p>{forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p>{forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default WeatherDisplay;*/
import React from 'react';
import './WeatherDisplay.css';

const WeatherDisplay = ({ weatherData, forecastData, unit }) => {
    if (!weatherData || !forecastData) {
      return <p>Type City to Search</p>;
    }
  
    return (
      <div className="weather-display">
        <div className="current-weather">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>{Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
        </div>
  
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecastData.map((forecast, index) => {
              const date = new Date(forecast.dt * 1000);  // Convert timestamp to date
              return (
                <div key={index} className="forecast-item">
                  <p>{date.toLocaleDateString()}</p>
                  <p>{Math.round(forecast.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p>{forecast.weather[0].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  

export default WeatherDisplay;

  