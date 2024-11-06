import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ActivityDisplay from '../Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Models/Displays/ItineraryDisplay';
import HistoricalPlaceDisplay from '../Models/Displays/HistoricalPlaceDisplay';
import MuseumDisplay from '../Models/Displays/MuseumDisplay';

const CarouselSection = ({ items, DisplayComponent, title, propName }) => {
    const [startIndex, setStartIndex] = useState(0);

    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (startIndex + 1 < items.length) {
            setStartIndex((prevIndex) => prevIndex + 1);
        }
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
        return (
            <div className="mb-20">
                <h2 className="text-4xl font-bold text-[#330577] mb-12 pl-4">{title}</h2>
                <p className="text-gray-500 text-center">No {title.toLowerCase()} found.</p>
            </div>
        );
    }

    return (
        <div className="mb-20">
            <h2 className="text-4xl font-bold text-[#330577] mb-12 pl-4">{title}</h2>
            <div className="relative flex items-center">
                {startIndex > 0 && (
                    <button
                        onClick={handlePrevClick}
                        className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 bg-[#330577] text-white p-3 rounded-full hover:bg-[#452a9d] transition z-10"
                    >
                        <FaArrowLeft />
                    </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mx-auto" style={{ width: 'calc(100% - 5px)' }}>
                    {items.slice(startIndex, startIndex + 3).map((item) =>
                        item && item._id ? (
                            <div key={item._id} className="mx-auto" style={{ width: 'calc(100% - 15px)' }}>
                                <DisplayComponent {...{ [propName]: item }} />
                            </div>
                        ) : null
                    )}
                </div>
                {startIndex + 3 < items.length && (
                    <button
                        onClick={handleNextClick}
                        className="absolute right-[-2rem] top-1/2 transform -translate-y-1/2 bg-[#330577] text-white p-3 rounded-full hover:bg-[#452a9d] transition"
                    >
                        <FaArrowRight />
                    </button>
                )}
            </div>
        </div>
    );
};

const ResultsList = ({ activities, itineraries, museums, historicalPlaces }) => {
    return (
        <div className="p-4">
            {/* Activities Section */}
            {activities && activities.length > 0 && (
                <CarouselSection items={activities} DisplayComponent={ActivityDisplay} title="Exciting Upcoming Activities Just for You!" propName="activity" />
            )}

            {/* Itineraries Section */}
            {itineraries && itineraries.length > 0 && (
                <CarouselSection items={itineraries} DisplayComponent={ItineraryDisplay} title="Plan Your Next Adventure with These Itineraries!" propName="itinerary" />
            )}

            {/* Historical Places Section */}
            {historicalPlaces && historicalPlaces.length > 0 && (
                <CarouselSection items={historicalPlaces} DisplayComponent={HistoricalPlaceDisplay} title="Step Back in Time: Historical Places to Visit!" propName="historicalPlace" />
            )}

            {/* Museums Section */}
            {museums && museums.length > 0 && (
                <CarouselSection items={museums} DisplayComponent={MuseumDisplay} title="Discover Wonders: Must-Visit Museums!" propName="museum" />
            )}
        </div>
    );
};

export default ResultsList;