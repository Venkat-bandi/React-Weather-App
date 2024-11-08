/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import WeatherDisplay from './WeatherDisplay';
import Favorites from './Favorites';
import './App.css';

const App = () => {
  const weatherkey = 'f016c1ad6036362c5bafd15b50b21d0c'; // Replace with your actual API key
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric'); // Celsius by default
  const [lastCity, setLastCity] = useState(localStorage.getItem('lastCity') || 'London'); // Default city

  // Fetch weather data when the city changes
  useEffect(() => {
    getWeatherData(lastCity);
  }, [lastCity, unit]); // Re-fetch weather data when unit changes

  // Fetch favorite cities from JSON server
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await axios.get('http://localhost:5000/favorites');
      setFavorites(response.data);
    };
    fetchFavorites();
  }, []);

  // Function to fetch weather and forecast
  const getWeatherData = async (city) => {
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherkey}&units=${unit}`);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherkey}&units=${unit}`);

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data.list.slice(0, 5)); // Get 5-day forecast (every 3 hours)
      localStorage.setItem('lastCity', city); // Save last searched city to local storage
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null); // Reset weather data on error
    }
  };

  // Add a city to favorites
  const addFavorite = async (city) => {
    if (!favorites.some(fav => fav.name === city)) {
      const newFavorite = { name: city };
      setFavorites([...favorites, newFavorite]);
      await axios.post('http://localhost:5000/favorites', newFavorite);
    }
  };

  // Remove a city from favorites (using ID, not name)
  const removeFavorite = async (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id)); // Filter by ID
    await axios.delete(`http://localhost:5000/favorites/${id}`); // Delete by ID
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="app-container">
      <Search getWeatherData={getWeatherData} setLastCity={setLastCity} />
      <WeatherDisplay weatherData={weatherData} forecastData={forecastData} unit={unit} />
      <Favorites 
        favorites={favorites} 
        addFavorite={addFavorite} 
        removeFavorite={removeFavorite} 
      />
      <button className="toggle-button" onClick={toggleUnit}>
        Toggle to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
      </button>
    </div>
  );
};

export default App;*/

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import WeatherDisplay from './WeatherDisplay';
import Favorites from './Favorites';
import './App.css';

const App = () => {
  const weatherkey = 'f016c1ad6036362c5bafd15b50b21d0c'; // Your actual API key
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric'); // Celsius by default
  const [city, setCity] = useState(''); // City input for search
  const [error, setError] = useState(''); // Error message for city not found
  const [showAddButton, setShowAddButton] = useState(false); // Show add to favorites button

  // Fetch favorite cities from JSON server
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await axios.get('http://localhost:5000/favorites');
      setFavorites(response.data);
    };
    fetchFavorites();
  }, []);

  // Fetch weather and forecast data
  const getWeatherData = async (city) => {
    try {
      // Fetch current weather data
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherkey}&units=${unit}`);
      
      // Fetch 5-day forecast data (every 3 hours)
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherkey}&units=${unit}`);

      // Set current weather data
      setWeatherData(weatherResponse.data);

      // Filter 5-day forecast data (one data point per day, e.g., noon)
      const dailyForecast = forecastResponse.data.list.filter((data, index) => {
        return index % 8 === 0;  // Every 8th entry corresponds to a new day (3-hour intervals)
      });

      setForecastData(dailyForecast);

      localStorage.setItem('lastCity', city); // Save last searched city to local storage
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null); // Reset weather data on error
      setForecastData(null); // Reset forecast data on error
    }
};


  // Add a city to favorites
  const addFavorite = (city) => {
    if (!favorites.find(fav => fav.name === city)) {
      const newFavorite = { name: city };
      setFavorites(prevFavorites => {
        const updatedFavorites = [...prevFavorites, newFavorite];
        return updatedFavorites;
      });
      axios.post('http://localhost:5000/favorites', newFavorite);
    }
  };

  // Remove a city from favorites
  const removeFavorite = (cityName) => {
    const favoriteToRemove = favorites.find(fav => fav.name === cityName);
    if (favoriteToRemove && favoriteToRemove.id) {
      // Optimistically update UI before the request completes
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.name !== cityName));
      
      // Now send the delete request to JSON server
      axios.delete(`http://localhost:5000/favorites/${favoriteToRemove.id}`)
        .catch(err => {
          console.error('Error deleting favorite:', err);
          // If there's an error with deletion, we can revert the UI update
          setFavorites(prevFavorites => [...prevFavorites, favoriteToRemove]);
        });
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    // Re-fetch weather data when unit is changed
    if (weatherData) {
      getWeatherData(weatherData.name);
    }
  };

  return (
    <div className="app-container">
      <Search
        city={city}
        setCity={setCity}
        getWeatherData={getWeatherData}
      />

      {error && <p className="error">{error}</p>}

      <WeatherDisplay
        weatherData={weatherData}
        forecastData={forecastData}
        unit={unit}
      />

      {showAddButton && (
        <button onClick={() => addFavorite(weatherData.name)}>
          Add to Favorites
        </button>
      )}

      <Favorites
        favorites={favorites}
        removeFavorite={removeFavorite}
        getWeatherData={getWeatherData}
      />

      <button onClick={toggleUnit}>Toggle Celsius/Fahrenheit</button>
    </div>
  );
};

