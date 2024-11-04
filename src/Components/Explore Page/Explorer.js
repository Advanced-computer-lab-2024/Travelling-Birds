import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaStar } from 'react-icons/fa';

const Explorer = ({ onSearch, onFilter, onSort }) => {
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
        <div className="relative w-full bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#330577' }}>{message}</h2>
            <div className="mb-6 flex justify-center space-x-4">
                <button
                    onClick={() => {
                        setActiveSection('activities');
                        setMessage('Do something fun! Search, filter, or sort activities');
                    }}
                    className={`text-white font-semibold px-4 py-2 rounded-full transition ${activeSection === 'activities' ? 'bg-[#330577]' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    Activities
                </button>
                <button
                    onClick={() => {
                        setActiveSection('itineraries');
                        setMessage('Plan your trip! Search, filter, or sort itineraries');
                    }}
                    className={`text-white font-semibold px-4 py-2 rounded-full transition ${activeSection === 'itineraries' ? 'bg-[#330577]' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    Itineraries
                </button>
                <button
                    onClick={() => {
                        setActiveSection('historicalPlaces');
                        setMessage('Explore the past! Search or filter historical places');
                    }}
                    className={`text-white font-semibold px-4 py-2 rounded-full transition ${activeSection === 'historicalPlaces' ? 'bg-[#330577]' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    Historical Places
                </button>
                <button
                    onClick={() => {
                        setActiveSection('museums');
                        setMessage('Learn something new! Search or filter museums');
                    }}
                    className={`text-white font-semibold px-4 py-2 rounded-full transition ${activeSection === 'museums' ? 'bg-[#330577]' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    Museums
                </button>
            </div>

            {/* Search and Filter Sections */}
            <div className="space-y-4">
                {activeSection === 'activities' && (
                    <>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <input
                                type="text"
                                placeholder="Activity Category"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setActivityCategory(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Activity Tag"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setActivityTag(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Search
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Activity Filters</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700">Budget</label>
                                <Slider
                                    min={0}
                                    max={1000}
                                    defaultValue={activityBudget}
                                    onChange={setActivityBudget}
                                    trackStyle={{ backgroundColor: '#330577' }}
                                    handleStyle={{ borderColor: '#330577' }}
                                />
                                <p className="text-sm text-gray-600 mt-1">Selected budget: ${activityBudget}</p>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="date"
                                    placeholder="Date"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setActivityDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Rating</label>
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
                                <p className="text-sm text-gray-600 mt-1">Selected rating: {activityRating} star(s)</p>
                            </div>
                            <button
                                onClick={handleFilter}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Filter
                            </button>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sort Activities</h3>
                            <div className="inline-flex space-x-4">
                                <button
                                    onClick={() => handleSort('price')}
                                    className="bg-[#330577] text-white px-4 py-2 rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
                                >
                                    By Price
                                </button>
                                <button
                                    onClick={() => handleSort('rating')}
                                    className="bg-[#330577] text-white px-4 py-2 rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
                                >
                                    By Rating
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === 'itineraries' && (
                    <>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <input
                                type="text"
                                placeholder="Itinerary Category"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setItineraryCategory(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Itinerary Tag"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setItineraryTag(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Search
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Itinerary Filters</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700">Budget</label>
                                <Slider
                                    min={0}
                                    max={2000}
                                    defaultValue={itineraryBudget}
                                    onChange={setItineraryBudget}
                                    trackStyle={{ backgroundColor: '#330577' }}
                                    handleStyle={{ borderColor: '#330577' }}
                                />
                                <p className="text-sm text-gray-600 mt-1">Selected budget: ${itineraryBudget}</p>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="date"
                                    placeholder="Date"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setItineraryDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Preferences"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setItineraryPreferences(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Language"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setItineraryLanguage(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Filter
                            </button>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sort Itineraries</h3>
                            <div className="inline-flex space-x-4">
                                <button
                                    onClick={() => handleSort('price')}
                                    className="bg-[#330577] text-white px-4 py-2 rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
                                >
                                    By Price
                                </button>
                                <button
                                    onClick={() => handleSort('rating')}
                                    className="bg-[#330577] text-white px-4 py-2 rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
                                >
                                    By Rating
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === 'historicalPlaces' && (
                    <>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <input
                                type="text"
                                placeholder="Historical Place Name"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setHistoricalPlaceName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Historical Place Tag"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Search
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Historical Places Filters</h3>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Tag for Historical Place"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Filter
                            </button>
                        </div>
                    </>
                )}

                {activeSection === 'museums' && (
                    <>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <input
                                type="text"
                                placeholder="Museum Name"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setMuseumName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Museum Tag"
                                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                style={{ borderColor: '#330577' }}
                                onChange={(e) => setMuseumTag(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Search
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Museum Filters</h3>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Tag for Museum"
                                    className="w-full p-2 border bg-white rounded-lg focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#330577' }}
                                    onChange={(e) => setMuseumTag(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="bg-[#330577] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#4a078c] transition focus:outline-none focus:ring-2"
                            >
                                Filter
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

Explorer.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
};

export default Explorer;