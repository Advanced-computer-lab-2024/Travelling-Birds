import {useEffect, useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import PropTypes from "prop-types";

const ItineraryForm = ({itinerary: initialItinerary, itineraries, setItineraries}) => {
	const {id} = useParams();
	const [itinerary, setItinerary] = useState(initialItinerary);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
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
	const [active, setActive] = useState(true);
	const [image, setImage] = useState(null);

	useEffect(() => {
		if (!initialItinerary && id) {
			const fetchItinerary = async () => {
				try {
					const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${id}`);
					const data = await res.json();
					setItinerary(data);
					setFormFields(data);
				} catch (error) {
					console.error('Error fetching itinerary:', error);
					toast.error('Failed to load itinerary data');
				}
			};
			fetchItinerary().then();
		} else {
			setFormFields(initialItinerary);
		}
	}, [initialItinerary, id]);

	const setFormFields = (itineraryData) => {
		if (itineraryData) {
			setTitle(itineraryData.title || '');
			setDescription(itineraryData.description || '');
			setActivities(itineraryData.activities?.join(',') || '');
			setLocations(itineraryData.locations?.join(',') || '');
			setTimeline(itineraryData.timeline || '');
			setDuration(itineraryData.duration || '');
			setLanguage(itineraryData.language || '');
			setPrice(itineraryData.price || '');
			setAvailableDates(itineraryData.availableDates?.map(date => new Date(date).toISOString().split('T')[0]).join(', ') || '');
			setAccessibility(itineraryData.accessibility || '');
			setPickupLocation(itineraryData.pickupLocation || '');
			setDropoffLocation(itineraryData.dropoffLocation || '');
			setPreferences(itineraryData.preferences || '');
			setActive(itineraryData.active || true);
		}
	};

	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	const createFormData = () => {
		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		//formData.append('activities', JSON.stringify(activities.split(',').map(id => id.trim())));
		formData.append('activities', activities.split(',').map(id => id.trim()));
		formData.append('locations', locations.split(',').map(loc => loc.trim()));
		formData.append('timeline', timeline);
		formData.append('duration', duration);
		formData.append('language', language);
		formData.append('price', parseFloat(price));
		availableDates.split(',').forEach(date => {
			const parsedDate = new Date(date.trim());
			if (!isNaN(parsedDate)) {
				formData.append('availableDates', parsedDate.toISOString());
			}
		});
		formData.append('accessibility', accessibility);
		formData.append('pickupLocation', pickupLocation);
		formData.append('dropoffLocation', dropoffLocation);
		formData.append('preferences', preferences);
		formData.append('createdBy', sessionStorage.getItem('user id'));
		if (image) {
			formData.append('image', image);
		}
		formData.append('active', active);
		return formData;
	};

	const registerItinerary = () => {
		const formData = createFormData();
		console.log('formData:', formData.get('activities'));
		fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries`, {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data?._id) {
					toast.success('Itinerary added successfully');
					setItineraries([...itineraries, data]);
				} else {
					toast.error('Failed to register itinerary');
				}
			})
			.catch(error => {
				console.error('Error occurred:', error);
				toast.error('Failed to register itinerary');
			});
	};

	const updateItinerary = () => {
		const formData = createFormData();
		console.log('formData:', formData);
		fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
			method: 'PUT',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data?._id) {
					toast.success('Itinerary updated successfully');
					setItineraries(itineraries.map(i => i._id === data._id ? data : i));
				} else {
					toast.error('Failed to update itinerary');
				}
			})
			.catch(error => {
				console.error('Error occurred:', error);
				toast.error('Failed to update itinerary');
			});
	};

	const deleteItinerary = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'Itinerary deleted successfully') {
					toast.success('Itinerary deleted successfully');
					setItineraries(itineraries.filter(i => i._id !== itinerary._id));
				} else {
					toast.error('Failed to delete itinerary');
				}
			}).catch((error) => {
			console.log(error);
		});
	};

	return (
		<div className="max-w-[100rem] mx-auto p-8 bg-white shadow rounded">
			<h1 className="text-3xl font-bold text-[#330577] mb-6 text-center">{itinerary ? 'Update Itinerary' : 'Register Itinerary'}</h1>
			<form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={(e) => {
				e.preventDefault();
				!itinerary ? registerItinerary() : updateItinerary();
			}}>
				<ReusableInput type="text" name="Title" value={title} onChange={e => setTitle(e.target.value)}/>
				<ReusableInput type="text" name="Description" value={description}
				               onChange={e => setDescription(e.target.value)}/>
				<ReusableInput type="text" name="Activities" value={activities}
				               onChange={e => setActivities(e.target.value)}/>
				<ReusableInput type="text" name="Locations" value={locations}
				               onChange={e => setLocations(e.target.value)}/>
				<ReusableInput type="text" name="Language" value={language}
				               onChange={e => setLanguage(e.target.value)}/>
				<ReusableInput type="number" name="Price" value={price} onChange={e => setPrice(e.target.value)}/>
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
				<ReusableInput type="file" name="Image" onChange={handleFileChange}/>

				<div className="col-span-1 md:col-span-2 flex justify-between items-center mt-6">
					<button type="submit" className="bg-[#330577] text-white py-2 px-4 rounded">
						{itinerary ? 'Update' : 'Register'}
					</button>
					{itinerary && (
						<button
							onClick={() => {
								if (window.confirm('Are you sure you wish to delete this item?')) {
									deleteItinerary();
								}
							}}
							className="bg-[#330577] hover:bg-red-700 text-white py-2 px-4 rounded"
						>
							Delete Itinerary
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

ItineraryForm.propTypes = {
	itinerary: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		activities: PropTypes.arrayOf(PropTypes.string),
		locations: PropTypes.arrayOf(PropTypes.string),
		timeline: PropTypes.string,
		duration: PropTypes.string,
		language: PropTypes.string,
		price: PropTypes.number,
		availableDates: PropTypes.arrayOf(PropTypes.string),
		accessibility: PropTypes.string,
		pickupLocation: PropTypes.string,
		dropoffLocation: PropTypes.string,
		preferences: PropTypes.string,
		image: PropTypes.shape({
			data: PropTypes.object,
			contentType: PropTypes.string
		})
	})
};

export default ItineraryForm;