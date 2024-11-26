import { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ItineraryDisplay = ({ itinerary }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate(); // Initialize navigate for redirection


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

    // Safely handle image conversion for the browser
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

    const availableDatesPreview = itinerary.availableDates.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ');

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && (
                <div className="relative">
                    <img
                        src={imageBase64}
                        alt="Itinerary"
                        className={`w-full h-64 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/itineraries/${itinerary._id}`)}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                        <h3 className="text-2xl font-bold">{`By ${userName}`}</h3>
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="text-[#330577] mb-3">
                    <FaCalendarAlt className='inline mr-1 mb-1' />
                    {`Available on: ${availableDatesPreview}`}
                </div>
                <div className="flex flex-wrap">
                    <span className="inline-block bg-gray-300 text-gray-900 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                        Pickup Location: {itinerary.pickupLocation}
                    </span>
                    <span className="inline-block bg-gray-300 text-gray-900 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                        Dropoff Location: {itinerary.dropoffLocation}
                    </span>
                </div>

            </div>
        </div>
    );
};

ItineraryDisplay.propTypes = {
    itinerary: PropTypes.shape({
        locations: PropTypes.arrayOf(PropTypes.string),
        availableDates: PropTypes.arrayOf(PropTypes.any),
        pickupLocation: PropTypes.string,
        dropoffLocation: PropTypes.string,
        createdBy: PropTypes.string,
        image: PropTypes.shape({
            data: PropTypes.array,
            contentType: PropTypes.string,
        }),
        _id: PropTypes.string.isRequired,
    })
};

export default ItineraryDisplay;