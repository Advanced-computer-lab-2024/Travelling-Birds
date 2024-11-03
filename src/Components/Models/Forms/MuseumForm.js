import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const MuseumForm = ({ museum }) => {
    const [name, setName] = useState(museum?.name || '');
    const [description, setDescription] = useState(museum?.description || '');
    const [location, setLocation] = useState(museum?.location || '');
    const [startTime, setStartTime] = useState(museum?.openingHours?.startTime ? new Date(museum.openingHours.startTime).toISOString().slice(11, 16) : '');
    const [endTime, setEndTime] = useState(museum?.openingHours?.endTime ? new Date(museum.openingHours.endTime).toISOString().slice(11, 16) : '');
    const [ticketPrices, setTicketPrices] = useState(museum?.ticketPrices ? Object.entries(museum.ticketPrices).map(([key, value]) => `${key}: ${value}`).join(', ') : '');
    const [tags, setTags] = useState(museum?.tags?.join(',') || '');
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createFormData = (isCreating) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location', location);
    
        // Construct openingHours object without timezone adjustments
        const openingHoursObject = {
            startTime: `${startTime}:00`, // e.g., "08:00:00"
            endTime: `${endTime}:00` // e.g., "10:00:00"
        };
        formData.append('openingHours', JSON.stringify(openingHoursObject));
    
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('createdBy', sessionStorage.getItem('user id'));
    
        try {
            const ticketPricesObject = ticketPrices.split(',').reduce((acc, price) => {
                const [key, value] = price.split(':').map(item => item.trim());
                acc[key] = value === 'null' ? null : parseFloat(value);
                return acc;
            }, {});
    
            formData.append('ticketPrices', JSON.stringify(ticketPricesObject));
        } catch (error) {
            console.error('Error processing ticketPrices:', error);
            toast.error('Failed to process ticket prices');
            return null;
        }
    
        if (image) {
            formData.append('image', image);
        }
    
        return formData;
    };

    const registerMuseum = () => {
        const formData = createFormData(true);
        if (!formData) return;

        fetch(`${process.env.REACT_APP_BACKEND}/api/museums`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data && data._id) {
                    toast.success('Museum added successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to register museum');
                }
            })
            .catch(error => {
                console.error('Error during museum registration:', error);
                toast.error('Failed to register museum');
            });
    };

    const updateMuseum = () => {
        const formData = createFormData(false);
        if (!formData) return;

        fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data && data._id) {
                    toast.success('Museum updated successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to update museum');
                }
            })
            .catch(error => {
                console.error('Error during museum update:', error);
                toast.error('Failed to update museum');
            });
    };

    return (
        <div>
            <form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
                e.preventDefault();
                !museum ? registerMuseum() : updateMuseum();
            }}>
                <h1 className="text-2xl font-bold mb-4">{museum ? 'Update Museum' : 'Register Museum'}</h1>
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
                    {museum ? 'Update' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default MuseumForm;