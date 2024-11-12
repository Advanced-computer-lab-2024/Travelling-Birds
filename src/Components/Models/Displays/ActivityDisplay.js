import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from "prop-types";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ActivityForm } from "../Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ActivityDisplay = ({ activity }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate(); // Initialize navigate for redirection


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
                        onClick={() => navigate(`/activities/${activity._id}`)}
                    />
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                    <h3 className="text-2xl font-bold">{activity.title}</h3>
                </div>
            </div>
            <div className="p-4">
                <div className="text-sm mb-2">
                    {activity.tags?.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 mr-1 mt-1">{tag}</span>
                    ))}
                </div>
                <div className="flex items-center text-yellow-500">
                    {renderRatingStars(activity.rating)}
                </div>
              
            </div>
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