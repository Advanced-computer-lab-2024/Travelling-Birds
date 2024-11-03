import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Popup from "reactjs-popup";
import { ItineraryForm } from "../Forms";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const ItineraryDisplay = ({ itinerary }) => {
    const [showMore, setShowMore] = useState(false);
    const timelinePreview = itinerary.timeline ? itinerary.timeline.substring(0, 100) : '';
    const availableDatesPreview = itinerary.availableDates.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ');
    const [userName, setUserName] = useState('');

    const deleteItinerary = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.message === 'Itinerary deleted successfully') {
                    toast.success('Itinerary deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to delete itinerary');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

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

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            {imageBase64 && (
                <img
                    src={imageBase64}
                    alt="Itinerary"
                    className="w-full h-48 object-cover rounded-t-xl"
                />
            )}
            <div className="p-4">
                <div className="mb-6">
                    <h3 className="text-xl font-bold">{`Itinerary by ${userName}`}</h3>
                    <div className="text-gray-600 my-2">{`Language: ${itinerary.language}`}</div>
                </div>

                {itinerary.timeline && (
                    <div className="mb-5">{showMore ? itinerary.timeline : timelinePreview}</div>
                )}

                {itinerary.timeline && (
                    <button
                        onClick={() => setShowMore(prevState => !prevState)}
                        className="text-indigo-500 mb-5 hover:text-indigo-600"
                    >
                        {showMore ? 'Less' : 'More'}
                    </button>
                )}

                <h3 className="text-indigo-500 mb-2">
                    {itinerary.price ? `$${itinerary.price}` : 'Price not available'}
                </h3>

                <div className="border border-gray-100 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="text-orange-700 mb-3">
                        <FaMapMarkerAlt className='inline mr-1 mb-1' />
                        {itinerary.locations.join(', ')}
                    </div>
                    <div className="text-green-500 mb-3">
                        <FaCalendarAlt className='inline mr-1 mb-1' />
                        {`Available on: ${availableDatesPreview}`}
                    </div>
                </div>

                <div className="text-yellow-500 mb-2">{`Accessibility: ${itinerary.accessibility}`}</div>

                <div className="text-gray-600 mb-2">{`Pickup Location: ${itinerary.pickupLocation}`}</div>
                <div className="text-gray-600 mb-2">{`Dropoff Location: ${itinerary.dropoffLocation}`}</div>
            </div>
            {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                <Popup
                    className="h-fit overflow-y-scroll"
                    trigger={
                        <button className="bg-indigo-500 text-white py-2 w-full">
                            Update Itinerary
                        </button>
                    }
                    modal
                    contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                    overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <ItineraryForm className="overflow-y-scroll" itinerary={itinerary} />
                </Popup>
            )}
            {['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
                <button onClick={() => {
                    if (window.confirm('Are you sure you wish to delete this item?')) {
                        deleteItinerary();
                    }
                }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
                    Delete Itinerary
                </button>
            )}
        </div>
    );
};

ItineraryDisplay.propTypes = {
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
        createdBy: PropTypes.string,
        image: PropTypes.shape({
            data: PropTypes.array,
            contentType: PropTypes.string,
        }),
        _id: PropTypes.string.isRequired,
    })
};

export default ItineraryDisplay;