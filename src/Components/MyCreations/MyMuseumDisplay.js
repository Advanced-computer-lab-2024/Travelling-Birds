import { useState } from 'react';
import Popup from "reactjs-popup";
import { MuseumForm } from "../Models/Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../utils/modelModificationEvent";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const MyMuseumDisplay = ({ museum }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const deleteMuseum = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.msg === 'Museum deleted successfully') {
                    toast.success('Museum deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to delete museum');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

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
        if (!ticketPrices || Object.keys(ticketPrices).length === 0) return <p>No ticket prices available.</p>;
      
        return (
          <ul className="list-disc ml-6">
            {Object.entries(ticketPrices).map(([category, price], index) => (
              <li key={index}>
                {category}: ${price.toFixed(2)}
              </li>
            ))}
          </ul>
        );
      };

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && (
                <div className="relative">
                    <img
                        src={imageBase64}
                        alt="Museum"
                        className={`w-full h-64 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => navigate(`/museum/${museum._id}`)}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                        <h3 className="text-2xl font-bold">{museum.name}</h3>
                    </div>
                </div>
            )}
            <div className="p-4 space-y-4">
                <p className="text-gray-700">Description: {museum.description || 'N/A'}</p>
                <p className="text-gray-700">Location: {museum.location || 'N/A'}</p>
                <div className="text-[#330577]">
                    {`Opening Hours: ${museum.openingHours?.startTime ? new Date(museum.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - 
                    ${museum.openingHours?.endTime ? new Date(museum.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`}
                </div>
                <div className="text-gray-700">
                    Ticket Prices: {renderTicketPrices(museum?.ticketPrices)}
                </div>
                <div className="flex flex-wrap gap-2">
                    {museum.tags?.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 text-sm mr-2 mb-2">{tag}</span>
                    ))}
                </div>
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <Popup
                        trigger={
                            <button className="bg-indigo-500 text-white py-2 w-full mt-4">
                                Update Museum
                            </button>
                        }
                        modal
                        contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <MuseumForm museum={museum} />
                    </Popup>
                )}
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <button onClick={() => {
                        if (window.confirm('Are you sure you wish to delete this museum?')) {
                            deleteMuseum();
                        }
                    }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full mt-2 rounded-b-xl">
                        Delete Museum
                    </button>
                )}
            </div>
        </div>
    );
};

MyMuseumDisplay.propTypes = {
    museum: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        location: PropTypes.string,
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