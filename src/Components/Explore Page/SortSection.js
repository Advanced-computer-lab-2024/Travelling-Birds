import React from 'react';

const SortSection = ({ onSort }) => {
    const handleSort = (type, criterion) => {
        onSort({ type, criterion });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-500 mb-6">View Things as You Like!</h2>
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Sort Activities</h3>
                    <div className="inline-flex space-x-4">
                        <button 
                            onClick={() => handleSort('activity', 'price')} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            By Price
                        </button>
                        <button 
                            onClick={() => handleSort('activity', 'rating')} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            By Rating
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Sort Itineraries</h3>
                    <div className="inline-flex space-x-4">
                        <button 
                            onClick={() => handleSort('itinerary', 'price')} 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            By Price
                        </button>
                        <button 
                            onClick={() => handleSort('itinerary', 'rating')} 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            By Rating
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortSection;