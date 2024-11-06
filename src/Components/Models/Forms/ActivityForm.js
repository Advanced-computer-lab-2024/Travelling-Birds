import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes, { string } from "prop-types";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const ActivityForm = ({ activity }) => {
    const [title, setTitle] = useState(activity?.title || '');
    const [description, setDescription] = useState(activity?.description || '');
    const [date, setDate] = useState(activity?.date || '');
    const [time, setTime] = useState(activity?.time || '');
    const [lat, setLat] = useState(activity?.location?.lat || 0);
    const [lng, setLng] = useState(activity?.location?.lng || 0);
    const [city, setCity] = useState(activity?.location?.city || '');
    const [country, setCountry] = useState(activity?.location?.country || '');
    const [address, setAddress] = useState(activity?.location?.address || '');
    const [area, setArea] = useState(activity?.location?.area || '');
    const [price, setPrice] = useState(activity?.price || 0);
    const [lwBound, setLwBound] = useState(activity?.priceRange?.lwBound || 0);
    const [hiBound, setHiBound] = useState(activity?.priceRange?.hiBound || 0);
    const [category, setCategory] = useState(activity?.category || '');
    const [tags, setTags] = useState(activity?.tags?.join(',') || '');
    const [rating, setRating] = useState(activity?.rating || 0);
    const [specialDiscounts, setSpecialDiscounts] = useState(activity?.specialDiscounts || '');
    const [bookingOpen, setBookingOpen] = useState(activity?.bookingOpen || false);
    const [features, setFeatures] = useState(activity?.features?.join(',') || '');
    const [phone, setPhone] = useState(activity?.contact?.phone || '');
    const [website, setWebsite] = useState(activity?.contact?.website || '');
    const [email, setEmail] = useState(activity?.contact?.email || '');
    const [image, setImage] = useState(null); // State to hold the image file
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const registerActivity = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location[lat]', lat);
        formData.append('location[lng]', lng);
        formData.append('location[city]', city);
        formData.append('location[country]', country);
        formData.append('location[address]', address);
        formData.append('location[area]', area);
        formData.append('price', price);
        formData.append('priceRange[lwBound]', lwBound);
        formData.append('priceRange[hiBound]', hiBound);
        formData.append('category', category);
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('specialDiscounts', specialDiscounts);
        formData.append('bookingOpen', bookingOpen);
        formData.append('rating', rating);
        formData.append('features', features.split(',').map(feature => feature.trim()));
        formData.append('contact[phone]', phone);
        formData.append('contact[website]', website);
        formData.append('contact[email]', email);
        formData.append('createdBy', sessionStorage.getItem('user id'));
        if (image) {
            formData.append('image', image);
        }

        fetch(`${process.env.REACT_APP_BACKEND}/api/activities`, {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?._id) {
                    toast.success('Activity added successfully');
                    navigate('/activities', { replace: true });
                } else {
                    toast.error('Failed to register activity');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Failed to register activity');
            });
    };

    const updateActivity = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location[lat]', lat);
        formData.append('location[lng]', lng);
        formData.append('location[city]', city);
        formData.append('location[country]', country);
        formData.append('location[address]', address);
        formData.append('location[area]', area);
        formData.append('price', price);
        formData.append('priceRange[lwBound]', lwBound);
        formData.append('priceRange[hiBound]', hiBound);
        formData.append('category', category);
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('specialDiscounts', specialDiscounts);
        formData.append('bookingOpen', bookingOpen);
        formData.append('rating', rating);
        formData.append('features', features.split(',').map(feature => feature.trim()));
        formData.append('contact[phone]', phone);
        formData.append('contact[website]', website);
        formData.append('contact[email]', email);
        if (image) {
            formData.append('image', image);
        }

        fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
            method: 'PUT',
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?._id) {
                    toast.success('Activity updated successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to update activity');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Failed to update activity');
            });
    };

    return (
        <div>
            <form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
                e.preventDefault();
                !activity ? registerActivity() : updateActivity();
            }}>
                <h1 className="text-2xl font-bold mb-4">{activity ? 'Update Activity' : 'Register Activity'}</h1>
                <ReusableInput type="text" name="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <ReusableInput type="text" name="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <ReusableInput type="date" name="Date" value={date} onChange={e => setDate(e.target.value)} />
                <ReusableInput type="text" name="Time" value={time} onChange={e => setTime(e.target.value)} />
                <ReusableInput type="number" name="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
                <ReusableInput type="number" name="Longitude" value={lng} onChange={e => setLng(e.target.value)} />
                <ReusableInput type="text" name="City" value={city} onChange={e => setCity(e.target.value)} />
                <ReusableInput type="text" name="Country" value={country} onChange={e => setCountry(e.target.value)} />
                <ReusableInput type="text" name="Address" value={address} onChange={e => setAddress(e.target.value)} />
                <ReusableInput type="text" name="Area" value={area} onChange={e => setArea(e.target.value)} />
                <ReusableInput type="number" name="Price" value={price} onChange={e => setPrice(e.target.value)} />
                <ReusableInput type="number" name="Lower Bound Price" value={lwBound} onChange={e => setLwBound(e.target.value)} />
                <ReusableInput type="number" name="Higher Bound Price" value={hiBound} onChange={e => setHiBound(e.target.value)} />
                <ReusableInput type="text" name="Category" value={category} onChange={e => setCategory(e.target.value)} />
                <ReusableInput type="text" name="Tags" value={tags} onChange={e => setTags(e.target.value)} />
                <ReusableInput type="text" name="Special Discounts" value={specialDiscounts} onChange={e => setSpecialDiscounts(e.target.value)} />
                <ReusableInput type="number" name="Rating" value={rating} onChange={e => setRating(e.target.value)} />
                <ReusableInput type="text" name="Features" value={features} onChange={e => setFeatures(e.target.value)} />
                <ReusableInput type="text" name="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                <ReusableInput type="text" name="Website" value={website} onChange={e => setWebsite(e.target.value)} />
                <ReusableInput type="email" name="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <ReusableInput type="checkbox" name="Booking Open" checked={bookingOpen} onChange={e => setBookingOpen(e.target.checked)} />
                <ReusableInput type="file" name="Image" onChange={handleFileChange} />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                    {activity ? 'Update' : 'Register'}
                </button>
            </form>
        </div>
    );
};

ActivityForm.propTypes = {
    activity: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        location: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
            city: PropTypes.string,
            country: PropTypes.string,
            address: PropTypes.string,
            area: PropTypes.string
        }),
        price: PropTypes.number,
        priceRange: PropTypes.shape({
            lwBound: PropTypes.number.isRequired,
            hiBound: PropTypes.number.isRequired
        }),
        category: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(string),
        specialDiscounts: PropTypes.string,
        bookingOpen: PropTypes.bool,
        rating: PropTypes.number,
        features: PropTypes.arrayOf(string),
        contact: PropTypes.shape({
            phone: PropTypes.string,
            website: PropTypes.string,
            email: PropTypes.string
        })
    })
};

export default ActivityForm;