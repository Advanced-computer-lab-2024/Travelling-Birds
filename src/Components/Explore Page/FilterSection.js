import React, { useState } from 'react';

const FilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    budget: '',
    date: '',
    category: '',
    rating: '',
    preferences: '',
    language: '',
    tags: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  return (
    <div className="flex flex-col space-y-4 mb-4">
      <input type="number" name="budget" placeholder="Budget" value={filters.budget} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="date" name="date" placeholder="Date" value={filters.date} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="number" name="rating" placeholder="Rating" value={filters.rating} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="text" name="preferences" placeholder="Preferences" value={filters.preferences} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="text" name="language" placeholder="Language" value={filters.language} onChange={handleInputChange} className="border p-2 rounded" />
      <input type="text" name="tags" placeholder="Tags" value={filters.tags} onChange={handleInputChange} className="border p-2 rounded" />
      <button onClick={handleFilter} className="bg-blue-500 text-white p-2 rounded">Filter</button>
    </div>
  );
};

export default FilterSection;