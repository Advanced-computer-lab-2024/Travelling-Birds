import React, { useEffect, useState } from 'react';
import { useNotifications } from '../Components/NotificationsContext'; // Import NotificationsContext

const Notifications = () => {
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { fetchNotifications, setNotificationsCount } = useNotifications(); // Use context for resetting count

    useEffect(() => {
        const fetchNotificationsData = async () => {
            if (userRole !== 'tourist') {
                setNotifications([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const activitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`);
                const itinerariesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`);
                const savedActivitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activities/${userId}`);

                if (!activitiesResponse.ok || !itinerariesResponse.ok || !savedActivitiesResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const activities = await activitiesResponse.json();
                const itineraries = await itinerariesResponse.json();
                const savedActivities = await savedActivitiesResponse.json();

                const now = new Date();

                const activityNotifications = activities
                    .filter((activity) => {
                        const activityDate = new Date(activity.date);
                        const timeDifference = activityDate - now;
                        return timeDifference > 0 && timeDifference <= 48 * 60 * 60 * 1000;
                    })
                    .map((activity) => ({
                        type: 'activity',
                        title: activity.title,
                        date: activity.date,
                        message: `Reminder: Your activity "${activity.title}" is happening soon.`,
                    }));

                const itineraryNotifications = itineraries
                    .filter((itinerary) => {
                        const itineraryDate = new Date(itinerary.availableDates[0]);
                        const timeDifference = itineraryDate - now;
                        return timeDifference > 0 && timeDifference <= 48 * 60 * 60 * 1000;
                    })
                    .map((itinerary) => ({
                        type: 'itinerary',
                        title: itinerary.title,
                        date: itinerary.availableDates[0],
                        message: `Reminder: Your itinerary "${itinerary.title}" starts soon.`,
                    }));

                const savedActivityNotifications = savedActivities
                    .filter((activity) => activity.bookingOpen)
                    .map((activity) => ({
                        type: 'saved-activity',
                        title: activity.title,
                        message: `Booking is now open for your saved activity "${activity.title}".`,
                    }));

                const allNotifications = [
                    ...activityNotifications,
                    ...itineraryNotifications,
                    ...savedActivityNotifications,
                ];

                setNotifications(allNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotificationsData();
    }, [userId, userRole]);

    const handleClearNotifications = () => {
        setNotifications([]); // Clear notifications list
        setNotificationsCount(0); // Reset count in context
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-[#330577]">Notifications</h1>
                <button
                    onClick={handleClearNotifications}
                    className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#4a079a]"
                >
                    Clear All Notifications
                </button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <div className="loader"></div>
                    <p className="text-gray-600 text-lg">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <p className="text-lg text-gray-700">You have no notifications at this time.</p>
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