import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerms, setSearchTerms] = useState({
    name: '',
    category: '',
    tag: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    onSearch(searchTerms);
  };

  return (
    <div className="flex flex-col space-y-4 mb-4">
      <input
        type="text"
        name="name"
        placeholder="Search by Name"
        value={searchTerms.name}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="category"
        placeholder="Search by Category"
        value={searchTerms.category}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="tag"
        placeholder="Search by Tag"
        value={searchTerms.tag}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;