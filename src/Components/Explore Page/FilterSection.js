import React, { useState } from 'react';

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
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            {/* Activity Filters */}
            <input type="number" 
            placeholder="Activity Budget" 
            className="p-2 mb-2 border" 
            onChange={(e) => 
            setActivityBudget(e.target.value)} />
            <input type="date" 
            placeholder="Activity Date" 
            className="p-2 mb-2 border" 
            onChange={(e) => 
            setActivityDate(e.target.value)} />
            <input type="text" 
            placeholder="Activity Category" 
            className="p-2 mb-2 border" 
            onChange={(e) => 
            setActivityCategory(e.target.value)} />
            <input type="number" 
            placeholder="Activity Rating" 
            className="p-2 mb-2 border" 
            onChange={(e) => 
            setActivityRating(e.target.value)} />

            {/* Itinerary Filters */}
            <input type="number" 
            placeholder="Itinerary Budget" 
            className="p-2 mb-2 border" 
            onChange={(e) => 
            setItineraryBudget(e.target.value)} />
            <input type="date"
            placeholder="Itinerary Date" 
            className="p-2 mb-2 border" 
            onChange={(e) => setItineraryDate(e.target.value)} />
            <input type="text"
             placeholder="Itinerary Preferences" 
             className="p-2 mb-2 border" 
             onChange={(e) => setItineraryPreferences(e.target.value)} />
            <input type="text" 
            placeholder="Itinerary Language" 
            className="p-2 mb-2 border" 
            onChange={(e) => setItineraryLanguage(e.target.value)} />

            {/* Historical Place and Museum Filters */}
            <input type="text" 
            placeholder="Historical Place Tag" 
            className="p-2 mb-2 border" 
            onChange={(e) => setHistoricalPlaceTag(e.target.value)} />
            <input type="text" 
            placeholder="Museum Tag" 
            className="p-2 mb-2 border" 
            onChange={(e) => setMuseumTag(e.target.value)} />

            <button onClick={handleFilter} className="bg-green-500 text-white px-4 py-2 rounded-lg">Filter</button>
        </div>
    );
};

export default FilterSection;