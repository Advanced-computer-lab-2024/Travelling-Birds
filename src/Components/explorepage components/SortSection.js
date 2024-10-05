import React, { useState } from 'react';

const SortSection = ({ onSort }) => {
  const [type, setType] = useState('activity'); // activity or itinerary
  const [sortBy, setSortBy] = useState('price'); // price or ratings

  const handleSort = () => {
    onSort({ type, sortBy });
  };

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="activity">Activity</option>
        <option value="itinerary">Itinerary</option>
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="price">Price</option>
        <option value="ratings">Ratings</option>
      </select>
      <button onClick={handleSort}>Sort</button>
    </div>
  );
};

export default SortSection;