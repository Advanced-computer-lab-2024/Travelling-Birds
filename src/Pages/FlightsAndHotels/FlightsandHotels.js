import React, { useState, useEffect } from 'react';
import FlightSearchPage from './Flights/FlightSearchPage'; // Import the flight search page
import HotelSearchPage from './Hotels/HotelSearchPage'; // Import the hotel search page

const FlightsandHotels = () => {
    // Retrieve the last selected page from localStorage, or default to 'Flights'
    const [selectedPage, setSelectedPage] = useState(() => {
        return localStorage.getItem('lastSelectedPage') || 'Flights';
    });

    useEffect(() => {
        // Store the selected page in localStorage whenever it changes
        localStorage.setItem('lastSelectedPage', selectedPage);
    }, [selectedPage]);

    const renderContent = () => {
        switch (selectedPage) {
            case 'Flights':
                return <FlightSearchPage />;
            case 'Hotels':
                return <HotelSearchPage />;
            default:
                return <FlightSearchPage />;
        }
    };

    return (
        <div>
            <div className="flex justify-center space-x-4 my-4">
                <button
                    onClick={() => setSelectedPage('Flights')}
                    className={`px-4 py-2 rounded-full ${selectedPage === 'Flights' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
                >
                    Flights
                </button>
                <button
                    onClick={() => setSelectedPage('Hotels')}
                    className={`px-4 py-2 rounded-full ${selectedPage === 'Hotels' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
                >
                    Hotels
                </button>
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default FlightsandHotels;