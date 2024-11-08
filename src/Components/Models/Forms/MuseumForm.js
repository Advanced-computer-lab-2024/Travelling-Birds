import { useState, useEffect } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const MuseumForm = () => {
    const { id } = useParams(); 
    const [loading, setLoading] = useState(true);
    const [museum, setMuseum] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({ city: '', country: '', lat: '', lng: '', address: '', area: '' });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const deleteMuseum = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.msg === 'Museum deleted successfully') {
                    toast.success('Museum deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                    navigate('/places');
                } else {
                    toast.error('Failed to delete museum');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        const fetchMuseum = async () => {
            if (id) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${id}`);
                    const data = await res.json();
                    setMuseum(data);
                    populateFormFields(data);
                } catch (error) {
                    console.error('Error fetching museum:', error);
                    toast.error('Failed to load museum data');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchMuseum();
    }, [id]);

    const populateFormFields = (museumData) => {
        if (museumData) {
            setName(museumData.name || '');
            setDescription(museumData.description || '');
            setLocation({
                city: museumData.location?.city || '',
                country: museumData.location?.country || '',
                lat: museumData.location?.lat || '',
                lng: museumData.location?.lng || '',
                address: museumData.location?.address || '',
                area: museumData.location?.area || ''
            });
            setStartTime(museumData.openingHours?.startTime ? new Date(museumData.openingHours.startTime).toISOString().slice(11, 16) : '');
            setEndTime(museumData.openingHours?.endTime ? new Date(museumData.openingHours.endTime).toISOString().slice(11, 16) : '');
            setTicketPrices(museumData.ticketPrices ? Object.entries(museumData.ticketPrices).map(([key, value]) => `${key}: ${value}`).join(', ') : '');
            setTags(museumData.tags?.join(',') || '');
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleLocationChange = (field, value) => {
        setLocation(prevLocation => ({ ...prevLocation, [field]: value }));
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location[city]', location.city);
        formData.append('location[country]', location.country);
        formData.append('location[lat]', location.lat);
        formData.append('location[lng]', location.lng);
        formData.append('location[address]', location.address);
        formData.append('location[area]', location.area);
        const openingHoursObject = {
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = createFormData();
        if (!formData) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${id ? id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: formData
            });
            const data = await res.json();
            if (data && data._id) {
                toast.success(`Museum ${id ? 'updated' : 'added'} successfully`);
                window.dispatchEvent(modelModificationEvent);
                //navigate('/places');
            } else {
                toast.error(`Failed to ${id ? 'update' : 'register'} museum`);
            }
        } catch (error) {
            console.error(`Error during museum ${id ? 'update' : 'registration'}:`, error);
            toast.error(`Failed to ${id ? 'update' : 'register'} museum`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {!loading ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <h1 className="col-span-1 md:col-span-2 text-3xl font-bold text-[#330577] mb-4 text-center">
                        {id ? 'Update Museum' : 'Register Museum'}
                    </h1>

                    {/* Left Column */}
                    <div className="flex flex-col space-y-4">
                        <ReusableInput type="text" name="Name" value={name} onChange={e => setName(e.target.value)} />
                        <ReusableInput type="text" name="Description" value={description} onChange={e => setDescription(e.target.value)} />
                        <ReusableInput type="text" name="City" value={location.city} onChange={e => handleLocationChange('city', e.target.value)} />
                        <ReusableInput type="text" name="Country" value={location.country} onChange={e => handleLocationChange('country', e.target.value)} />
                        <ReusableInput type="text" name="Address" value={location.address} onChange={e => handleLocationChange('address', e.target.value)} />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col space-y-4">
                        <ReusableInput type="text" name="Area" value={location.area} onChange={e => handleLocationChange('area', e.target.value)} />
                        <ReusableInput type="number" step="any" name="Latitude" value={location.lat} onChange={e => handleLocationChange('lat', e.target.value)} />
                        <ReusableInput type="number" step="any" name="Longitude" value={location.lng} onChange={e => handleLocationChange('lng', e.target.value)} />
                        <ReusableInput type="text" name="Ticket Prices" value={ticketPrices} onChange={e => setTicketPrices(e.target.value)} />
                        <ReusableInput type="text" name="Tags" value={tags} onChange={e => setTags(e.target.value)} />
                        <input type="file" name="Image" onChange={handleFileChange} className="mt-4" />
                    </div>

                    {/* Buttons Row */}
                    <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-[#330577] hover:bg-[#4a1c96] text-white py-2 px-6 rounded text-base"
                        >
                            {id ? 'Update' : 'Register'}
                        </button>
                        {id && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this museum?')) {
                                        deleteMuseum();
                                    }
                                }}
                                className="bg-[#330577] hover:bg-red-700 text-white py-2 px-6 rounded text-base"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MuseumForm;