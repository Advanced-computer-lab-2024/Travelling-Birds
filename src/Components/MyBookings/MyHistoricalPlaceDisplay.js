import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

const MyHistoricalPlaceDisplay = ({ historicalPlace }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    let imageBase64 = null;
    if (historicalPlace.image?.data?.data && historicalPlace.image.contentType) {
        try {
            const byteArray = new Uint8Array(historicalPlace.image.data.data);
            const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            imageBase64 = `data:${historicalPlace.image.contentType};base64,${btoa(binaryString)}`;
        } catch (error) {
            console.error('Error converting image data to base64:', error);
        }
    }

    const renderTicketPrice = (price) => {
        const currency = sessionStorage.getItem('currency') || 'EGP';
        if (currency === 'USD') {
            return `$${(price / 49.3).toFixed(2)}`;
        } else if (currency === 'EUR') {
            return `€${(price / 49.3 * 0.93).toFixed(2)}`;
        } else {
            return `${price.toFixed(2)} EGP`; // Default to EGP
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md relative flex md:flex-row flex-col md:space-x-4 p-4">
            {imageBase64 && (
                <div className="md:w-1/4 w-full">
                    <img
                        src={imageBase64}
                        alt="Historical Place"
                        className={`w-full h-48 object-cover rounded-lg transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/historicalplaces/${historicalPlace._id}`)}
                    />
                </div>
            )}
            <div className="md:w-1/3 w-full flex flex-col justify-start space-y-2 mt-2 md:mt-0">
                <h3 className="text-2xl font-bold">{historicalPlace.name}</h3>
                <p className="text-gray-700">{historicalPlace.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {historicalPlace.tags?.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 text-sm mr-2 mb-2">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="md:w-1/3 w-full space-y-4 mt-4 md:mt-0">
                <div className="text-[#330577]">
                    {`Opening Hours: ${historicalPlace.openingHours?.startTime ? new Date(historicalPlace.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - 
                    ${historicalPlace.openingHours?.endTime ? new Date(historicalPlace.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`}
                </div>
                <div className="text-gray-700">
                    Ticket Prices: {historicalPlace.ticketPrices && historicalPlace.ticketPrices.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {historicalPlace.ticketPrices.map((price, index) => (
                                <li key={index} className="text-base">{renderTicketPrice(price)}</li>
                            ))}
                        </ul>
                    ) : (
                        'N/A'
                    )}
                </div>
            </div>
        </div>
    );
};

MyHistoricalPlaceDisplay.propTypes = {
    historicalPlace: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        openingHours: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string,
        }),
        ticketPrices: PropTypes.arrayOf(PropTypes.number),
        tags: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string,
        }),
        createdBy: PropTypes.string,
    }).isRequired
};

export default MyHistoricalPlaceDisplay;