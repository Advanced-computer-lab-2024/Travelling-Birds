import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const MuseumForm = ({ museum }) => {
    const [name, setName] = useState(museum?.name || '');
    const [description, setDescription] = useState(museum?.description || '');
    const [pictures, setPictures] = useState(museum?.pictures?.join(',') || '');
    const [location, setLocation] = useState(museum?.location || '');
    const [openingHours, setOpeningHours] = useState(museum?.openingHours || '');
    const [ticketPrices, setTicketPrices] = useState(museum?.ticketPrices ? Object.entries(museum.ticketPrices).map(([key, value]) => `${key}: ${value}`).join(', ') : '');
    const [tags, setTags] = useState(museum?.tags?.join(',') || '');
    const [image, setImage] = useState(null); // State for the image

    // Handle image change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createFormData = (isCreating) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('pictures', pictures.split(',').map(pic => pic.trim()));
        formData.append('location', location);
        formData.append('openingHours', openingHours);
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('createdBy', sessionStorage.getItem('user id'));

        try {
            // Format ticketPrices as an object or Map
            const ticketPricesObject = ticketPrices.split(',').reduce((acc, price) => {
                const [key, value] = price.split(':').map(item => item.trim());
                acc[key] = value === 'null' ? null : parseFloat(value);
                return acc;
            }, {});

            if (isCreating) {
                formData.append('ticketPrices', JSON.stringify(ticketPricesObject));
            } else {
                Object.keys(ticketPricesObject).forEach(key => {
                    formData.append(`ticketPrices[${key}]`, ticketPricesObject[key]);
                });
            }
        } catch (error) {
            console.error('Error processing ticketPrices:', error);
            toast.error('Failed to process ticket prices');
            return null; // Stop form submission if ticketPrices are malformed
        }

        if (image) {
            formData.append('image', image);
        }

        return formData;
    };

    const registerMuseum = () => {
        const formData = createFormData(true);
        if (!formData) return; // Prevent request if formData creation failed

        fetch(`${process.env.REACT_APP_BACKEND}/api/museums`, {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data._id) {
                    toast.success('Museum added successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to register museum');
                }
            })
            .catch((error) => {
                console.error('Error occurred during museum registration:', error);
                toast.error('Failed to register museum');
            });
    };

    const updateMuseum = () => {
        const formData = createFormData(false);
        if (!formData) return; // Prevent request if formData creation failed

        fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
            method: 'PUT',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data._id) {
                    toast.success('Museum updated successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    console.error('Unexpected response:', data);
                    toast.error('Failed to update museum');
                }
            })
            .catch((error) => {
                console.error('Error occurred during museum update:', error);
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
                <ReusableInput type="text" name="Pictures" value={pictures} onChange={e => setPictures(e.target.value)} />
                <ReusableInput type="text" name="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <ReusableInput type="text" name="Opening Hours" value={openingHours} onChange={e => setOpeningHours(e.target.value)} />
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