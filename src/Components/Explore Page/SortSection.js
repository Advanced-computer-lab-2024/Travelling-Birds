import React from 'react';

const SortSection = ({ onSort }) => {
    const handleSort = (type, criterion) => {
        onSort({ type, criterion });
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold text-indigo-500 mb-6">View Things as you like!</h2>
            <div className="inline-flex space-x-2">
                <button onClick={() => handleSort('activity', 'price')} 
                className="bg-blue-500 text-white px-2 py-1 rounded-lg">
                    Sort Activities by Price</button>
                <button onClick={() => handleSort('activity', 'rating')} 
                className="bg-blue-500 text-white px-2 py-1 rounded-lg">
                    Sort Activities by Rating</button>
                <button onClick={() => handleSort('itinerary', 'price')} 
                className="bg-green-500 text-white px-2 py-1 rounded-lg">
                    Sort Itineraries by Price</button>
                <button onClick={() => handleSort('itinerary', 'rating')} 
                className="bg-green-500 text-white px-2 py-1 rounded-lg">
                    Sort Itineraries by Rating</button>
            </div>
        </div>
    );
};

export default SortSection;
