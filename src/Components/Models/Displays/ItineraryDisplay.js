import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Popup from "reactjs-popup";
import {ItineraryForm} from "../Forms";
import {toast} from "react-toastify";
import {modelModificationEvent} from "../../../utils/modelModificationEvent";
import PropTypes from "prop-types";

const ItineraryDisplay = ({ itinerary }) => {
	const [showMore, setShowMore] = useState(false);
	const timelinePreview = itinerary.timeline ? itinerary.timeline.substring(0, 100) : '';
	const availableDatesPreview = itinerary.availableDates.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ');
	const deleteItinerary = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'itinerary deleted successfully') {
					toast.success('Itinerary deleted successfully');
					window.dispatchEvent(modelModificationEvent);
				} else {
					toast.error('Failed to delete itinerary');
				}
			}).catch((error) => {
				console.log(error);
			});
	}
	return (
		<div className="bg-white rounded-xl shadow-md relative">
			<div className="p-4">
				<div className="mb-6">
					<h3 className="text-xl font-bold">{`Itinerary by ${itinerary.createdBy.name}`}</h3>
					<div className="text-gray-600 my-2">{`Language: ${itinerary.language}`}</div>
				</div>

				{itinerary.timeline && (
					<div className="mb-5">{showMore ? itinerary.timeline : timelinePreview}</div>
				)}

				{itinerary.timeline && (
					<button
						onClick={() => setShowMore(prevState => !prevState)}
						className="text-indigo-500 mb-5 hover:text-indigo-600"
					>
						{showMore ? 'Less' : 'More'}
					</button>
				)}

				<h3 className="text-indigo-500 mb-2">
					{itinerary.price ? `$${itinerary.price}` : 'Price not available'}
				</h3>

				<div className="border border-gray-100 mb-5"></div>

				<div className="flex flex-col lg:flex-row justify-between mb-4">
					<div className="text-orange-700 mb-3">
						<FaMapMarkerAlt className='inline mr-1 mb-1' />
						{itinerary.locations.join(', ')}
					</div>
					<div className="text-green-500 mb-3">
						<FaCalendarAlt className='inline mr-1 mb-1' />
						{`Available on: ${availableDatesPreview}`}
					</div>
				</div>

				<div className="text-yellow-500 mb-2">{`Accessibility: ${itinerary.accessibility}`}</div>

				<div className="text-gray-600 mb-2">{`Pickup Location: ${itinerary.pickupLocation}`}</div>
				<div className="text-gray-600 mb-2">{`Dropoff Location: ${itinerary.dropoffLocation}`}</div>
			</div>
			{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
			<Popup
				className="h-fit overflow-y-scroll"
				trigger={
					<button className="bg-indigo-500 text-white py-2 w-full">
						Update Itinerary
					</button>
				}
				modal
				contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
				overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
			>
				<ItineraryForm className="overflow-y-scroll" itinerary={itinerary}/>
			</Popup>)}
			{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
			<button onClick={() => {
				if (window.confirm('Are you sure you wish to delete this item?')) {
					deleteItinerary();
				} }}  className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
				Delete Itinerary
			</button>)}
		</div>
	);
};

ItineraryDisplay.propTypes = {
	itinerary: PropTypes.shape({
		activities: PropTypes.arrayOf(PropTypes.string),
		locations: PropTypes.arrayOf(PropTypes.string),
		timeline: PropTypes.string,
		duration: PropTypes.string,
		language: PropTypes.string,
		price: PropTypes.number,
		availableDates: PropTypes.arrayOf(PropTypes.any),
		accessibility: PropTypes.string,
		pickupLocation: PropTypes.string,
		dropoffLocation: PropTypes.string,
		preferences: PropTypes.string,
		isBooked: PropTypes.bool,
		createdBy: PropTypes.string,
		_id: PropTypes.string.isRequired,
	})
}

export default ItineraryDisplay;