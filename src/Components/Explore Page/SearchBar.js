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
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">{message}</h2>
            <div className="mb-6 flex justify-center space-x-6">
                <button 
                    onClick={() => {
                        setActiveSection('activities');
                        setMessage('Do something fun! Search for activities');
                    }} 
                    className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Activities
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('itineraries');
                        setMessage('Plan your trip! Search for itineraries');
                    }} 
                    className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'itineraries' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Itineraries
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('historicalPlaces');
                        setMessage('Explore the past! Search for historical places');
                    }} 
                    className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'historicalPlaces' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Historical Places
                </button>
                <button 
                    onClick={() => {
                        setActiveSection('museums');
                        setMessage('Learn something new! Search for museums');
                    }} 
                    className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'museums' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Museums
                </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
                {activeSection === 'activities' && (
                    <div className="flex space-x-4 w-full">
                        <input 
                            type="text" 
                            placeholder="Activity Category" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setActivityCategory(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Activity Tag" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setActivityTag(e.target.value)} 
                        />
                    </div>
                )}
                {activeSection === 'itineraries' && (
                    <div className="flex space-x-4 w-full">
                        <input 
                            type="text" 
                            placeholder="Itinerary Category" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setItineraryCategory(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Itinerary Tag" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setItineraryTag(e.target.value)} 
                        />
                    </div>
                )}
                {activeSection === 'historicalPlaces' && (
                    <div className="flex space-x-4 w-full">
                        <input 
                            type="text" 
                            placeholder="Historical Place Name" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setHistoricalPlaceName(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Historical Place Tag" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setHistoricalPlaceTag(e.target.value)} 
                        />
                    </div>
                )}
                {activeSection === 'museums' && (
                    <div className="flex space-x-4 w-full">
                        <input 
                            type="text" 
                            placeholder="Museum Name" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setMuseumName(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Museum Tag" 
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e) => setMuseumTag(e.target.value)} 
                        />
                    </div>
                )}
                <button 
                    onClick={handleSearch} 
                    className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-full mt-6 transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;