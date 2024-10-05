import React from "react";

const SearchBar = ({ searchParams, setSearchParams, onSearch }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        name="term"
        value={searchParams.term}
        onChange={handleChange}
        placeholder="Search Museums or Historical Places"
        className="border p-2 m-2 w-full"
      />
      <input
        type="text"
        name="category"
        value={searchParams.category}
        onChange={handleChange}
        placeholder="Search Activities and Itineraries by Category"
        className="border p-2 m-2 w-full"
      />
      <input
        type="text"
        name="tag"
        value={searchParams.tag}
        onChange={handleChange}
        placeholder="Search Activities and Itineraries by Tag"
        className="border p-2 m-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">Search</button>
    </form>
  );
};

export default SearchBar;