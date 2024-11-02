import { useState } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const ItineraryForm = ({ itinerary }) => {
    const [activities, setActivities] = useState(itinerary?.activities?.join(',') || '');
    const [locations, setLocations] = useState(itinerary?.locations?.join(',') || '');
    const [timeline, setTimeline] = useState(itinerary?.timeline || '');
    const [duration, setDuration] = useState(itinerary?.duration || '');
    const [language, setLanguage] = useState(itinerary?.language || '');
    const [price, setPrice] = useState(itinerary?.price || '');
    const [availableDates, setAvailableDates] = useState(itinerary?.availableDates?.map(date => new Date(date).toLocaleDateString()).join(', ') || '');
    const [accessibility, setAccessibility] = useState(itinerary?.accessibility || '');
    const [pickupLocation, setPickupLocation] = useState(itinerary?.pickupLocation || '');
    const [dropoffLocation, setDropoffLocation] = useState(itinerary?.dropoffLocation || '');
    const [preferences, setPreferences] = useState(itinerary?.preferences || '');
    const [isBooked, setIsBooked] = useState(itinerary?.isBooked || false);
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append('activities', activities.split(',').map(id => id.trim()));
        formData.append('locations', locations.split(',').map(loc => loc.trim()));
        formData.append('timeline', timeline);
        formData.append('duration', duration);
        formData.append('language', language);
        formData.append('price', parseFloat(price));
        formData.append('availableDates', availableDates.split(',').map(date => new Date(date.trim())));
        formData.append('accessibility', accessibility);
        formData.append('pickupLocation', pickupLocation);
        formData.append('dropoffLocation', dropoffLocation);
        formData.append('preferences', preferences);
        formData.append('isBooked', isBooked);
        formData.append('createdBy', sessionStorage.getItem('user id'));
        if (image) {
            formData.append('image', image);
        }
        return formData;
    };

    const registerItinerary = () => {
        const formData = createFormData();
        fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data?._id) {
                    toast.success('Itinerary added successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to register itinerary');
                }
            })
            .catch(error => {
                console.log(error);
                toast.error('Failed to register itinerary');
            });
    };

    const updateItinerary = () => {
        const formData = createFormData();
        fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data?._id) {
                    toast.success('Itinerary updated successfully');
                    window.dispatchEvent(modelModificationEvent);
                } else {
                    toast.error('Failed to update itinerary');
                }
            })
            .catch(error => {
                console.log(error);
                toast.error('Failed to update itinerary');
            });
    };

    return (
        <div>
            <form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
                e.preventDefault();
                !itinerary ? registerItinerary() : updateItinerary();
            }}>
                <h1 className="text-2xl font-bold mb-4">Register Itinerary</h1>
                <ReusableInput type="text" name="Activities" value={activities} onChange={e => setActivities(e.target.value)} />
                <ReusableInput type="text" name="Locations" value={locations} onChange={e => setLocations(e.target.value)} />
                <ReusableInput type="text" name="Timeline" value={timeline} onChange={e => setTimeline(e.target.value)} />
                <ReusableInput type="text" name="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
                <ReusableInput type="text" name="Language" value={language} onChange={e => setLanguage(e.target.value)} />
                <ReusableInput type="number" name="Price" value={price} onChange={e => setPrice(e.target.value)} />
                <ReusableInput type="text" name="Available Dates" value={availableDates} onChange={e => setAvailableDates(e.target.value)} />
                <ReusableInput type="text" name="Accessibility" value={accessibility} onChange={e => setAccessibility(e.target.value)} />
                <ReusableInput type="text" name="Pickup Location" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} />
                <ReusableInput type="text" name="Dropoff Location" value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} />
                <ReusableInput type="text" name="Preferences" value={preferences} onChange={e => setPreferences(e.target.value)} />
                <ReusableInput type="checkbox" name="Is Booked" checked={isBooked} onChange={e => setIsBooked(e.target.checked)} />
                <input type="file" name="Image" onChange={handleFileChange} className="mt-4" />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                    {itinerary ? 'Update' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default ItineraryForm;