export default App;*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import WeatherDisplay from './WeatherDisplay';
import Favorites from './Favorites';
import './App.css';

const App = () => {
  const weatherkey = 'f016c1ad6036362c5bafd15b50b21d0c'; // Your actual API key
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric'); // Celsius by default
  const [city, setCity] = useState(''); // City input for search
  const [error, setError] = useState(''); // Error message for city not found
  const [showAddButton, setShowAddButton] = useState(false); // Show add to favorites button

  // Fetch favorite cities from JSON server
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await axios.get('http://localhost:5000/favorites');
      setFavorites(response.data);
    };
    fetchFavorites();
  }, []);

  // Fetch weather and forecast data
  const getWeatherData = async (city) => {
    try {
      // Fetch current weather data
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherkey}&units=${unit}`);
      
      // Fetch 5-day forecast data (every 3 hours)
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherkey}&units=${unit}`);

      // Set current weather data
      setWeatherData(weatherResponse.data);

      // Filter 5-day forecast data (one data point per day, e.g., noon)
      const dailyForecast = forecastResponse.data.list.filter((data, index) => {
        return index % 8 === 0;  // Every 8th entry corresponds to a new day (3-hour intervals)
      });

      setForecastData(dailyForecast);

      // Reset error and show Add to Favorites button if city is not in favorites
      setError('');
      setShowAddButton(!favorites.find(fav => fav.name === city));

      localStorage.setItem('lastCity', city); // Save last searched city to local storage
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null); // Reset weather data on error
      setForecastData(null); // Reset forecast data on error
      setError('City not found. Please try again.'); // Display error message
      setShowAddButton(false); // Hide the Add to Favorites button on error
    }
};

  // Add a city to favorites
  const addFavorite = (city) => {
    if (!favorites.find(fav => fav.name === city)) {
      const newFavorite = { name: city };
      setFavorites(prevFavorites => {
        const updatedFavorites = [...prevFavorites, newFavorite];
        return updatedFavorites;
      });
      axios.post('http://localhost:5000/favorites', newFavorite);
      setShowAddButton(false); // Hide the add button once the city is added
    }
  };

  // Remove a city from favorites
  const removeFavorite = (cityName) => {
    const favoriteToRemove = favorites.find(fav => fav.name === cityName);
    if (favoriteToRemove && favoriteToRemove.id) {
      // Optimistically update UI before the request completes
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.name !== cityName));
      
      // Now send the delete request to JSON server
      axios.delete(`http://localhost:5000/favorites/${favoriteToRemove.id}`)
        .catch(err => {
          console.error('Error deleting favorite:', err);
          // If there's an error with deletion, we can revert the UI update
          setFavorites(prevFavorites => [...prevFavorites, favoriteToRemove]);
        });
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    // Re-fetch weather data when unit is changed
    if (weatherData) {
      getWeatherData(weatherData.name);
    }
  };

  return (
    <div className="app-container">
      <Search
        city={city}
        setCity={setCity}
        getWeatherData={getWeatherData}
      />

      {error && <p className="error">{error}</p>}

      <WeatherDisplay
        weatherData={weatherData}
        forecastData={forecastData}
        unit={unit}
      />

      {showAddButton && (
        <button className="add-to-favorites-button" onClick={() => addFavorite(weatherData.name)}>
          Add to Favorites
        </button>
      )}

      <Favorites
        favorites={favorites}
        removeFavorite={removeFavorite}
        getWeatherData={getWeatherData}
      />

      <button className="toggle-unit" onClick={toggleUnit}>Toggle Celsius/Fahrenheit</button>
    </div>
  );
};

export default App;

