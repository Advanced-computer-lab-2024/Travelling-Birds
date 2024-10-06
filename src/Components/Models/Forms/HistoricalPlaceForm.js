import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const HistoricalPlaceForm = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [pictures, setPictures] = useState('');
	const [location, setLocation] = useState('');
	const [openingHours, setOpeningHours] = useState('');
	const [ticketPrices, setTicketPrices] = useState('');
	const [tags, setTags] = useState('');

	const registerHistoricalPlace = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/historical-places`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				description,
				pictures: pictures.split(',').map(pic => pic.trim()),
				location,
				openingHours,
				ticketPrices: ticketPrices.split(',').map(price => parseFloat(price.trim())),
				tags: tags.split(',').map(tag => tag.trim()),
				createdBy: sessionStorage.getItem('user id')
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Historical place added successfully');
				} else {
					toast.error('Failed to register historical place');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register historical place');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerHistoricalPlace();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Historical Place</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				<ReusableInput type="text" name="Description" value={description}
				               onChange={e => setDescription(e.target.value)}/>
				<ReusableInput type="text" name="Pictures" value={pictures}
				               onChange={e => setPictures(e.target.value)}/>
				<ReusableInput type="text" name="Location" value={location}
				               onChange={e => setLocation(e.target.value)}/>
				<ReusableInput type="text" name="Opening Hours" value={openingHours}
				               onChange={e => setOpeningHours(e.target.value)}/>
				<ReusableInput type="text" name="Ticket Prices" value={ticketPrices}
				               onChange={e => setTicketPrices(e.target.value)}/>
				<ReusableInput type="text" name="Tags" value={tags}
				               onChange={e => setTags(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default HistoricalPlaceForm;