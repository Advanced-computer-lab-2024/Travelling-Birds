import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const ActivityForm = () => {
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');
	const [price, setPrice] = useState('');
	const [lwBound, setLwBound] = useState('');
	const [hiBound, setHiBound] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('');
	const [rating, setRating] = useState(0);
	const [specialDiscounts, setSpecialDiscounts] = useState('');
	const [bookingOpen, setBookingOpen] = useState(true);

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
				rating,
				specialDiscounts,
				bookingOpen,
				createdBy: sessionStorage.getItem('user id')
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Activity added successfully');
				} else {
					toast.error('Failed to register activity');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register activity');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerActivity();
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
				<ReusableInput type="number" name="Rating" value={rating}
				               onChange={e => setRating(e.target.value)}/>
				<ReusableInput type="text" name="Special Discounts" value={specialDiscounts}
				               onChange={e => setSpecialDiscounts(e.target.value)}/>
				<ReusableInput type="checkbox" name="Booking Open" checked={bookingOpen}
				               onChange={e => setBookingOpen(e.target.checked)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default ActivityForm;