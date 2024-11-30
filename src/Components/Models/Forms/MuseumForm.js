import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const MuseumForm = ({initialMuseum, museums, setMuseums}) => {
	const [name, setName] = useState(initialMuseum?.name || '');
	const [description, setDescription] = useState(initialMuseum?.description || '');
	const [location, setLocation] = useState(initialMuseum?.location || {
		city: '',
		country: '',
		lat: '',
		lng: '',
		address: '',
		area: ''
	});
	const [startTime, setStartTime] = useState(initialMuseum?.openingHours?.startTime ? new Date(initialMuseum.openingHours.startTime).toISOString().slice(11, 16) : '');
	const [endTime, setEndTime] = useState(initialMuseum?.openingHours?.endTime ? new Date(initialMuseum.openingHours.endTime).toISOString().slice(11, 16) : '');
	const [ticketPrices, setTicketPrices] = useState(initialMuseum?.ticketPrices ? Object.entries(initialMuseum.ticketPrices).map(([key, value]) => `${key}: ${value}`).join(', ') : '');
	const [tags, setTags] = useState(initialMuseum?.tags?.join(',') || '');
	const [activities, setActivities] = useState(initialMuseum?.activities ? Object.values(initialMuseum.activities).map(activity => activity._id).join(',') : '');
	const [image, setImage] = useState(null);

	const deleteMuseum = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${initialMuseum._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.msg === 'Museum deleted successfully') {
					toast.success('Museum deleted successfully');
					setMuseums(museums.filter(m => m._id !== initialMuseum._id));
				} else {
					toast.error('Failed to delete museum');
				}
			}).catch((error) => {
			console.log(error);
		});
	};

	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleLocationChange = (field, value) => {
		setLocation(prevLocation => ({...prevLocation, [field]: value}));
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
		formData.append('activities', activities.split(',').map(id => id.trim())); // Add activities to form data
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${initialMuseum ? initialMuseum._id : ''}`, {
				method: initialMuseum ? 'PUT' : 'POST',
				body: formData
			});
			const data = await res.json();
			if (data && data._id) {
				toast.success(`Museum ${initialMuseum ? 'updated' : 'added'} successfully`);
				if (initialMuseum) {
					setMuseums(museums.map(m => m._id === data._id ? data : m));
				} else {
					setMuseums([...museums, data]);
				}
			} else {
				toast.error(`Failed to ${initialMuseum ? 'update' : 'register'} museum`);
			}
		} catch (error) {
			console.error(`Error during museum ${initialMuseum ? 'update' : 'registration'}:`, error);
			toast.error(`Failed to ${initialMuseum ? 'update' : 'register'} museum`);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
				<h1 className="col-span-1 md:col-span-3 text-3xl font-bold text-[#330577] mb-4 text-center">
					{initialMuseum? 'Update Museum' : 'Register Museum'}
				</h1>

				{/* Column 1 */}
				<div className="flex flex-col space-y-4">
					<ReusableInput type="text" name="Name" value={name} onChange={e => setName(e.target.value)}/>
					<ReusableInput type="text" name="Description" value={description}
					               onChange={e => setDescription(e.target.value)}/>
					<ReusableInput type="text" name="City" value={location.city}
					               onChange={e => handleLocationChange('city', e.target.value)}/>
					<ReusableInput type="text" name="Country" value={location.country}
					               onChange={e => handleLocationChange('country', e.target.value)}/>
					<ReusableInput type="text" name="Address" value={location.address}
					               onChange={e => handleLocationChange('address', e.target.value)}/>
				</div>

				{/* Column 2 */}
				<div className="flex flex-col space-y-4">
					<ReusableInput type="text" name="Area" value={location.area}
					               onChange={e => handleLocationChange('area', e.target.value)}/>
					<ReusableInput type="number" step="any" name="Latitude" value={location.lat}
					               onChange={e => handleLocationChange('lat', e.target.value)}/>
					<ReusableInput type="number" step="any" name="Longitude" value={location.lng}
					               onChange={e => handleLocationChange('lng', e.target.value)}/>
					<ReusableInput type="text" name="Ticket Prices" value={ticketPrices}
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
						{initialMuseum ? 'Update' : 'Register'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default MuseumForm;