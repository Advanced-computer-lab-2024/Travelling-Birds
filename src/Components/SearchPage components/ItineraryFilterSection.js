import React, { useState } from "react";

const ItineraryFilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    budget: "",
    date: "",
    preferences: "",
    language: ""
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="number"
        name="budget"
        placeholder="Budget"
        value={filters.budget}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <input
        type="text"
        name="preferences"
        placeholder="Preferences"
        value={filters.preferences}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <input
        type="text"
        name="language"
        placeholder="Language"
        value={filters.language}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">Filter Itineraries</button>
    </form>
  );
};

export default ItineraryFilterSection;