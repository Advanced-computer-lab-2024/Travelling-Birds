import {useEffect, useState} from 'react';
import Popup from "reactjs-popup";
import { MuseumForm } from "../Forms";
import { toast } from "react-toastify";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { modelModificationEvent } from "../../../utils/modelModificationEvent";

const MuseumDisplay = ({ museum }) => {
	const [showMore, setShowMore] = useState(false);
	const descriptionPreview = museum.description ? museum.description.substring(0, 100) : '';
	useEffect(() => {
		console.log(museum.ticketPrices);
	}, [museum.ticketPrices]);

	const deleteMuseum = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'Museum deleted successfully') {
					toast.success('Museum deleted successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to delete museum');
				}
			}).catch((error) => {
			console.log(error);
		});
	}

	return (
		<div className="bg-white rounded-xl shadow-md relative">
			<div className="p-4">
				<h3 className="text-xl font-bold">{museum.name}</h3>


				<div className="mb-5">{showMore ? museum.description : descriptionPreview}</div>

				{museum.description && (
					<button
						onClick={() => setShowMore(prevState => !prevState)}
						className="text-indigo-500 mb-5 hover:text-indigo-600"
					>
						{showMore ? 'Less' : 'More'}
					</button>
				)}

				<div className="text-orange-700 mb-3">
					<FaMapMarkerAlt className="inline mr-1 mb-1" />
					{museum.location}
				</div>

				<h3 className="text-indigo-500 mb-2">
					{museum.ticketPrices ? `Tickets: ${museum.ticketPrices.adult} EGP For Adults, ${museum.ticketPrices.child} EGP For Children`
						:
						'Ticket prices not available'}
				</h3>

				<div className="text-gray-600 mb-2">{`Opening Hours: ${museum.openingHours}`}</div>
				<div className="text-yellow-500 mb-2">{`Tags: ${museum.tags.join(', ')}`}</div>
			</div>

			{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
				<Popup
					trigger={
						<button className="bg-indigo-500 text-white py-2 w-full">
							Update Museum
						</button>
					}
					modal
					contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
					overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
				>
					<MuseumForm museum={museum} />
				</Popup>)}

			{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
				<button onClick={() => {
					if (window.confirm('Are you sure you wish to delete this museum?')) {
						deleteMuseum();
					} }} className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
					Delete Museum
				</button>)}
		</div>
	);
};

export default MuseumDisplay;
