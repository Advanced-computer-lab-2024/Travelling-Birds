import { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const MyItineraryDisplay = ({ itinerary }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/${itinerary.createdBy}`;
            try {
                const res = await fetch(apiUrl);
                const user = await res.json();
                setUserName(user.firstName + ' ' + user.lastName);
            } catch (err) {
                console.log('Error fetching user', err);
            }
        };
        fetchUser().then();
    }, [itinerary.createdBy]);

    let imageBase64 = null;
    if (itinerary.image?.data?.data && itinerary.image.contentType) {
        try {
            const byteArray = new Uint8Array(itinerary.image.data.data);
            const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            imageBase64 = `data:${itinerary.image.contentType};base64,${btoa(binaryString)}`;
        } catch (error) {
            console.error('Error converting image data to base64:', error);
        }
    }
    

    const formatPriceRange = (price) => {
        const currency = sessionStorage.getItem('currency') || 'EGP';
        if (currency === 'USD') {
            return `$${(price / 49.3).toFixed(2)}`;
        } else if (currency === 'EUR') {
            return `€${(price / 49.3 * 0.93).toFixed(2)}`;
        } else {
            return `${price.toFixed(2)} EGP`; // Default to EGP
        }
    };

    const availableDatesPreview = itinerary.availableDates.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ');

    return (
        <div className="bg-white rounded-xl shadow-md relative flex">
            {imageBase64 && (
                <div className="w-1/4 relative">
                    <img
                        src={imageBase64}
                        alt="Itinerary"
                        className={`w-full h-full object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/itineraries/${itinerary._id}`)}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                        <h3 className="text-2xl font-bold">{`By ${userName}`}</h3>
                    </div>
                </div>
            )}
            <div className="w-3/4 flex flex-wrap p-4">
                <div className="w-full lg:w-1/3 p-2 space-y-2">
                    <div className="text-[#330577] mb-2">
                        <FaCalendarAlt className='inline mr-1 mb-1' />
                        {`Available on: ${availableDatesPreview}`}
                    </div>
                    <p className="text-gray-700">Timeline: {itinerary.timeline || 'N/A'}</p>
                    <p className="text-gray-700">Duration: {itinerary.duration || 'N/A'}</p>
                    <p className="text-gray-700">Language: {itinerary.language || 'N/A'}</p>
                </div>
                <div className="w-full lg:w-1/3 p-2 space-y-2">
                    <p className="text-gray-700">Price: {formatPriceRange(itinerary.price) || 'N/A'}</p>
                    <p className="text-gray-700">Accessibility: {itinerary.accessibility || 'N/A'}</p>
                    <p className="text-gray-700">Preferences: {itinerary.preferences || 'N/A'}</p>
                    <p className="text-gray-700">Booking Status: {itinerary.isBooked ? 'Booked' : 'Available'}</p>
                </div>
                <div className="w-full lg:w-1/3 p-2 space-y-2">
                    <span className="block bg-gray-300 text-gray-900 rounded-full px-3 py-1 text-sm mb-2">
                        Pickup Location: {itinerary.pickupLocation || 'N/A'}
                    </span>
                    <span className="block bg-gray-300 text-gray-900 rounded-full px-3 py-1 text-sm mb-2">
                        Dropoff Location: {itinerary.dropoffLocation || 'N/A'}
                    </span>
                    {itinerary.locations && itinerary.locations.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-gray-700">Locations:</p>
                            <ul className="list-disc pl-5">
                                {itinerary.locations.map((location, index) => (
                                    <li key={index} className="text-gray-700">{location}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

MyItineraryDisplay.propTypes = {
    itinerary: PropTypes.shape({
        activities: PropTypes.arrayOf(PropTypes.string),
        locations: PropTypes.arrayOf(PropTypes.string),
        timeline: PropTypes.string,
        duration: PropTypes.string,
        language: PropTypes.string,
        price: PropTypes.number,
        availableDates: PropTypes.arrayOf(PropTypes.any),
        accessibility: PropTypes.string,
        pickupLocation: PropTypes.string,
        dropoffLocation: PropTypes.string,
        preferences: PropTypes.string,
        isBooked: PropTypes.bool,
        image: PropTypes.shape({
            data: PropTypes.array,
            contentType: PropTypes.string,
        }),
        createdBy: PropTypes.string,
        _id: PropTypes.string.isRequired,
    }).isRequired
};

export default MyItineraryDisplay;