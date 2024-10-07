import {useState} from 'react';
import {FaMapMarker} from 'react-icons/fa';
import PropTypes from "prop-types";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {ActivityForm} from "../Forms";
import {toast} from "react-toastify";
import {modelModificationEvent} from "../../../utils/modelModificationEvent";


const ActivityDisplay = ({activity}) => {
	const [showMore, setShowMore] = useState(false);
	const description = activity.specialDiscounts ? activity.specialDiscounts.substring(0, 100) : '';
	const deleteActivity =()=>{
		fetch (`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`,{
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
	}
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
						<FaMapMarker className='inline mr-1 mb-1'/>
						{`Lat: ${activity.location.lat}, Lng: ${activity.location.lng}`}
					</div>
				</div>
				<div className="text-yellow-500 mb-2">{`Rating: ${activity.rating}/5`}</div>
			</div>
			<Popup
				className="h-fit overflow-y-scroll"
				trigger={
					<button className="bg-indigo-500 text-white py-2 w-full">
						Update Activity
					</button>
				}
				modal
				contentStyle={{ maxHeight: '80vh', overflowY: 'auto' }} /* Ensures scroll */
				overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }} /* Darken background for modal */
			>
				<ActivityForm className="overflow-y-scroll" activity={activity} />
			</Popup>
			<button onClick={() => {
				if (window.confirm('Are you sure you wish to delete this item?')) {
					deleteActivity();
				} }}  className="bg-red-500 hover:bg-red-700 text-white py-2 w-full rounded-b-xl">
				Delete Activity
			</button>
		</div>
	);
};

ActivityDisplay.propTypes = {
	activity: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		time: PropTypes.string.isRequired,
		lat: PropTypes.number.isRequired,
		lng: PropTypes.number.isRequired,
		price: PropTypes.number,
		lwBound: PropTypes.number,
		hiBound: PropTypes.number,
		category: PropTypes.string.isRequired,
		tags: PropTypes.string,
		specialDiscounts: PropTypes.string,
	}).isRequired
}

export default ActivityDisplay;