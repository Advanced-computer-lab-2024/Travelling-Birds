import { useState } from 'react';
import Popup from "reactjs-popup";
import { MuseumForm } from "../Forms";
import { toast } from "react-toastify";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const MuseumDisplay = ({ museum }) => {
    const [showMore, setShowMore] = useState(false);
    const descriptionPreview = museum.description ? museum.description.substring(0, 100) : '';

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

    // Safely handle image conversion for the browser
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

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && <img src={imageBase64} alt="Museum" className="w-full h-48 object-cover rounded-t-xl" />}
            <div className="p-4">
                <h3 className="text-xl font-bold">{museum.name}</h3>

                <div className="mb-5">{showMore ? museum.description : descriptionPreview}</div>

                {museum.description && (
                    <button
                        onClick={() => setShowMore(prevState => !prevState)}
                        className="text-indigo-500 mb-5 hover:text-indigo-600"
                    >
                        {showMore ? 'Less' : 'More'}
                    </button>
                )}

                <div className="text-orange-700 mb-3">
                    <FaMapMarkerAlt className="inline mr-1 mb-1" />
                    {museum.location}
                </div>

                <h3 className="text-indigo-500 mb-2">
                    {museum.ticketPrices
                        ? `Tickets: ${Object.entries(museum.ticketPrices).map(([key, value]) =>
                            `${value ? `$${value} For ${key.charAt(0).toUpperCase() + key.slice(1)}` : ''}`)
                            .filter(Boolean)
                            .join(', ')}`
                        : 'Ticket prices not available'}
                </h3>

                <div className="text-gray-600 mb-2">
                    {`Opening Hours: ${museum.openingHours?.startTime ? new Date(museum.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - 
                    ${museum.openingHours?.endTime ? new Date(museum.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`}
                </div>
                <div className="text-yellow-500 mb-2">{`Tags: ${museum.tags.join(', ')}`}</div>
            </div>

            {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                <Popup
                    trigger={
                        <button className="bg-indigo-500 text-white py-2 w-full">
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
                }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
                    Delete Museum
                </button>
            )}
        </div>
    );
};

MuseumDisplay.propTypes = {
    museum: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        location: PropTypes.string,
        openingHours: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string,
        }),
        ticketPrices: PropTypes.shape({
            adult: PropTypes.number,
            child: PropTypes.number,
        }),
        tags: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.shape({
            data: PropTypes.object,
            contentType: PropTypes.string,
        })
    })
};

export default MuseumDisplay;