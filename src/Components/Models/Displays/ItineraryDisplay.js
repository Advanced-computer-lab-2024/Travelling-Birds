import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const ItineraryDisplay = ({ itinerary }) => {
	const [showMore, setShowMore] = useState(false);
	const timelinePreview = itinerary.timeline ? itinerary.timeline.substring(0, 100) : '';
	const availableDatesPreview = itinerary.availableDates.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ');

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
		</div>
	);
};

export default ItineraryDisplay;