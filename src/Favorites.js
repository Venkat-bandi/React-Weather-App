/*import React, { useState } from 'react';
import './Search.css';
const Favorites = ({ favorites, addFavorite, removeFavorite }) => {
  const [city, setCity] = useState('');

  const handleAdd = () => {
    if (city.trim()) {
      addFavorite(city);
      setCity(''); // Clear input after adding
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favorite Cities</h2>
      <div className="favorite-input">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Add a city to favorites"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul className="favorites-list">
        {favorites.map((fav, index) => (
          <li key={fav.id}>
            {fav.name}
            <button onClick={() => removeFavorite(fav.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;*/

import React from 'react';
import './Favorites.css';

const Favorites = ({ favorites, removeFavorite, getWeatherData }) => {
  return (
    <div className="favorites-container">
      <h2>Favorite Cities</h2>
      {favorites.length > 0 ? (
        favorites.map((city) => (
          <div key={city.id} className="favorite-item">
            <span>{city.name}</span>
            <button onClick={() => removeFavorite(city.name)}>Remove</button>
            <button onClick={() => getWeatherData(city.name)}>Display Weather</button>
          </div>
        ))
      ) : (
        <p>No favorite cities yet.</p>
      )}
    </div>
  );
};

export default Favorites;
