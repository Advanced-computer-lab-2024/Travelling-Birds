import React from 'react';

const ResultsList = ({ results }) => {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="border p-4 rounded bg-gray-100">
          {result.date && <p><strong>Date:</strong> {result.date}</p>}
          {result.time && <p><strong>Time:</strong> {result.time}</p>}
          {result.location && <p><strong>Location:</strong> {result.location.lat}, {result.location.lng}</p>}
          {result.price && <p><strong>Price:</strong> ${result.price}</p>}
          {result.category && <p><strong>Category:</strong> {result.category}</p>}
          {result.rating && <p><strong>Rating:</strong> {result.rating}</p>}
          {result.tags && <p><strong>Tags:</strong> {result.tags.join(', ')}</p>}
          {result.description && <p><strong>Description:</strong> {result.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default ResultsList;