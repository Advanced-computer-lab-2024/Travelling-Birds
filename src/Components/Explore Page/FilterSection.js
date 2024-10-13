import React, { useState } from 'react';
import PropTypes from "prop-types";

const FilterSection = ({ onFilter }) => {
    const [activityBudget, setActivityBudget] = useState('');
    const [activityDate, setActivityDate] = useState('');
    const [activityCategory, setActivityCategory] = useState('');
    const [activityRating, setActivityRating] = useState('');
    const [itineraryBudget, setItineraryBudget] = useState('');
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
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="number" 
                            placeholder="Budget" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setActivityBudget(e.target.value)} 
                        />
                        <input 
                            type="date" 
                            placeholder="Date" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setActivityDate(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Category" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setActivityCategory(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Rating" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setActivityRating(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Itinerary Filters */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Itinerary Filters</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="number" 
                            placeholder="Budget" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryBudget(e.target.value)} 
                        />
                        <input 
                            type="date" 
                            placeholder="Date" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryDate(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Preferences" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryPreferences(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Language" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setItineraryLanguage(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Historical Place and Museum Filters */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tags</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Historical Place Tag" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                            onChange={(e) => setHistoricalPlaceTag(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Museum Tag" 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" 
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