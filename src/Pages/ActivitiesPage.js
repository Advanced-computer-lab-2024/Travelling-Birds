import React, { useEffect, useState } from 'react';
import MyActivityDisplay from "../Components/MyBookings/MyActivityDisplay";
import { CategoryDisplay, TagDisplay } from "../Components/Models/Displays";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { CategoryForm, TagForm } from "../Components/Models/Forms";

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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

        const fetchTags = async () => {
            const apiUrl = `${process.env.REACT_APP_BACKEND}/api/tags`;
            setLoading(true);
            try {
                const res = await fetch(apiUrl);
                const tags = await res.json();
                setTags(tags);
            } catch (err) {
                console.log('Error fetching tags', err);
            } finally {
                setLoading(false);
            }
        };
        const fetchCategories = async () => {
            const apiUrl = `${process.env.REACT_APP_BACKEND}/api/categories`;
            setLoading(true);
            try {
                const res = await fetch(apiUrl);
                const categories = await res.json();
                setCategories(categories);
            } catch (err) {
                console.log('Error fetching categories', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookedActivities();
        fetchTags();
        fetchCategories();

        window.addEventListener('modelModified', fetchBookedActivities);
        window.addEventListener('tagModified', fetchTags);
        window.addEventListener('categoryModified', fetchCategories);

        return () => {
            window.removeEventListener('modelModified', fetchBookedActivities);
            window.removeEventListener('tagModified', fetchTags);
            window.removeEventListener('categoryModified', fetchCategories);
        };
    }, [userRole, userId]);

    const handleCreateActivity = () => {
        navigate('/create-activity');
    };

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Activities
                    </h2>
                    {
                        ['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(userRole) && (
                            <button
                                onClick={handleCreateActivity}
                                className="bg-[#330577] text-white px-4 py-2 rounded-md mb-6 mr-4"
                            >
                                Create New Activity
                            </button>
                        )
                    }
                    {userRole !== 'tourist' && (
                        <>
                            <div className="flex flex-row gap-6 py-4">
                                {!loading ? (
                                    tags.map((tag) => (
                                        <TagDisplay className='py-4' key={tag._id} tag={tag} />
                                    ))) : (
                                    <p className="text-[#330577]">Loading tags...</p>
                                )}
                                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(userRole) && (
                                    <Popup
                                        className="h-fit overflow-y-scroll"
                                        trigger={
                                            <button className="bg-[#330577] text-white px-4 py-2 rounded-lg mr-4">
                                                New Tag
                                            </button>
                                        }
                                        modal
                                        contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                                        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                                    >
                                        <TagForm className="overflow-y-scroll" />
                                    </Popup>
                                )}
                            </div>
                            <div className="flex flex-row gap-6 py-4">
                                {!loading ? (
                                    categories.map((category) => (
                                        <CategoryDisplay className='py-4' key={category._id} category={category} />
                                    ))) : (
                                    <p className="text-[#330577]">Loading categories...</p>
                                )}
                                <Popup
                                    className="h-fit overflow-y-scroll"
                                    trigger={
                                        <button className="bg-[#330577] text-white px-4 py-2 rounded-lg mr-4">
                                            New Category
                                        </button>
                                    }
                                    modal
                                    contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                                    overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                                >
                                    <CategoryForm className="overflow-y-scroll" />
                                </Popup>
                            </div>
                        </>
                    )}
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