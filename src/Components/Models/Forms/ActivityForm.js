import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import PropTypes, {string} from "prop-types";
import {modelModificationEvent} from "../../../utils/modelModificationEvent";
import {sessionStorageEvent} from "../../../utils/sessionStorageEvent";

const ActivityForm = ({activity}) => {
	const [date, setDate] = useState(activity?.date || '');
	const [time, setTime] = useState(activity?.time || '');
	const [lat, setLat] = useState(activity?.location?.lat || 0);
	const [lng, setLng] = useState(activity?.location?.lng || 0);
	const [price, setPrice] = useState(activity?.price || 0);
	const [lwBound, setLwBound] = useState(activity?.priceRange?.lwBound || 0);
	const [hiBound, setHiBound] = useState(activity?.priceRange?.hiBound || 0);
	const [category, setCategory] = useState(activity?.category || '');
	const [tags, setTags] = useState(activity?.tags?.join(',') || '');
	const [specialDiscounts, setSpecialDiscounts] = useState(activity?.specialDiscounts || '');
	const [bookingOpen, setBookingOpen] = useState(activity?.bookingOpen || false);
	const navigate = useNavigate();

	const registerActivity = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/activities`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				date,
				time,
				location: {lat, lng},
				price,
				priceRange: {lwBound, hiBound},
				category,
				tags: tags.split(',').map(tag => tag.trim()),
				specialDiscounts,
				bookingOpen,
				createdBy: sessionStorage.getItem('user id')
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Activity added successfully');
					navigate('/activities', {replace: true});
				} else {
					toast.error('Failed to register activity');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register activity');
			});
	}
	const updateActivity = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				date,
				time,
				location: {lat, lng},
				price,
				priceRange: {lwBound, hiBound},
				category,
				tags: tags.split(',').map(tag => tag.trim()),
				specialDiscounts,
				bookingOpen,
			})
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
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				!activity ? registerActivity() : updateActivity();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Activity</h1>
				<ReusableInput type="text" name="Date" value={date}
				               onChange={e => setDate(e.target.value)}/>
				<ReusableInput type="text" name="Time" value={time}
				               onChange={e => setTime(e.target.value)}/>
				<ReusableInput type="number" name="Latitude" value={lat}
				               onChange={e => setLat(e.target.value)}/>
				<ReusableInput type="number" name="Longitude" value={lng}
				               onChange={e => setLng(e.target.value)}/>
				<ReusableInput type="number" name="Price" value={price}
				               onChange={e => setPrice(e.target.value)}/>
				<ReusableInput type="number" name="Lower Bound Price" value={lwBound}
				               onChange={e => setLwBound(e.target.value)}/>
				<ReusableInput type="number" name="Higher Bound Price" value={hiBound}
				               onChange={e => setHiBound(e.target.value)}/>
				<ReusableInput type="text" name="Category" value={category}
				               onChange={e => setCategory(e.target.value)}/>
				<ReusableInput type="text" name="Tags" value={tags}
				               onChange={e => setTags(e.target.value)}/>
				<ReusableInput type="text" name="Special Discounts" value={specialDiscounts}
				               onChange={e => setSpecialDiscounts(e.target.value)}/>
				<ReusableInput type="checkbox" name="Booking Open" checked={bookingOpen}
				               onChange={e => setBookingOpen(e.target.checked)}/>
				{!activity ?
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
					:
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Update</button>}
			</form>
		</div>
	);
}

ActivityForm.propTypes = {
	activity: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		time: PropTypes.string.isRequired,
		location: PropTypes.shape({
			lat: PropTypes.number.isRequired,
			lng: PropTypes.number.isRequired
		}),
		price: PropTypes.number,
		priceRange: PropTypes.shape({
			lwBound: PropTypes.number.isRequired,
			hiBound: PropTypes.number.isRequired
		}),
		category: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(string),
		specialDiscounts: PropTypes.string,
		bookingOpen: PropTypes.bool
	})
}

export default ActivityForm;