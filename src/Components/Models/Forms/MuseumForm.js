import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import {modelModificationEvent} from "../../../utils/modelModificationEvent";

const MuseumForm = ({museum}) => {
	const [name, setName] = useState(museum?.name || '');
	const [description, setDescription] = useState(museum?.description || '');
	const [pictures, setPictures] = useState(museum?.pictures?.join(',') || '');
	const [location, setLocation] = useState(museum?.location || '');
	const [openingHours, setOpeningHours] = useState(museum?.openingHours || '');
	const [ticketPrices, setTicketPrices] = useState(museum?.ticketPrices ? Object.entries(museum.ticketPrices).map(([key, value]) => `${key}: ${value}`).join(', ') : '');
	const [tags, setTags] = useState(museum?.tags?.join(',') || '');

	const registerMuseum = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/museums`, {
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
				ticketPrices: Object.fromEntries(ticketPrices.split(',').map(price => {
					const [key, value] = price.split(':').map(item => item.trim());
					return [key, parseFloat(value)];
				})),
				tags: tags.split(',').map(tag => tag.trim()),
				createdBy: sessionStorage.getItem('user id')
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Museum added successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to register museum');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register museum');
			});
	}
	const updateMuseum = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
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
				ticketPrices: Object.fromEntries(ticketPrices.split(',').map(price => {
					const [key, value] = price.split(':').map(item => item.trim());
					return [key, parseFloat(value)];
				})),
				tags: tags.split(',').map(tag => tag.trim()),
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Museum updated successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to update museum');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to update museum');
			});
	}
	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				!museum ? registerMuseum() : updateMuseum();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Museum</h1>
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
				{!museum ?
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
					:
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Update</button>
				}
			</form>
		</div>
	);
}

export default MuseumForm;