import React, { useState, useEffect } from 'react';
import SavedActivities from './Events/SavedActivities'; // Import the existing page
import SavedItineraries from './Events/SavedItineraries'; // Import the existing page
import ProductWishlist from './Wishlist/ProductWishlist'; // Import the existing page

const MyInterests = () => {
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
                return <SavedActivities />;
            case 'Itineraries':
                return <SavedItineraries />;
            case 'ProductWishlist':
                return <ProductWishlist />;
            default:
                return <SavedActivities />;
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
                onClick={() => setSelectedPage('ProductWishlist')}
                className={`px-4 py-2 rounded-full ${selectedPage === 'ProductWishlist' ? 'bg-[#330577] text-white' : 'bg-gray-200'}`}
            >
                Product Wishlist
            </button>
        </div>
        <div className="mt-4">
            {renderContent()}
        </div>
    </div>
    );
}

export default MyInterests;