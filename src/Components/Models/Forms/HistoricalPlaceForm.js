import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const HistoricalPlaceForm = ({ historicalPlace }) => {
    const [name, setName] = useState(historicalPlace?.name || '');
    const [description, setDescription] = useState(historicalPlace?.description || '');
    const [location, setLocation] = useState(historicalPlace?.location || '');
    const [openingHours, setOpeningHours] = useState(historicalPlace?.openingHours || '');
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
        formData.append('openingHours', openingHours);
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
                <ReusableInput type="text" name="Opening Hours" value={openingHours} onChange={e => setOpeningHours(e.target.value)} />
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