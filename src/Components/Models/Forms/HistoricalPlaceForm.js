import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

const HistoricalPlaceForm = ({historicalPlace: initialHistoricalPlace, historicalPlaces, setHistoricalPlaces}) => {
	const [name, setName] = useState(initialHistoricalPlace?.name || '');
	const [description, setDescription] = useState(initialHistoricalPlace?.description || '');
	const [startTime, setStartTime] = useState(initialHistoricalPlace?.openingHours?.startTime || '');
	const [endTime, setEndTime] = useState(initialHistoricalPlace?.openingHours?.endTime || '');
	const [lat, setLat] = useState(initialHistoricalPlace?.location?.lat || '');
	const [lng, setLng] = useState(initialHistoricalPlace?.location?.lng || '');
	const [city, setCity] = useState(initialHistoricalPlace?.location?.city || '');
	const [country, setCountry] = useState(initialHistoricalPlace?.location?.country || '');
	const [address, setAddress] = useState(initialHistoricalPlace?.location?.address || '');
	const [area, setArea] = useState(initialHistoricalPlace?.location?.area || '');
	const [ticketPrices, setTicketPrices] = useState(initialHistoricalPlace?.ticketPrices?.join(',') || '');
	const [tags, setTags] = useState(initialHistoricalPlace?.tags?.join(',') || '');
	const [activities, setActivities] = useState(initialHistoricalPlace?.activities ? Object.values(initialHistoricalPlace.activities).map(activity => activity._id).join(',') : '');
	const [image, setImage] = useState(null);

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
		formData.append('activities', activities.split(',').map(id => id.trim()));
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${initialHistoricalPlace ? initialHistoricalPlace._id : ''}`, {
				method: initialHistoricalPlace ? 'PUT' : 'POST',
				body: formData
			});
			const data = await res.json();
			if (data?._id) {
				toast.success(`Historical place ${initialHistoricalPlace ? 'updated' : 'added'} successfully`);
				if (initialHistoricalPlace) {
					const updatedHistoricalPlaces = historicalPlaces.map(place => place._id === data._id ? data : place);
					setHistoricalPlaces(updatedHistoricalPlaces);
				} else {
					setHistoricalPlaces([...historicalPlaces, data]);
				}
			} else {
				toast.error(`Failed to ${initialHistoricalPlace ? 'update' : 'register'} historical place`);
			}
		} catch (error) {
			console.error(`Error during historical place ${initialHistoricalPlace ? 'update' : 'registration'}:`, error);
			toast.error(`Failed to ${initialHistoricalPlace ? 'update' : 'register'} historical place`);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
				<h1 className="col-span-1 md:col-span-3 text-3xl font-bold text-[#330577] mb-4 text-center">
					{initialHistoricalPlace ? 'Update Historical Place' : 'Register Historical Place'}
				</h1>

				{/* Column 1 */}
				<div className="flex flex-col space-y-4">
					<ReusableInput type="text" name="Name" value={name} onChange={e => setName(e.target.value)}/>
					<ReusableInput type="text" name="Description" value={description}
					               onChange={e => setDescription(e.target.value)}/>
					<ReusableInput type="text" name="City" value={city} onChange={e => setCity(e.target.value)}/>
					<ReusableInput type="text" name="Country" value={country}
					               onChange={e => setCountry(e.target.value)}/>
					<ReusableInput type="text" name="Address" value={address}
					               onChange={e => setAddress(e.target.value)}/>
				</div>

				{/* Column 2 */}
				<div className="flex flex-col space-y-4">
					<ReusableInput type="text" name="Area" value={area} onChange={e => setArea(e.target.value)}/>
					<ReusableInput type="number" step="any" name="Latitude" value={lat}
					               onChange={e => setLat(e.target.value)}/>
					<ReusableInput type="number" step="any" name="Longitude" value={lng}
					               onChange={e => setLng(e.target.value)}/>
					<ReusableInput type="text" name="Ticket Prices (Comma-separated)" value={ticketPrices}
					               onChange={e => setTicketPrices(e.target.value)}/>
					<ReusableInput type="text" name="Tags" value={tags} onChange={e => setTags(e.target.value)}/>
				</div>

				{/* Column 3 */}
				<div className="flex flex-col space-y-4">
					<ReusableInput type="text" name="Activities (Comma-separated IDs)" value={activities}
					               onChange={e => setActivities(e.target.value)}/>
					<ReusableInput type="time" name="Opening Hours Start Time" value={startTime}
					               onChange={e => setStartTime(e.target.value)}/>
					<ReusableInput type="time" name="Opening Hours End Time" value={endTime}
					               onChange={e => setEndTime(e.target.value)}/>
					<input type="file" name="Image" onChange={handleFileChange} className="mt-4"/>
				</div>

				{/* Buttons Row */}
				<div className="col-span-1 md:col-span-3 flex justify-between mt-4">
					<button
						type="submit"
						className="bg-[#330577] hover:bg-[#4a1c96] text-white py-2 px-6 rounded text-base"
					>
						{initialHistoricalPlace ? 'Update' : 'Register'}
					</button>
				</div>
			</form>
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
		activities: PropTypes.arrayOf(PropTypes.string),
		image: PropTypes.shape({
			data: PropTypes.object,
			contentType: PropTypes.string,
		}),
		createdBy: PropTypes.string,
	})
};

export default HistoricalPlaceForm;