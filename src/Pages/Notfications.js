import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const userId = sessionStorage.getItem('user id');
    const userRole = sessionStorage.getItem('role');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                let fetchedNotifications = [];

                if (userRole === 'tourist') {
                    // Tourist: Upcoming activities, itineraries, and saved activities notifications
                    const activitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`);
                    const itinerariesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`);
                    const savedActivitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activities/${userId}`);
                    
                    if (!activitiesResponse.ok || !itinerariesResponse.ok || !savedActivitiesResponse.ok) {
                        throw new Error('Failed to fetch bookings or saved activities');
                    }

                    const activities = await activitiesResponse.json();
                    const itineraries = await itinerariesResponse.json();
                    const savedActivities = await savedActivitiesResponse.json();
                    const now = new Date();

                    const activityNotifications = activities.filter(activity => {
                        const activityDate = new Date(activity.date);
                        const timeDifference = activityDate - now;
                        return timeDifference > 0 && timeDifference <= 48 * 60 * 60 * 1000;
                    }).map(activity => ({
                        type: 'activity',
                        title: activity.title,
                        date: activity.date,
                        message: `Reminder: Your activity "${activity.title}" is happening soon on ${new Date(activity.date).toLocaleString()}.`,
                    }));

                    const itineraryNotifications = itineraries.filter(itinerary => {
                        const itineraryDate = new Date(itinerary.availableDates[0]);
                        return (itineraryDate - now) / (1000 * 60 * 60) <= 48;
                    }).map(itinerary => ({
                        type: 'itinerary',
                        title: itinerary.title,
                        date: itinerary.availableDates[0],
                        message: `Reminder: Your itinerary "${itinerary.title}" starts soon on ${new Date(itinerary.availableDates[0]).toLocaleString()}.`,
                    }));

                    const savedActivityNotifications = savedActivities.filter(activity => activity.bookingOpen)
                        .map(activity => ({
                            type: 'saved-activity',
                            title: activity.title,
                            message: `Great news! Booking has opened for your saved activity "${activity.title}".`,
                        }));

                    fetchedNotifications = [
                        ...activityNotifications,
                        ...itineraryNotifications,
                        ...savedActivityNotifications,
                    ];
                } else if (userRole === 'tour_guide') {
                    const itinerariesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries`);
                    if (!itinerariesResponse.ok) {
                        throw new Error('Failed to fetch itineraries');
                    }

                    const itineraries = await itinerariesResponse.json();
                    const flaggedItineraries = itineraries.filter(itinerary => 
                        itinerary.createdBy === userId && itinerary.flaggedInappropriate
                    );

                    fetchedNotifications = flaggedItineraries.map(itinerary => ({
                        type: 'flagged-itinerary',
                        title: itinerary.title,
                        message: `Your itinerary "${itinerary.title}" has been flagged as inappropriate.`,
                    }));
                } else if (userRole === 'advertiser') {
                    const activitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities`);
                    if (!activitiesResponse.ok) {
                        throw new Error('Failed to fetch activities');
                    }

                    const activities = await activitiesResponse.json();
                    const flaggedActivities = activities.filter(activity => 
                        activity.createdBy === userId && activity.flaggedInappropriate
                    );

                    fetchedNotifications = flaggedActivities.map(activity => ({
                        type: 'flagged-activity',
                        title: activity.title,
                        message: `Your activity "${activity.title}" has been flagged as inappropriate.`,
                    }));
                }

                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, userRole]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4 text-[#330577]">Notifications</h1>

            {isLoading ? (
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <p className="text-lg text-gray-700">You have no notifications.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#330577]"
                        >
                            <h2 className="text-xl font-semibold text-[#330577]">
                                {notification.title}
                            </h2>
                            <p className="text-gray-700">{notification.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;