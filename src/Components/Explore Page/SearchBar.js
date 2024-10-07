import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [activityCategory, setActivityCategory] = useState('');
    const [activityTag, setActivityTag] = useState('');
    const [itineraryCategory, setItineraryCategory] = useState('');
    const [itineraryTag, setItineraryTag] = useState('');
    const [historicalPlaceName, setHistoricalPlaceName] = useState('');
    const [historicalPlaceTag, setHistoricalPlaceTag] = useState('');
    const [museumName, setMuseumName] = useState('');
    const [museumTag, setMuseumTag] = useState('');

    const handleSearch = () => {
        onSearch({
            activityCategory,
            activityTag,
            itineraryCategory,
            itineraryTag,
            historicalPlaceName,
            historicalPlaceTag,
            museumName,
            museumTag,
        });
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Search</h2>
            <div className="mb-2">
                <input type="text" placeholder="Activity Category" className="p-2 mb-2 border" onChange={(e) => setActivityCategory(e.target.value)} />
                <input type="text" placeholder="Activity Tag" className="p-2 mb-2 border" onChange={(e) => setActivityTag(e.target.value)} />
            </div>
            <div className="mb-2">
                <input type="text" placeholder="Itinerary Category" className="p-2 mb-2 border" onChange={(e) => setItineraryCategory(e.target.value)} />
                <input type="text" placeholder="Itinerary Tag" className="p-2 mb-2 border" onChange={(e) => setItineraryTag(e.target.value)} />
            </div>
            <div className="mb-2">
                <input type="text" placeholder="Historical Place Name" className="p-2 mb-2 border" onChange={(e) => setHistoricalPlaceName(e.target.value)} />
                <input type="text" placeholder="Historical Place Tag" className="p-2 mb-2 border" onChange={(e) => setHistoricalPlaceTag(e.target.value)} />
            </div>
            <div className="mb-2">
                <input type="text" placeholder="Museum Name" className="p-2 mb-2 border" onChange={(e) => setMuseumName(e.target.value)} />
                <input type="text" placeholder="Museum Tag" className="p-2 mb-2 border" onChange={(e) => setMuseumTag(e.target.value)} />
            </div>
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
        </div>
    );
};

export default SearchBar;