import ActivityDisplay from '../Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Models/Displays/ItineraryDisplay';

const ResultsList = ({ activities, itineraries, museums, historicalPlaces }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            
            {/* Activities Section */}
            <div className="mb-6">
                <h3 className="text-md font-semibold">Upcoming Activities</h3>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityDisplay key={activity._id} activity={activity} />
                    ))
                ) : (
                    <p>No activities found.</p>
                )}
            </div>
            
            {/* Itineraries Section */}
            <div className="mb-6">
                <h3 className="text-md font-semibold">Upcoming Itineraries</h3>
                {itineraries.length > 0 ? (
                    itineraries.map((itinerary) => (
                        <ItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                    ))
                ) : (
                    <p>No itineraries found.</p>
                )}
            </div>
            
            {/* Museums Section */}
            <div className="mb-6">
                <h3 className="text-md font-semibold">Museums</h3>
                {museums.length > 0 ? (
                    museums.map((museum) => (
                        <div key={museum._id} className="museum-item">
                            <p className="text-lg">{museum.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No museums found.</p>
                )}
            </div>
            
            {/* Historical Places Section */}
            <div>
                <h3 className="text-md font-semibold">Historical Places</h3>
                {historicalPlaces.length > 0 ? (
                    historicalPlaces.map((place) => (
                        <div key={place._id} className="historical-place-item">
                            <p className="text-lg">{place.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No historical places found.</p>
                )}
            </div>
        </div>
    );
};

export default ResultsList;