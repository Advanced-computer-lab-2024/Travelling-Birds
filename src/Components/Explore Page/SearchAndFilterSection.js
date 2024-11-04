import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaStar } from 'react-icons/fa';

const SearchAndFilterSection = ({ onSearch, onFilter, onSort }) => {
    const [activityCategory, setActivityCategory] = useState('');
    const [activityTag, setActivityTag] = useState('');
    const [activityBudget, setActivityBudget] = useState(1000);
    const [activityDate, setActivityDate] = useState('');
    const [activityRating, setActivityRating] = useState(0);

    const [itineraryCategory, setItineraryCategory] = useState('');
    const [itineraryTag, setItineraryTag] = useState('');
    const [itineraryBudget, setItineraryBudget] = useState(2000);
    const [itineraryDate, setItineraryDate] = useState('');
    const [itineraryPreferences, setItineraryPreferences] = useState('');
    const [itineraryLanguage, setItineraryLanguage] = useState('');

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

    const handleFilter = () => {
        onFilter({
            activeSection,
            activityBudget,
            activityDate,
            activityCategory,
            activityRating,
            itineraryBudget,
            itineraryDate,
            itineraryPreferences,
            itineraryLanguage,
            historicalPlaceTag,
            museumTag,
        });
    };

    const handleSort = (criterion) => {
        if (activeSection === 'activities' || activeSection === 'itineraries') {
            onSort({ type: activeSection, criterion });
        }
    };

    return (
        <div className="relative w-full">
            <div className="p-6 bg-white rounded-lg shadow-md w-full">
                <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">{message}</h2>
                <div className="mb-6 flex justify-center space-x-6">
                    <button
                        onClick={() => {
                            setActiveSection('activities');
                            setMessage('Do something fun! Search, filter, and sort activities');
                        }}
                        className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Activities
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection('itineraries');
                            setMessage('Plan your trip! Search, filter, and sort itineraries');
                        }}
                        className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'itineraries' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        Itineraries
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection('historicalPlaces');
                            setMessage('Explore the past! Search and filter historical places');
                        }}
                        className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'historicalPlaces' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                    >
                        Historical Places
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection('museums');
                            setMessage('Learn something new! Search and filter museums');
                        }}
                        className={`text-gray-700 font-semibold px-4 py-2 rounded-full ${activeSection === 'museums' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                    >
                        Museums
                    </button>
                </div>

                {/* Search and Filter Sections */}
                <div className="space-y-4">
                    {activeSection === 'activities' && (
                        <>
                            <div className="flex space-x-4 w-full mb-4">
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
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Activity Filters</h3>
                                <div className="mb-4">
                                    <label className="block text-gray-600">Budget</label>
                                    <Slider
                                        min={0}
                                        max={1000}
                                        defaultValue={activityBudget}
                                        onChange={setActivityBudget}
                                        trackStyle={{ backgroundColor: '#4A90E2' }}
                                        handleStyle={{ borderColor: '#4A90E2' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Selected budget: ${activityBudget}</p>
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="date"
                                        placeholder="Date"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        onChange={(e) => setActivityDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600">Rating</label>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={24}
                                                className={`cursor-pointer ${activityRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                                onClick={() => setActivityRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Selected rating: {activityRating} star(s)</p>
                                </div>
                            </div>
                            {/* Sort Options for Activities */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Sort Activities</h3>
                                <div className="inline-flex space-x-4">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        By Price
                                    </button>
                                    <button
                                        onClick={() => handleSort('rating')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        By Rating
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'itineraries' && (
                        <>
                            <div className="flex space-x-4 w-full mb-4">
                                <input
                                    type="text"
                                    placeholder="Itinerary Category"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    onChange={(e) => setItineraryCategory(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Itinerary Tag"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    onChange={(e) => setItineraryTag(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Itinerary Filters</h3>
                                <div className="mb-4">
                                    <label className="block text-gray-600">Budget</label>
                                    <Slider
                                        min={0}
                                        max={2000}
                                        defaultValue={itineraryBudget}
                                        onChange={setItineraryBudget}
                                        trackStyle={{ backgroundColor: '#34D399' }}
                                        handleStyle={{ borderColor: '#34D399' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Selected budget: ${itineraryBudget}</p>
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="date"
                                        placeholder="Date"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        onChange={(e) => setItineraryDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Preferences"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        onChange={(e) => setItineraryPreferences(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Language"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        onChange={(e) => setItineraryLanguage(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Sort Options for Itineraries */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Sort Itineraries</h3>
                                <div className="inline-flex space-x-4">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        By Price
                                    </button>
                                    <button
                                        onClick={() => handleSort('rating')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        By Rating
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'historicalPlaces' && (
                        <>
                            <div className="flex space-x-4 w-full mb-4">
                                <input
                                    type="text"
                                    placeholder="Historical Place Name"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onChange={(e) => setHistoricalPlaceName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Historical Place Tag"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Historical Places Filters</h3>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tag for Historical Place"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'museums' && (
                        <>
                            <div className="flex space-x-4 w-full mb-4">
                                <input
                                    type="text"
                                    placeholder="Museum Name"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setMuseumName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Museum Tag"
                                    className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setMuseumTag(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Museum Filters</h3>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tag for Museum"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        onChange={(e) => setMuseumTag(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-full transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleFilter}
                        className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

SearchAndFilterSection.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
};

export default SearchAndFilterSection;