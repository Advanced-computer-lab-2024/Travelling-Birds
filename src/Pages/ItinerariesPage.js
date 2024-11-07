import React, { useEffect, useState } from "react";
import MyItineraryDisplay from "../Components/MyCreations/MyItineraryDisplay";
import { ItineraryDisplay } from "../Components/Models/Displays";
import { useNavigate } from "react-router-dom";

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItineraries = async () => {
            const apiUrl = `${process.env.REACT_APP_BACKEND}/api/itineraries`;
            try {
                const res = await fetch(apiUrl);
                const itineraries = await res.json();
                setItineraries(itineraries);
                console.log('Itineraries:', itineraries);
            } catch (err) {
                console.log('Error fetching itineraries', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItineraries().then(r => r);
        window.addEventListener('modelModified', fetchItineraries);
        return () => {
            window.removeEventListener('modelModified', fetchItineraries);
        };
    }, []);

    const handleCreateItinerary = () => {
        navigate('/create-itinerary');
    };

    const handleViewMyItineraries = async () => {
        const apiUrl = `${process.env.REACT_APP_BACKEND}/api/itineraries/user/${sessionStorage.getItem('user id')}`;
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            setItineraries(data.itineraries);
            console.log('Itineraries:', data.itineraries);
        } catch (err) {
            console.log('Error fetching itineraries', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Itineraries
                    </h2>
                    {
                        ['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                            <button
                                onClick={handleCreateItinerary}
                                className="bg-[#330577] text-white px-4 py-2 rounded-md mb-6 mr-4"
                            >
                                Create New Itinerary
                            </button>
                        )
                    }
                    {
                        ['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                            <button
                                onClick={handleViewMyItineraries}
                                className="bg-[#330577] text-white px-4 py-2 rounded-md mb-6"
                            >
                                View My Created Itineraries
                            </button>
                        )
                    }
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