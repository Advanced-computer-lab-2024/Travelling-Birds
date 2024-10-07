import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import {modelModificationEvent} from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const HistoricalPlaceForm = ({historicalPlace}) => {
	const [name, setName] = useState(historicalPlace?.name || '');
	const [description, setDescription] = useState(historicalPlace?.description || '');
	const [pictures, setPictures] = useState(historicalPlace?.pictures?.join(',') || '');
	const [location, setLocation] = useState(historicalPlace?.location || '');
	const [openingHours, setOpeningHours] = useState(historicalPlace?.openingHours || '');
	const [ticketPrices, setTicketPrices] = useState(historicalPlace?.ticketPrices ? historicalPlace.ticketPrices.join(', ') : '');
	const [tags, setTags] = useState(historicalPlace?.tags?.join(',') || '');

	const registerHistoricalPlace = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces`, {
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
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to register historical place');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register historical place');
			});
	}
	const updateHistoricalPlace = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`, {
			method: 'PUT',
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
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Historical place updated successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to update historical place');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to update historical place');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				!historicalPlace ? registerHistoricalPlace() : updateHistoricalPlace();
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
				{!historicalPlace ?
					<button type="submit"
					        className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button> :
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Update</button>}
			</form>
		</div>
	);
}

HistoricalPlaceForm.propTypes = {
	historicalPlace: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		description: PropTypes.string,
		pictures: PropTypes.arrayOf(PropTypes.string),
		location: PropTypes.string,
		openingHours: PropTypes.string,
		ticketPrices: PropTypes.arrayOf(PropTypes.number),
		tags: PropTypes.arrayOf(PropTypes.string),
		createdBy: PropTypes.string,
		createdAt: PropTypes.string,
		updatedAt: PropTypes.string,
	})
}

export default HistoricalPlaceForm;