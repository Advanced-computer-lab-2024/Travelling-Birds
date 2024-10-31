import React, { useState } from 'react';
import PropTypes from "prop-types";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaStar } from 'react-icons/fa';

const FilterSection = ({ onFilter }) => {
    const [activityBudget, setActivityBudget] = useState(1000); // Default single value: 500
    const [activityDate, setActivityDate] = useState('');
    const [activityCategory, setActivityCategory] = useState('');
    const [activityRating, setActivityRating] = useState(0); // Default star rating: 0 stars
    const [itineraryBudget, setItineraryBudget] = useState(2000); // Default single value: 1000
    const [itineraryDate, setItineraryDate] = useState('');
    const [itineraryPreferences, setItineraryPreferences] = useState('');
    const [itineraryLanguage, setItineraryLanguage] = useState('');
    const [historicalPlaceTag, setHistoricalPlaceTag] = useState('');
    const [museumTag, setMuseumTag] = useState('');

    const handleFilter = () => {
        onFilter({
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Refine Your Search</h2>
            
            <div className="space-y-4">
                {/* Activity Filters */}
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
                        <input 
                            type="text" 
                            placeholder="Category" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setActivityCategory(e.target.value)} 
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

                {/* Itinerary Filters */}
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
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryDate(e.target.value)} 
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Preferences" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryPreferences(e.target.value)} 
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Language" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryLanguage(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Historical Place and Museum Filters */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tags</h3>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Historical Place Tag" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setHistoricalPlaceTag(e.target.value)} 
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Museum Tag" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setMuseumTag(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleFilter} 
                className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg mt-6 transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                Filter
            </button>
        </div>
    );
};

FilterSection.propTypes = {
    onFilter: PropTypes.func.isRequired,
};

export default FilterSection;