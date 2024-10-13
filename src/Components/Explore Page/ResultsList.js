import ActivityDisplay from '../Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Models/Displays/ItineraryDisplay';
import HistoricalPlaceDisplay from '../Models/Displays/HistoricalPlaceDisplay';
import MuseumDisplay from '../Models/Displays/MuseumDisplay';

const ResultsList = ({ activities, itineraries, museums, historicalPlaces }) => {
    return (
        <div className="p-4">
            
            
            {/* Activities Section */}
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center"> Upcoming Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {activities && activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityDisplay key={activity._id} activity={activity} />
                    ))
                ) : (
                    <p>No activities found.</p>
                )}
            </div>
            
            {/* Itineraries Section */}
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Upcoming Itineraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {itineraries && itineraries.length > 0 ? (
                    itineraries.map((itinerary) => (
                        <ItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                    ))
                ) : (
                    <p>No itineraries found.</p>
                )}
            </div>
            
            {/* Museums Section */}
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Museums</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {museums && museums.length > 0 ? (
                    museums.map((museum) => (
                        <MuseumDisplay key={museum._id} museum={museum} />
                    ))
                ) : (
                    <p>No museums found.</p>
                )}
            </div>
            
            {/* Historical Places Section */}
            
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Historical Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {historicalPlaces && historicalPlaces.length > 0 ? (
                    historicalPlaces.map((place) => (
                        <HistoricalPlaceDisplay key={place._id} historicalPlace={place} />
                    ))
                ) : (
                    <p>No historical places found.</p>
                )}
            </div>
        </div>
    );
};

export default ResultsList;