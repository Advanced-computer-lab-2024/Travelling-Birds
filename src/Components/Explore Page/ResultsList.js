import React from 'react';
import ActivityDisplay from '../Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Models/Displays/ItineraryDisplay';

const ResultsList = ({ activities, itineraries }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <div className="mb-6">
                <h3 className="text-md font-semibold">Upcoming Activities</h3>
                {activities.map((activity) => (
                    <ActivityDisplay key={activity._id} activity={activity} />
                ))}
            </div>
            <div>
                <h3 className="text-md font-semibold">Upcoming Itineraries</h3>
                {itineraries.map((itinerary) => (
                    <ItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                ))}
            </div>
        </div>
    );
};

export default ResultsList;