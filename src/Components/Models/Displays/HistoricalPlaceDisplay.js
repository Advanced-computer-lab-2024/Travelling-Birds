import { useState } from 'react';
import Popup from "reactjs-popup";
import { HistoricalPlaceForm } from "../Forms";
import { toast } from "react-toastify";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const HistoricalPlaceDisplay = ({ historicalPlace }) => {
    const [showMore, setShowMore] = useState(false);
    const descriptionPreview = historicalPlace.description ? historicalPlace.description.substring(0, 100) : '';

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

    // Safely handle image conversion for the browser
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
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && <img src={imageBase64} alt="Historical Place" className="w-full h-48 object-cover rounded-t-xl" />}
            <div className="p-4">
                <h3 className="text-xl font-bold">{historicalPlace.name}</h3>

                <div className="mb-5">{showMore ? historicalPlace.description : descriptionPreview}</div>

                {historicalPlace.description && (
                    <button
                        onClick={() => setShowMore(prevState => !prevState)}
                        className="text-indigo-500 mb-5 hover:text-indigo-600"
                    >
                        {showMore ? 'Less' : 'More'}
                    </button>
                )}

                <div className="text-orange-700 mb-3">
                    <FaMapMarkerAlt className="inline mr-1 mb-1" />
                    {historicalPlace.location}
                </div>

                <h3 className="text-indigo-500 mb-2">
                    {historicalPlace.ticketPrices ? `Tickets: ${historicalPlace.ticketPrices.join(', ')} EGP` : 'Ticket prices not available'}
                </h3>

                <div className="text-gray-600 mb-2">{`Opening Hours: ${historicalPlace.openingHours}`}</div>
                <div className="text-yellow-500 mb-2">{`Tags: ${historicalPlace.tags.join(', ')}`}</div>
            </div>

            {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                <Popup
                    trigger={
                        <button className="bg-indigo-500 text-white py-2 w-full">
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
                }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
                    Delete Historical Place
                </button>
            )}
        </div>
    );
};

HistoricalPlaceDisplay.propTypes = {
    historicalPlace: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        location: PropTypes.string,
        openingHours: PropTypes.string,
        ticketPrices: PropTypes.arrayOf(PropTypes.string),
        tags: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string,
        })
    })
};

export default HistoricalPlaceDisplay;