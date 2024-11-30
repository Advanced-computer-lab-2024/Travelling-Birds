import React, { useEffect, useState } from 'react';
import MyItineraryDisplay from "../../../Components/MyBookings/MyItineraryDisplay";

const SavedItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id');

    //only fetch saved itineraries if the user is a tourist
    useEffect(() => {
        const fetchSavedItineraries = async () => {
            if (userRole === 'tourist') {
                const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/saved-itineraries/${userId}`;
                setLoading(true);
                try {
                    const res = await fetch(apiUrl);
                    if (!res.ok) {
                        throw new Error('Failed to fetch saved itineraries');
                    }
                    const savedItineraries = await res.json();
                    setItineraries(savedItineraries);
                } catch (err) {
                    console.log('Error fetching saved itineraries', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSavedItineraries();

        window.addEventListener('modelModified', fetchSavedItineraries);

        return () => {
            window.removeEventListener('modelModified', fetchSavedItineraries);
        };
    }
    , [userRole, userId]);

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Saved Itineraries
                    </h2>
                    <div className="space-y-6">
                        {!loading ? (
                            itineraries.map((itinerary) => (
                                <MyItineraryDisplay key={itinerary._id} itinerary = {itinerary} />
                            ))
                        ) : (
                            <p className="text-[#330577]">Loading itineraries...</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );  
}

export default SavedItineraries;