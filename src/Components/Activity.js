import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Activity = ({ activity }) => {
	const [showMore, setShowMore] = useState(false);
	const description = activity.specialDiscounts ? activity.specialDiscounts.substring(0, 100) : '';

	return (
		<div className="bg-white rounded-xl shadow-md relative">
			<div className="p-4">
				<div className="mb-6">
					<div className="text-gray-600 my-2">{activity.category}</div>
					<h3 className="text-xl font-bold">{`Activity on ${activity.date} at ${activity.time}`}</h3>
				</div>
				{activity.specialDiscounts && (
					<div className="mb-5">{showMore ? activity.specialDiscounts : description}</div>
				)}

				{activity.specialDiscounts && (
					<button
						onClick={() => setShowMore(prevState => !prevState)}
						className="text-indigo-500 mb-5 hover:text-indigo-600"
					>
						{showMore ? 'Less' : 'More'}
					</button>
				)}

				<h3 className="text-indigo-500 mb-2">
					{activity.price ? `$${activity.price}` : `$${activity.priceRange.lwBound} - $${activity.priceRange.hiBound}`}
				</h3>

				<div className="border border-gray-100 mb-5"></div>

				<div className="flex flex-col lg:flex-row justify-between mb-4">
					<div className="text-orange-700 mb-3">
						<FaMapMarker className='inline mr-1 mb-1' />
						{`Lat: ${activity.location.lat}, Lng: ${activity.location.lng}`}
					</div>
				</div>

				<div className="text-yellow-500 mb-2">{`Rating: ${activity.rating}/5`}</div>
			</div>
		</div>
	);
};

export default Activity;