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
        fetchItineraries().then(r => r);
        window.addEventListener('modelModified', fetchItineraries);
        return () => {
            window.removeEventListener('modelModified', fetchItineraries);
        };
    }, []);



    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Itineraries
                    </h2>
                    <div className="flex flex-col gap-6">
                        {!loading ? (
                            itineraries.map((itinerary) => (
                                <MyItineraryDisplay key={itinerary._id} itinerary={itinerary} />
                            ))
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