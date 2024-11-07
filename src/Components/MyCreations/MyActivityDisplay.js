import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from "prop-types";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ActivityForm } from "../Models/Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../utils/modelModificationEvent";
import { useNavigate } from 'react-router-dom';

const MyActivityDisplay = ({ activity }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const deleteActivity = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.message === 'activity deleted successfully') {
                    toast.success('Activity deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to delete activity');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

    let imageBase64 = null;
    if (activity.image?.data?.data && activity.image.contentType) {
        try {
            const byteArray = new Uint8Array(activity.image.data.data);
            const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            imageBase64 = `data:${activity.image.contentType};base64,${btoa(binaryString)}`;
        } catch (error) {
            console.error('Error converting image data to base64:', error);
        }
    }

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? <FaStar key={i} className="text-[#330577]" /> : <FaRegStar key={i} className="text-[#330577]" />
            );
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            <div className="relative">
                {imageBase64 && (
                    <img
                        src={imageBase64}
                        alt="Activity"
                        className={`w-full h-48 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/${activity._id}`)}
                    />
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                    <h3 className="text-2xl font-bold">{activity.title}</h3>
                    <p className="text-sm">{activity.category}</p>
                </div>
            </div>
            <div className="p-4 space-y-4">
                <p className="text-gray-700">Description: {activity.description}</p>
                <p className="text-gray-700">Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p className="text-gray-700">Time: {activity.time}</p>
                <p className="text-gray-700">Location: {`${activity.location?.city || ''}, ${activity.location?.country || ''}`}</p>
                <p className="text-gray-700">Address: {activity.location?.address || 'N/A'}</p>
                {activity.price !== undefined && <p className="text-gray-700">Price: ${activity.price}</p>}
                {activity.priceRange && (
                    <p className="text-gray-700">Price Range: ${activity.priceRange.lwBound} - ${activity.priceRange.hiBound}</p>
                )}
                <div className="space-y-2">
                    <p className="text-gray-700">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {activity.tags?.map((tag) => (
                            <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-gray-700">Rating:</p>
                    <div className="flex items-center text-yellow-500">
                        {renderRatingStars(activity.rating)}
                    </div>
                </div>
                <p className="text-gray-700">Special Discounts: {activity.specialDiscounts || 'N/A'}</p>
                <p className="text-gray-700">Reviews Count: {activity.reviewsCount}</p>
                <p className="text-gray-700">Booking Open: {activity.bookingOpen ? 'Yes' : 'No'}</p>
                {activity.features && activity.features.length > 0 && (
                    <p className="text-gray-700">Features: {activity.features.join(', ')}</p>
                )}
                {activity.contact && (
                    <div>
                        <p className="text-gray-700">Contact:</p>
                        {activity.contact.phone && <p className="text-gray-700">Phone: {activity.contact.phone}</p>}
                        {activity.contact.website && <p className="text-gray-700">Website: {activity.contact.website}</p>}
                        {activity.contact.email && <p className="text-gray-700">Email: {activity.contact.email}</p>}
                    </div>
                )}
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <Popup
                        className="h-fit overflow-y-scroll"
                        trigger={
                            <button className="bg-indigo-500 text-white py-2 w-full">
                                Update Activity
                            </button>
                        }
                        modal
                        contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <ActivityForm className="overflow-y-scroll" activity={activity} />
                    </Popup>
                )}
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <button onClick={() => {
                        if (window.confirm('Are you sure you wish to delete this item?')) {
                            deleteActivity();
                        }
                    }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
                        Delete Activity
                    </button>
                )}
            </div>
        </div>
    );
};

MyActivityDisplay.propTypes = {
    activity: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        location: PropTypes.shape({
            city: PropTypes.string,
            country: PropTypes.string,
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
            address: PropTypes.string,
            area: PropTypes.string,
        }).isRequired,
        price: PropTypes.number,
        priceRange: PropTypes.shape({
            lwBound: PropTypes.number,
            hiBound: PropTypes.number,
        }),
        category: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.number,
        specialDiscounts: PropTypes.string,
        bookingOpen: PropTypes.bool,
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string
        }),
        reviewsCount: PropTypes.number,
        features: PropTypes.arrayOf(PropTypes.string),
        contact: PropTypes.shape({
            phone: PropTypes.string,
            website: PropTypes.string,
            email: PropTypes.string,
        }),
    }).isRequired
};

export default MyActivityDisplay;