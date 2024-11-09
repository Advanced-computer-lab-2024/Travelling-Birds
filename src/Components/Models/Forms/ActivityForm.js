import { useState, useEffect } from "react";
import ReusableInput from "../../ReusableInput";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes, { string } from "prop-types";
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const ActivityForm = ({ activity: initialActivity }) => {
	const { id } = useParams();
	const [activity, setActivity] = useState(initialActivity);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [lat, setLat] = useState(0);
	const [lng, setLng] = useState(0);
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [area, setArea] = useState('');
	const [price, setPrice] = useState(0);
	const [lwBound, setLwBound] = useState(0);
	const [hiBound, setHiBound] = useState(0);
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('');
	const [rating, setRating] = useState(0);
	const [specialDiscounts, setSpecialDiscounts] = useState('');
	const [bookingOpen, setBookingOpen] = useState(false);
	const [features, setFeatures] = useState('');
	const [phone, setPhone] = useState('');
	const [website, setWebsite] = useState('');
	const [email, setEmail] = useState('');
	const [image, setImage] = useState(null);

	const deleteActivity = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'activity deleted successfully') {
					toast.success('Activity deleted successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to delete activity');
				}
			}).catch((error) => {
			console.log(error);
		});
	};

	useEffect(() => {
		if (!initialActivity && id) {
			const fetchActivity = async () => {
				try {
					const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${id}`);
					const data = await res.json();
					setActivity(data);
					setFormFields(data);
				} catch (error) {
					console.error('Error fetching activity:', error);
					toast.error('Failed to load activity data');
				}
			};
			fetchActivity();
		} else {
			setFormFields(initialActivity);
		}
	}, [initialActivity, id]);

	const setFormFields = (activityData) => {
		if (activityData) {
			setTitle(activityData.title || '');
			setDescription(activityData.description || '');
			setDate(activityData.date || '');
			setTime(activityData.time || '');
			setLat(activityData.location?.lat || 0);
			setLng(activityData.location?.lng || 0);
			setCity(activityData.location?.city || '');
			setCountry(activityData.location?.country || '');
			setAddress(activityData.location?.address || '');
			setArea(activityData.location?.area || '');
			setPrice(activityData.price || 0);
			setLwBound(activityData.priceRange?.lwBound || 0);
			setHiBound(activityData.priceRange?.hiBound || 0);
			setCategory(activityData.category || '');
			setTags(activityData.tags?.join(',') || '');
			setRating(activityData.rating || 0);
			setSpecialDiscounts(activityData.specialDiscounts || '');
			setBookingOpen(activityData.bookingOpen || false);
			setFeatures(activityData.features?.join(',') || '');
			setPhone(activityData.contact?.phone || '');
			setWebsite(activityData.contact?.website || '');
			setEmail(activityData.contact?.email || '');
		}
	};

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
					//navigate('/activities', { replace: true });
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
					//navigate('/activities', { replace: true });
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
		<div className="max-w-[100rem] mx-auto p-8 bg-white shadow rounded">
			<h1 className="text-3xl font-bold text-[#330577] mb-6 text-center">{activity ? 'Update Activity' : 'Register Activity'}</h1>
			<form className="grid grid-cols-1 md:grid-cols-4 gap-6" onSubmit={(e) => {
				e.preventDefault();
				!activity ? registerActivity() : updateActivity();
			}}>
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
				<div className="flex items-center mt-6">
					<button type="submit" className="btn btn-primary w-40 mx-auto">
						{activity ? 'Update' : 'Register'}
					</button>
					{activity && (
						<button
							onClick={(e) => {
								e.preventDefault();
								if (window.confirm('Are you sure you wish to delete this item?')) {
									deleteActivity();
								}
							}}
							className="btn btn-danger w-40 mx-auto"
						>
							Delete Activity
						</button>
					)}
				</div>
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