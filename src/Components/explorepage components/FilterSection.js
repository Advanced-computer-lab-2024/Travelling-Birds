import React, { useState } from 'react';

const FilterSection = ({ onFilter }) => {
  const [type, setType] = useState('activity'); // activity, itinerary, historicalPlace, museum
  const [filters, setFilters] = useState({});

  const handleFilter = () => {
    onFilter({ type, ...filters });
  };

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="activity">Activity</option>
        <option value="itinerary">Itinerary</option>
        <option value="historicalPlace">Historical Place</option>
        <option value="museum">Museum</option>
      </select>
      
      {type === 'activity' && (
        <div>
          <input
            type="number"
            placeholder="Max Budget"
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          />
          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Ratings"
            onChange={(e) => setFilters({ ...filters, ratings: e.target.value })}
          />
        </div>
      )}

      {type === 'itinerary' && (
        <div>
          <input
            type="number"
            placeholder="Max Budget"
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          />
          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Preferences (historic areas, beaches...)"
            onChange={(e) => setFilters({ ...filters, preferences: e.target.value })}
          />
          <input
            type="text"
            placeholder="Language"
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          />
        </div>
      )}

      {type === 'historicalPlace' && (
        <div>
          <input
            type="text"
            placeholder="Tag"
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          />
        </div>
      )}

      {type === 'museum' && (
        <div>
          <input
            type="text"
            placeholder="Tag"
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          />
        </div>
      )}

      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default FilterSection;