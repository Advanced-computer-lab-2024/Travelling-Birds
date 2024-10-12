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
    const [activeSection, setActiveSection] = useState('');
    const [message, setMessage] = useState('Where to?');

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
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">{message}</h2>
            <div className="mb-4 flex justify-center space-x-10">
                <button 
                    onClick={() => {
                        setActiveSection('activities');
                        setMessage('Do something fun! Search for activities');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Activities
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('itineraries');
                        setMessage('Plan your trip! Search for itineraries');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Itineraries
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('historicalPlaces');
                        setMessage('Explore the past! Search for historical places');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Historical Places
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('museums');
                        setMessage('Learn something new! Search for museums');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Museums
                </button>
            </div>
            <div className="flex flex-col items-center">
                {activeSection === 'activities' && (
                    <div className="mb-2 space-x-4">
                        <input type="text" 
                        placeholder="Activity Category" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setActivityCategory(e.target.value)} />
                        <input type="text" 
                        placeholder="Activity Tag" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setActivityTag(e.target.value)} />
                    </div>
                )}
                {activeSection === 'itineraries' && (
                    <div className="mb-2 space-x-4">
                        <input type="text" 
                        placeholder="Itinerary Category" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setItineraryCategory(e.target.value)} />
                        <input type="text" 
                        placeholder="Itinerary Tag" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setItineraryTag(e.target.value)} />
                    </div>
                )}
                {activeSection === 'historicalPlaces' && (
                    <div className="mb-2 space-x-4">
                        <input type="text" 
                        placeholder="Historical Place Name" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setHistoricalPlaceName(e.target.value)} />
                        <input type="text" 
                        placeholder="Historical Place Tag" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setHistoricalPlaceTag(e.target.value)} />
                    </div>
                )}
                {activeSection === 'museums' && (
                    <div className="mb-2 space-x-4">
                        <input type="text" 
                        placeholder="Museum Name" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setMuseumName(e.target.value)} />
                        <input type="text"
                        placeholder="Museum Tag" 
                        className="p-2 mb-2 border" 
                        onChange={(e) => 
                        setMuseumTag(e.target.value)} />
                    </div>
                )}
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Search</button>
            </div>
        </div>
    );
};

export default SearchBar;
