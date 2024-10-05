import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('activity'); // activity, itinerary, historicalPlace, museum

  const handleSearch = () => {
    onSearch({ type, searchTerm });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, tag, category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="activity">Activity</option>
        <option value="itinerary">Itinerary</option>
        <option value="historicalPlace">Historical Place</option>
        <option value="museum">Museum</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;