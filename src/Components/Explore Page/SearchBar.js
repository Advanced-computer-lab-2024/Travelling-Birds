import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch, searchResults, onSelectItem, isModalOpen }) => {
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
        const searchParams = { activeSection };
        switch (activeSection) {
            case 'activities':
                searchParams.activityCategory = activityCategory;
                searchParams.activityTag = activityTag;
                break;
            case 'itineraries':
                searchParams.itineraryCategory = itineraryCategory;
                searchParams.itineraryTag = itineraryTag;
                break;
            case 'historicalPlaces':
                searchParams.historicalPlaceName = historicalPlaceName;
                searchParams.historicalPlaceTag = historicalPlaceTag;
                break;
            case 'museums':
                searchParams.museumName = museumName;
                searchParams.museumTag = museumTag;
                break;
            default:
                break;
        }
        onSearch(searchParams);
    };

    return (
        <div className="relative w-full">
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

                {/* Search Results Dropdown */}
                {!isModalOpen && searchResults && (
                    <div className="absolute left-0 right-0 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto mt-2 z-20">
                        <ul>
                            {searchResults.activities.map((activity) => (
                                <li
                                    key={activity._id}
                                    onClick={() => onSelectItem({ type: 'activity', data: activity })}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-100"
                                >
                                    {activity.category} - {activity.date}
                                </li>
                            ))}
                            {searchResults.itineraries.map((itinerary) => (
                                <li
                                    key={itinerary._id}
                                    onClick={() => onSelectItem({ type: 'itinerary', data: itinerary })}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-100"
                                >
                                    Itinerary - Language: {itinerary.language}
                                </li>
                            ))}
                            {searchResults.historicalPlaces.map((place) => (
                                <li
                                    key={place._id}
                                    onClick={() => onSelectItem({ type: 'historicalPlace', data: place })}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-100"
                                >
                                    {place.name} - {place.location}
                                </li>
                            ))}
                            {searchResults.museums.map((museum) => (
                                <li
                                    key={museum._id}
                                    onClick={() => onSelectItem({ type: 'museum', data: museum })}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-100"
                                >
                                    {museum.name} - {museum.location}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Add spacing below the SearchBar when the dropdown is visible */}
            {!isModalOpen && searchResults && (
                <div className="mt-16"></div>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchResults: PropTypes.shape({
        activities: PropTypes.array,
        itineraries: PropTypes.array,
        historicalPlaces: PropTypes.array,
        museums: PropTypes.array
    }),
    onSelectItem: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired
};

export default SearchBar;