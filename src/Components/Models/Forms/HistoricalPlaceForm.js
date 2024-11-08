import { useState, useEffect } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const HistoricalPlaceForm = () => {
    const { id } = useParams(); // Use params to check if we are in edit mode
    const [loading, setLoading] = useState(true);
    const [historicalPlace, setHistoricalPlace] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const deleteHistoricalPlace = () => {
        fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((data) => {
                if (data?.msg === 'Historical place deleted successfully') {
                    toast.success('Historical place deleted successfully');
                    window.dispatchEvent(modelModificationEvent);
                    navigate('/places');
                } else {
                    toast.error('Failed to delete historical place');
                }
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        const fetchHistoricalPlace = async () => {
            if (id) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${id}`);
                    const data = await res.json();
                    setHistoricalPlace(data);
                    populateFormFields(data);
                } catch (error) {
                    console.error('Error fetching historical place:', error);
                    toast.error('Failed to load historical place data');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchHistoricalPlace();
    }, [id]);

    const populateFormFields = (placeData) => {
        if (placeData) {
            setName(placeData.name || '');
            setDescription(placeData.description || '');
            setStartTime(placeData.openingHours?.startTime ? new Date(placeData.openingHours.startTime).toISOString().slice(11, 16) : '');
            setEndTime(placeData.openingHours?.endTime ? new Date(placeData.openingHours.endTime).toISOString().slice(11, 16) : '');
            setLat(placeData.location?.lat || '');
            setLng(placeData.location?.lng || '');
            setCity(placeData.location?.city || '');
            setCountry(placeData.location?.country || '');
            setAddress(placeData.location?.address || '');
            setArea(placeData.location?.area || '');
            setTicketPrices(placeData.ticketPrices?.join(',') || '');
            setTags(placeData.tags?.join(',') || '');
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('openingHours[startTime]', `${startTime}:00`);
        formData.append('openingHours[endTime]', `${endTime}:00`);
        formData.append('location[lat]', lat);
        formData.append('location[lng]', lng);
        formData.append('location[city]', city);
        formData.append('location[country]', country);
        formData.append('location[address]', address);
        formData.append('location[area]', area);
        formData.append('ticketPrices', ticketPrices.split(',').map(price => parseFloat(price.trim())));
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('createdBy', sessionStorage.getItem('user id'));

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
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${id ? id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: formData
            });
            const data = await res.json();
            if (data && data._id) {
                toast.success(`Historical place ${id ? 'updated' : 'added'} successfully`);
                window.dispatchEvent(modelModificationEvent);
                navigate('/places');
            } else {
                toast.error(`Failed to ${id ? 'update' : 'register'} historical place`);
            }
        } catch (error) {
            console.error(`Error during historical place ${id ? 'update' : 'registration'}:`, error);
            toast.error(`Failed to ${id ? 'update' : 'register'} historical place`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {!loading ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <h1 className="col-span-1 md:col-span-2 text-3xl font-bold text-[#330577] mb-4 text-center">
                        {id ? 'Update Historical Place' : 'Register Historical Place'}
                    </h1>

                    {/* Left Column */}
                    <div className="flex flex-col space-y-4">
                        <ReusableInput type="text" name="Name" value={name} onChange={e => setName(e.target.value)} />
                        <ReusableInput type="text" name="Description" value={description} onChange={e => setDescription(e.target.value)} />
                        <ReusableInput type="text" name="City" value={city} onChange={e => setCity(e.target.value)} />
                        <ReusableInput type="text" name="Country" value={country} onChange={e => setCountry(e.target.value)} />
                        <ReusableInput type="text" name="Address" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col space-y-4">
                        <ReusableInput type="text" name="Area" value={area} onChange={e => setArea(e.target.value)} />
                        <ReusableInput type="number" step="any" name="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
                        <ReusableInput type="number" step="any" name="Longitude" value={lng} onChange={e => setLng(e.target.value)} />
                        <ReusableInput type="text" name="Ticket Prices (Comma-separated)" value={ticketPrices} onChange={e => setTicketPrices(e.target.value)} />
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
                                    if (window.confirm('Are you sure you wish to delete this historical place?')) {
                                        deleteHistoricalPlace();
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

HistoricalPlaceForm.propTypes = {
    historicalPlace: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        location: PropTypes.shape({
            city: PropTypes.string,
            country: PropTypes.string,
            lat: PropTypes.number,
            lng: PropTypes.number,
            address: PropTypes.string,
            area: PropTypes.string,
        }),
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
    })
};

export default HistoricalPlaceForm;