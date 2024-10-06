import React, { useState } from "react";

const TagFilterSection = ({ onFilter }) => {
  const [tags, setTags] = useState("");

  const handleTagChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(tags.split(",").map(tag => tag.trim())); // Split and trim tags
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter tags (comma separated)"
        value={tags}
        onChange={handleTagChange}
        className="border p-2 m-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">Filter Places by Tags</button>
    </form>
  );
};

export default TagFilterSection;