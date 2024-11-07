import { useState } from 'react';
import Popup from "reactjs-popup";
import { HistoricalPlaceForm } from "../Models/Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../utils/modelModificationEvent";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const MyHistoricalPlaceDisplay = ({ historicalPlace }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const deleteHistoricalPlace = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.msg === 'Historical Place deleted successfully') {
                    toast.success('Historical place deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to delete historical place');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

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
                <p className="text-gray-700">Location: {historicalPlace.location || 'N/A'}</p>
                <div className="text-[#330577]">
                    {`Opening Hours: ${historicalPlace.openingHours?.startTime ? new Date(historicalPlace.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - 
                    ${historicalPlace.openingHours?.endTime ? new Date(historicalPlace.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`}
                </div>
                <div className="text-gray-700">
                    Ticket Prices: {historicalPlace.ticketPrices && historicalPlace.ticketPrices.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {historicalPlace.ticketPrices.map((price, index) => (
                                <li key={index}>${price}</li>
                            ))}
                        </ul>
                    ) : (
                        'N/A'
                    )}
                </div>
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <Popup
                        trigger={
                            <button className="bg-indigo-500 text-white py-2 w-full mt-4">
                                Update Historical Place
                            </button>
                        }
                        modal
                        contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <HistoricalPlaceForm historicalPlace={historicalPlace} />
                    </Popup>
                )}
                {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                    <button onClick={() => {
                        if (window.confirm('Are you sure you wish to delete this historical place?')) {
                            deleteHistoricalPlace();
                        }
                    }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full mt-2 rounded-b-xl">
                        Delete Historical Place
                    </button>
                )}
            </div>
        </div>
    );
};

MyHistoricalPlaceDisplay.propTypes = {
    historicalPlace: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        location: PropTypes.string,
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