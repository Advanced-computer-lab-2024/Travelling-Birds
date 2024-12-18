import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const MyMuseumDisplay = ({ museum }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    let imageBase64 = null;
    if (museum.image?.data?.data && museum.image.contentType) {
        try {
            const byteArray = new Uint8Array(museum.image.data.data);
            const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            imageBase64 = `data:${museum.image.contentType};base64,${btoa(binaryString)}`;
        } catch (error) {
            console.error('Error converting image data to base64:', error);
        }
    }


    const renderTicketPrices = (ticketPrices) => {
        if (!ticketPrices || Object.keys(ticketPrices).length === 0) {
          return <p className="text-gray-700">No ticket prices available.</p>;
        }
    
        const currency = sessionStorage.getItem('currency');
        const convertPrice = (price) => {
            if (currency === 'USD') {
                return `$${(price / 49.3).toFixed(2)}`;
            } else if (currency === 'EUR') {
                return `€${(price / 49.3 * 0.93).toFixed(2)}`;
            } else {
                return `${price.toFixed(2)} EGP`; // Default to EGP
            }
        };
    
        return (
            <ul className="list-disc ml-6 text-gray-700">
              {Object.entries(ticketPrices).map(([category, price], index) => (
                  <li key={index}>
                    {category}: {convertPrice(price)}
                  </li>
              ))}
            </ul>
        );
      };

    return (
        <div className="bg-white rounded-xl shadow-md relative flex md:flex-row flex-col md:space-x-8 p-4"> {/* Increased md:space-x-4 to md:space-x-8 */}
            {imageBase64 && (
                <div className="md:w-1/4 w-full">
                    <img
                        src={imageBase64}
                        alt="Museum"
                        className={`w-full h-48 object-cover rounded-lg transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/museum/${museum._id}`)}
                    />
                </div>
            )}
            <div className="md:w-1/3 w-full flex flex-col justify-start space-y-2 mt-2 md:mt-0">
                <h3 className="text-2xl font-bold">{museum.name}</h3>
                <p className="text-gray-700">{museum.description || 'N/A'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {museum.tags?.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 text-sm mr-2 mb-2">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="md:w-1/3 w-full space-y-4 mt-4 md:mt-0">
                <div className="text-[#330577]">
                    {`Opening Hours: ${museum.openingHours?.startTime ? new Date(museum.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - 
                    ${museum.openingHours?.endTime ? new Date(museum.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`}
                </div>
                <div className="text-gray-700">
                    Ticket Prices: {renderTicketPrices(museum?.ticketPrices)}
                </div>
                <div className="flex flex-col mt-4">
                </div>
            </div>
        </div>
    );
};

MyMuseumDisplay.propTypes = {
    museum: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        openingHours: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string,
        }),
        ticketPrices: PropTypes.instanceOf(Map),
        tags: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string,
        }),
        createdBy: PropTypes.string,
    }).isRequired
};

export default MyMuseumDisplay;