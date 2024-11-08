import React from 'react';
import './Search.css';

const Search = ({ city, setCity, getWeatherData }) => {
  const handleSearch = () => {
    if (city.trim() !== '') {
      getWeatherData(city);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
