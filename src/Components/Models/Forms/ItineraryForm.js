import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const ItineraryForm = () => {
	const [activities, setActivities] = useState('');
	const [locations, setLocations] = useState('');
	const [timeline, setTimeline] = useState('');
	const [duration, setDuration] = useState('');
	const [language, setLanguage] = useState('');
	const [price, setPrice] = useState('');
	const [availableDates, setAvailableDates] = useState('');
	const [accessibility, setAccessibility] = useState('');
	const [pickupLocation, setPickupLocation] = useState('');
	const [dropoffLocation, setDropoffLocation] = useState('');
	const [preferences, setPreferences] = useState('');
	const [isBooked, setIsBooked] = useState(false);

	const registerItinerary = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				activities: activities.split(',').map(id => id.trim()),
				locations: locations.split(',').map(loc => loc.trim()),
				timeline,
				duration,
				language,
				price: parseFloat(price),
				availableDates: availableDates.split(',').map(date => new Date(date.trim())),
				accessibility,
				pickupLocation,
				dropoffLocation,
				preferences,
				isBooked,
				createdBy: sessionStorage.getItem('user id')
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Itinerary added successfully');
				} else {
					toast.error('Failed to register itinerary');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register itinerary');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerItinerary();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Itinerary</h1>
				<ReusableInput type="text" name="Activities" value={activities}
				               onChange={e => setActivities(e.target.value)}/>
				<ReusableInput type="text" name="Locations" value={locations}
				               onChange={e => setLocations(e.target.value)}/>
				<ReusableInput type="text" name="Timeline" value={timeline}
				               onChange={e => setTimeline(e.target.value)}/>
				<ReusableInput type="text" name="Duration" value={duration}
				               onChange={e => setDuration(e.target.value)}/>
				<ReusableInput type="text" name="Language" value={language}
				               onChange={e => setLanguage(e.target.value)}/>
				<ReusableInput type="number" name="Price" value={price}
				               onChange={e => setPrice(e.target.value)}/>
				<ReusableInput type="text" name="Available Dates" value={availableDates}
				               onChange={e => setAvailableDates(e.target.value)}/>
				<ReusableInput type="text" name="Accessibility" value={accessibility}
				               onChange={e => setAccessibility(e.target.value)}/>
				<ReusableInput type="text" name="Pickup Location" value={pickupLocation}
				               onChange={e => setPickupLocation(e.target.value)}/>
				<ReusableInput type="text" name="Dropoff Location" value={dropoffLocation}
				               onChange={e => setDropoffLocation(e.target.value)}/>
				<ReusableInput type="text" name="Preferences" value={preferences}
				               onChange={e => setPreferences(e.target.value)}/>
				<ReusableInput type="checkbox" name="Is Booked" checked={isBooked}
				               onChange={e => setIsBooked(e.target.checked)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default ItineraryForm;