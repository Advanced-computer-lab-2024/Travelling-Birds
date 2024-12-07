import React, { useEffect, useState } from "react";
import MyItineraryDisplay from "../../../Components/MyBookings/MyItineraryDisplay";

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id');

    useEffect(() => {
        const fetchItineraries = async () => {
            if (userRole === 'tourist') {
                const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`;
                try {
                    const res = await fetch(apiUrl);
                    const itineraries = await res.json();
                    setItineraries(itineraries);
                } catch (err) {
                    console.log('Error fetching itineraries', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchItineraries();
        window.addEventListener('modelModified', fetchItineraries);
        return () => {
            window.removeEventListener('modelModified', fetchItineraries);
        };
    }, [userId, userRole]);

    // Split itineraries into upcoming and past
    const currentDate = new Date();
    const upcomingItineraries = itineraries.filter(itinerary =>
        itinerary.availableDates?.[0] && new Date(itinerary.availableDates[0]) > currentDate
    );
    const pastItineraries = itineraries.filter(itinerary =>
        itinerary.availableDates?.[0] && new Date(itinerary.availableDates[0]) <= currentDate
    );

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Itineraries
                    </h2>

                    {/* Upcoming Itineraries Section */}
                    <h3 className="text-2xl font-bold text-[#330577] mb-4">Upcoming Itineraries</h3>
                    <div className="flex flex-col gap-6">
                        {!loading ? (
                            upcomingItineraries.length > 0 ? (
                                upcomingItineraries.map(itinerary => (
                                    <MyItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                                ))
                            ) : (
                                <p className="text-[#330577]">No upcoming itineraries.</p>
                            )
                        ) : (
                            <p className="text-[#330577]">Loading itineraries...</p>
                        )}
                    </div>

                    {/* Past Itineraries Section */}
                    <h3 className="text-2xl font-bold text-[#330577] mt-8 mb-4">Past Itineraries</h3>
                    <div className="flex flex-col gap-6">
                        {!loading ? (
                            pastItineraries.length > 0 ? (
                                pastItineraries.map(itinerary => (
                                    <MyItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                                ))
                            ) : (
                                <p className="text-[#330577]">No past itineraries.</p>
                            )
                        ) : (
                            <p className="text-[#330577]">Loading itineraries...</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ItinerariesPage;