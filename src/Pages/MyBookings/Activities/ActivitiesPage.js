import React, { useEffect, useState } from 'react';
import MyActivityDisplay from "../../../Components/MyBookings/MyActivityDisplay";

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id');

    useEffect(() => {
        // Only fetch booked activities if the user is a tourist
        const fetchBookedActivities = async () => {
            if (userRole === 'tourist') {
                const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`;
                setLoading(true);
                try {
                    const res = await fetch(apiUrl);
                    if (!res.ok) {
                        throw new Error('Failed to fetch booked activities');
                    }
                    const bookedActivities = await res.json();
                    setActivities(bookedActivities);
                } catch (err) {
                    console.log('Error fetching booked activities', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookedActivities();


        window.addEventListener('modelModified', fetchBookedActivities);


        return () => {
            window.removeEventListener('modelModified', fetchBookedActivities);

        };
    }, [userRole, userId]);

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Activities
                    </h2>
                    <div className="space-y-6">
                        {!loading ? (
                            activities.map((activity) => (
                                <MyActivityDisplay key={activity._id} activity={activity} />
                            ))
                        ) : (
                            <p className="text-[#330577]">Loading activities...</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ActivityPage;