import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const MyActivityDisplay = ({ activity }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

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
    const formatPriceRange = (price) => {
		const currency = sessionStorage.getItem('currency') || 'USD';
		if (currency === 'EGP') {
			return `${(price * 49.3).toFixed(2)} EGP`;
		} else if (currency === 'EUR') {
			return `€${(price * 0.93).toFixed(2)}`;
		} else {
			return `$${price.toFixed(2)}`; // Default to USD
		}
	};

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
        <div className="bg-white rounded-xl shadow-md relative flex flex-row p-4">
            <div className="relative flex-shrink-0">
                {imageBase64 && (
                    <img
                        src={imageBase64}
                        alt="Activity"
                        className={`w-48 h-48 object-cover rounded transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/activities/${activity._id}`)}
                    />
                )}
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-2xl font-bold text-[#330577] mb-1">{activity.title}</h3>
                <p className="text-lg text-gray-600 mb-4 font-semibold">{activity.category}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-700 mb-2">Date: {new Date(activity.date).toLocaleDateString()}</p>
                        <p className="text-gray-700 mb-2">Time: {activity.time}</p>
                        <p className="text-gray-700 mb-2">Location: {`${activity.location?.city || ''}, ${activity.location?.country || ''}`}</p>
                        <p className="text-gray-700 mb-2">Address: {activity.location?.address || 'N/A'}</p>
                    </div>
                    <div>
                        {activity.price !== undefined && <p className="text-gray-700 mb-2">Price: {formatPriceRange(activity.price)}</p>}
                        {activity.priceRange && (
                            <p className="text-gray-700 mb-2">Price Range: {activity?.priceRange ? `${formatPriceRange(activity.priceRange.lwBound)} - ${formatPriceRange(activity.priceRange.hiBound)}` : 'N/A'}</p>
                        )}
                        <p className="text-gray-700 mb-2">Special Discounts: {activity.specialDiscounts || 'N/A'}</p>
                        <p className="text-gray-700 mb-2">Reviews Count: {activity.reviewsCount}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 mb-2">Booking Open: {activity.bookingOpen ? 'Yes' : 'No'}</p>
                        {activity.features && activity.features.length > 0 && (
                            <p className="text-gray-700 mb-2">Features: {activity.features.join(', ')}</p>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                            <p className="text-gray-700">Rating:</p>
                            <div className="flex items-center text-yellow-500">
                                {renderRatingStars(activity.rating)}
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {activity.tags?.map((tag) => (
                                <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        {activity.contact && (
                            <div className="mb-2">
                                <p className="text-gray-700">Contact:</p>
                                {activity.contact.phone && <p className="text-gray-700">Phone: {activity.contact.phone}</p>}
                                {activity.contact.website && <p className="text-gray-700">Website: {activity.contact.website}</p>}
                                {activity.contact.email && <p className="text-gray-700">Email: {activity.contact.email}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

MyActivityDisplay.propTypes = {
    activity: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
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