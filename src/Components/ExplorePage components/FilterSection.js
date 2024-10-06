import React, { useState } from "react";

const FilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    budget: "",
    date: "",
    category: "",
    rating: ""
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
        name="category"
        placeholder="Category"
        value={filters.category}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <input
        type="number"
        name="rating"
        placeholder="Rating"
        value={filters.rating}
        onChange={handleFilterChange}
        className="border p-2 m-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">Filter Activities</button>
    </form>
  );
};

export default FilterSection;