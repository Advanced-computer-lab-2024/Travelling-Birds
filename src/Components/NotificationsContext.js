import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
    const [notificationsCount, setNotificationsCount] = useState(0);

    const fetchNotifications = async () => {
        const userRole = sessionStorage.getItem('role');
        const userId = sessionStorage.getItem('user id');

        if (userRole !== 'tourist') {
            setNotificationsCount(0);
            return;
        }

        try {
            const activitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`);
            const itinerariesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`);
            const savedActivitiesResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activities/${userId}`);
            
            if (
                !activitiesResponse.ok || 
                !itinerariesResponse.ok || 
                !savedActivitiesResponse.ok 
            ) {
                throw new Error('Failed to fetch data');
            }

            const activities = await activitiesResponse.json();
            const itineraries = await itinerariesResponse.json();
            const savedActivities = await savedActivitiesResponse.json();

            const now = new Date();

            // Count notifications for activities within 48 hours
            const activityCount = activities.filter((activity) => {
                const activityDate = new Date(activity.date);
                const timeDifference = activityDate - now;
                return timeDifference > 0 && timeDifference <= 48 * 60 * 60 * 1000;
            }).length;

            // Count notifications for itineraries within 48 hours
            const itineraryCount = itineraries.filter((itinerary) => {
                const itineraryDate = new Date(itinerary.availableDates[0]);
                const timeDifference = itineraryDate - now;
                return timeDifference > 0 && timeDifference <= 48 * 60 * 60 * 1000;
            }).length;

            // Count notifications for saved activities with bookingOpen = true
            const savedActivityCount = savedActivities.filter((activity) => activity.bookingOpen).length;

            // Update notifications count
            setNotificationsCount(activityCount + itineraryCount + savedActivityCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Automatically fetch notifications count when the app loads
    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationsContext.Provider value={{ notificationsCount, fetchNotifications, setNotificationsCount }}>
            {children}
        </NotificationsContext.Provider>
    );
};