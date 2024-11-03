import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const HistoricalPlaceForm = ({ historicalPlace }) => {
    const [name, setName] = useState(historicalPlace?.name || '');
    const [description, setDescription] = useState(historicalPlace?.description || '');
    const [location, setLocation] = useState(historicalPlace?.location || '');
    const [startTime, setStartTime] = useState(historicalPlace?.openingHours?.startTime ? new Date(historicalPlace.openingHours.startTime).toISOString().slice(11, 16) : '');
    const [endTime, setEndTime] = useState(historicalPlace?.openingHours?.endTime ? new Date(historicalPlace.openingHours.endTime).toISOString().slice(11, 16) : '');
    const [ticketPrices, setTicketPrices] = useState(historicalPlace?.ticketPrices ? historicalPlace.ticketPrices.join(', ') : '');
    const [tags, setTags] = useState(historicalPlace?.tags?.join(',') || '');
    const [image, setImage] = useState(null); // State for the image

    // Handle image change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location', location);
        
        // Construct openingHours object without timezone adjustments
       // const openingHoursObject = {
       //     startTime: `${startTime}:00`, // e.g., "08:00:00"
       //     endTime: `${endTime}:00` // e.g., "10:00:00"
       // };
       // formData.append('openingHours', JSON.stringify(openingHoursObject));
       formData.append('openingHours[startTime]', `${startTime}:00`);
       formData.append('openingHours[endTime]', `${endTime}:00`);
       
        formData.append('ticketPrices', ticketPrices.split(',').map(price => parseFloat(price.trim())));
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('createdBy', sessionStorage.getItem('user id'));

        if (image) {
            formData.append('image', image);
        }

        return formData;
    };

    const registerHistoricalPlace = () => {
        const formData = createFormData();

        fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces`, {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data._id) {
                    toast.success('Historical place added successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to register historical place');
                }
            })
            .catch((error) => {
                console.error('Error occurred:', error);
                toast.error('Failed to register historical place');
            });
    };

    const updateHistoricalPlace = () => {
        const formData = createFormData();

        fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`, {
            method: 'PUT',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data._id) {
                    toast.success('Historical place updated successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to update historical place');
                }
            })
            .catch((error) => {
                console.error('Error occurred:', error);
                toast.error('Failed to update historical place');
            });
    };

    return (
        <div>
            <form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
                e.preventDefault();
                !historicalPlace ? registerHistoricalPlace() : updateHistoricalPlace();
            }}>
                <h1 className="text-2xl font-bold mb-4">{historicalPlace ? 'Update Historical Place' : 'Register Historical Place'}</h1>
                <ReusableInput type="text" name="Name" value={name} onChange={e => setName(e.target.value)} />
                <ReusableInput type="text" name="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <ReusableInput type="text" name="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <label className="block text-gray-700 mb-2">Opening Hours Start Time:</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full mb-4 border rounded px-2 py-1" />
                <label className="block text-gray-700 mb-2">Opening Hours End Time:</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full mb-4 border rounded px-2 py-1" />
                <ReusableInput type="text" name="Ticket Prices" value={ticketPrices} onChange={e => setTicketPrices(e.target.value)} />
                <ReusableInput type="text" name="Tags" value={tags} onChange={e => setTags(e.target.value)} />
                <input type="file" name="Image" onChange={handleFileChange} className="mt-4" />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                    {historicalPlace ? 'Update' : 'Register'}
                </button>
            </form>
        </div>
    );
};

HistoricalPlaceForm.propTypes = {
    historicalPlace: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        pictures: PropTypes.arrayOf(PropTypes.string),
        location: PropTypes.string,
        openingHours: PropTypes.string,
        ticketPrices: PropTypes.arrayOf(PropTypes.number),
        tags: PropTypes.arrayOf(PropTypes.string),
        createdBy: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    })
};

export default HistoricalPlaceForm;