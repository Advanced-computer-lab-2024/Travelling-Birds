import React, { useEffect, useState } from "react";
import FilterSection from "../Components/ExplorePage components/FilterSection";
import ItineraryFilterSection from "../Components/ExplorePage components/ItineraryFilterSection";
import ResultsList from "../Components/ExplorePage components/ResultsList";
import SearchBar from "../Components/ExplorePage components/SearchBar";
import SortSection from "../Components/ExplorePage components/SortSection";
import TagFilterSection from "../Components/ExplorePage components/TagFilterSection";

const SearchPage = () => {
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchParams, setSearchParams] = useState({
    term: "",
    category: "",
    tag: "",
  });

  // Function to handle fetching filtered activities
  const handleFilterActivities = async (filters) => {
    try {
      const response = await fetch("/api/activities/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      setFilteredActivities(data);
    } catch (error) {
      console.error("Error fetching filtered activities:", error);
    }
  };

  // Function to handle fetching filtered itineraries
  const handleFilterItineraries = async (filters) => {
    try {
      const response = await fetch("/api/itineraries/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      setFilteredItineraries(data);
    } catch (error) {
      console.error("Error fetching filtered itineraries:", error);
    }
  };

  // Function to handle filtering places by tags
  const handleFilterPlaces = async (tags) => {
    try {
      const response = await fetch("/api/places/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      });
      const data = await response.json();
      setFilteredPlaces(data);
    } catch (error) {
      console.error("Error fetching filtered places:", error);
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    const { term, category, tag } = searchParams;
    try {
      const response = await fetch(`/api/search?term=${term}&category=${category}&tag=${tag}`);
      const data = await response.json();
      setFilteredActivities(data.activities);
      setFilteredItineraries(data.itineraries);
      setFilteredPlaces(data.places);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Explore Page</h1>
      <SearchBar 
        searchParams={searchParams} 
        setSearchParams={setSearchParams} 
        onSearch={handleSearch} 
      />
      <FilterSection onFilter={handleFilterActivities} />
      <ItineraryFilterSection onFilter={handleFilterItineraries} />
      <TagFilterSection onFilter={handleFilterPlaces} />
      <SortSection activities={filteredActivities} itineraries={filteredItineraries} />
      <ResultsList activities={filteredActivities} itineraries={filteredItineraries} places={filteredPlaces} />
    </div>
  );
};

export default SearchPage;