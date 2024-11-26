import React, { useState, useEffect } from 'react';
import ActivityPage from './Activities/ActivitiesPage'; // Import the existing page
import ItinerariesPage from './Itineraries/ItinerariesPage'; // Import the existing page
import PlacesPage from './Places/PlacesPage'; // Import the existing page

const BookingPage = () => {
    // Retrieve the last selected page from localStorage, or default to 'Activities'
    const [selectedPage, setSelectedPage] = useState(() => {
        return localStorage.getItem('lastSelectedPage') || 'Activities';
    });

    useEffect(() => {
        // Store the selected page in localStorage whenever it changes
        localStorage.setItem('lastSelectedPage', selectedPage);
    }, [selectedPage]);

    const renderContent = () => {
        switch (selectedPage) {
            case 'Activities':
                return <ActivityPage />;
            case 'Itineraries':
                return <ItinerariesPage />;
            case 'Places':
                return <PlacesPage />;
            default:
                return <ActivityPage />;
        }
    };

    return (
        <div>
            <div className="flex justify-center space-x-4 my-4">
                <button
                    onClick={() => setSelectedPage('Activities')}
                    className={`px-4 py-2 rounded-full ${selectedPage === 'Activities' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
                >
                    Activities
                </button>
                <button
                    onClick={() => setSelectedPage('Itineraries')}
                    className={`px-4 py-2 rounded-full ${selectedPage === 'Itineraries' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
                >
                    Itineraries
                </button>
                <button
                    onClick={() => setSelectedPage('Places')}
                    className={`px-4 py-2 rounded-full ${selectedPage === 'Places' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
                >
                    Places
                </button>
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default BookingPage;