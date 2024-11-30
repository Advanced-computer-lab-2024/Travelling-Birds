import React, { useEffect, useState } from 'react';
import MyActivityDisplay from "../../../Components/MyBookings/MyActivityDisplay";

const SavedActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id');

    //only fetch saved activities if the user is a tourist
    useEffect(() => {
        const fetchSavedActivities = async () => {
            if (userRole === 'tourist') {
                const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/saved-activities/${userId}`;
                setLoading(true);
                try {
                    const res = await fetch(apiUrl);
                    if (!res.ok) {
                        throw new Error('Failed to fetch saved activities');
                    }
                    const savedActivities = await res.json();
                    setActivities(savedActivities);
                } catch (err) {
                    console.log('Error fetching saved activities', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSavedActivities();

        window.addEventListener('modelModified', fetchSavedActivities);

        return () => {
            window.removeEventListener('modelModified', fetchSavedActivities);
        };
    }
    , [userRole, userId]);

    return (
           
        <div> 
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Saved Activities
                    </h2>
                    <div className="space-y-6">
                        {!loading ? (
                            activities.map((activity) => (
                                <MyActivityDisplay key={activity._id} activity
                                ={activity} />
                            ))
                        ) : (
                            <p className="text-[#330577]">Loading activities...</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SavedActivities;

