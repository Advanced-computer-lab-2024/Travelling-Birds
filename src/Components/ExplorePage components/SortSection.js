import React, { useState } from "react";

const SortSection = ({ activities, itineraries }) => {
  const [sortOption, setSortOption] = useState("price");

  const sortResults = (e) => {
    e.preventDefault();

    const sortedActivities = [...activities].sort((a, b) => {
      return sortOption === "price" ? a.price - b.price : b.rating - a.rating;
    });

    const sortedItineraries = [...itineraries].sort((a, b) => {
      return sortOption === "price" ? a.price - b.price : b.rating - a.rating;
    });

    console.log("Sorted Activities:", sortedActivities);
    console.log("Sorted Itineraries:", sortedItineraries);
  };

  return (
    <form onSubmit={sortResults} className="mb-4">
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border p-2 m-2"
      >
        <option value="price">Sort by Price</option>
        <option value="rating">Sort by Rating</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">Sort</button>
    </form>
  );
};

export default SortSection;