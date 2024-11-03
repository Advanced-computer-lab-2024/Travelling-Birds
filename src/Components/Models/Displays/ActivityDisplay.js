import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import PropTypes from "prop-types";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ActivityForm } from "../Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import { FaStar, FaRegStar } from 'react-icons/fa';

const ActivityDisplay = ({ activity }) => {
    const [showMore, setShowMore] = useState(false);
    const description = activity.specialDiscounts ? activity.specialDiscounts.substring(0, 100) : '';

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

    // Safely handle image conversion for the browser
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

    // Function to render rating as stars
    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-yellow-500" />
            );
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && <img src={imageBase64} alt="Activity" className="w-full h-48 object-cover rounded-t-xl" />}
            <div className="p-4">
                <div className="mb-6">
                    <div className="text-gray-600 my-2">{activity.category}</div>
                    <h3 className="text-xl font-bold"> {`Activity on ${new Date(activity.date).toLocaleDateString()} at ${activity.time}`}</h3>
                </div>
                {activity.specialDiscounts && (
                    <div className="mb-5">{showMore ? activity.specialDiscounts : description}</div>
                )}
                {activity.specialDiscounts && (
                    <button
                        onClick={() => setShowMore(prevState => !prevState)}
                        className="text-indigo-500 mb-5 hover:text-indigo-600"
                    >
                        {showMore ? 'Less' : 'More'}
                    </button>
                )}
                <h3 className="text-indigo-500 mb-2">
                    {activity.price ? `$${activity.price}` : `$${activity.priceRange.lwBound} - $${activity.priceRange.hiBound}`}
                </h3>
                <div className="border border-gray-100 mb-5"></div>
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="text-orange-700 mb-3">
                        <FaMapMarker className='inline mr-1 mb-1' />
                        {`Lat: ${activity.location.lat}, Lng: ${activity.location.lng}`}
                    </div>
                </div>
                <div className="flex items-center text-yellow-500 mb-2">
                    <span className="mr-2">Rating:</span>
                    <div className="flex">
                        {renderRatingStars(activity.rating)}
                    </div>
                </div>
                <div className="text-gray-600 mb-2">
                    {activity.tags?.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-800 rounded-full px-2 py-1 mr-2">{tag}</span>
                    ))}
                </div>
            </div>
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
    );
};

ActivityDisplay.propTypes = {
    activity: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        location: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        }).isRequired,
        rating: PropTypes.number,
        price: PropTypes.number,
        priceRange: PropTypes.shape({
            lwBound: PropTypes.number.isRequired,
            hiBound: PropTypes.number.isRequired,
        }),
        category: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        specialDiscounts: PropTypes.string,
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string
        })
    }).isRequired
};

export default ActivityDisplay;