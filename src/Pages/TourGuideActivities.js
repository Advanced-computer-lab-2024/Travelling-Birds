import React, {useEffect, useState} from 'react';
import {ActivityForm} from '../Components/Models/Forms';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const TourGuideActivities = () => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedActivity, setSelectedActivity] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/brief/${sessionStorage.getItem('user id')}`);
				const data = await response.json();
				data.forEach(activity => {
					activity.displayPrice = activity.price ? activity.price : `${activity.priceRange.lwBound} - ${activity.priceRange.hiBound}`;
				});
				setActivities(data);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch activities:', error);
			}
		};
		fetchActivities();
	}, []);

	const handleViewClick = (activity) => {
		navigate(`/activities/${activity._id}`, {replace: true});
	}

	const handleEditClick = (activity) => {
		const fetchActivity = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`);
				const data = await response.json();
				setSelectedActivity(data);
			} catch (error) {
				console.error('Failed to fetch activity:', error);
			}
		}
		fetchActivity().then(() => setIsModalOpen(true));
	};

	const handleFlagClick = (activity) => {
		const flagActivity = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({flaggedInappropriate: !activity.flaggedInappropriate})
				});
				if (response.ok) {
					const updatedActivities = activities.map(a => {
						if (a._id === activity._id) {
							a.flaggedInappropriate = !activity.flaggedInappropriate;
						}
						return a;
					});
					setActivities(updatedActivities);
					activity.flaggedInappropriate ? toast.success('Activity flagged successfully') : toast.success('Activity unflagged successfully');
				} else {
					toast.error('Failed to flag activity');
				}
			} catch (error) {
				console.error('Failed to flag activity:', error);
				toast.error('Failed to flag activity');
			}
		}
		flagActivity().then(() => setIsModalOpen(false));
	}

	const handleDeleteClick = (activity) => {
		if (window.confirm(`Are you sure you want to delete ${activity.title}?`)) {
			const deleteActivity = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
						method: 'DELETE'
					});
					if (response.ok) {
						const updatedActivities = activities.filter(a => a._id !== activity._id);
						setActivities(updatedActivities);
						toast.success('Activity deleted successfully');
					}
				} catch (error) {
					console.error('Failed to delete activity:', error);
					toast.error('Failed to delete activity');
				}
			}
			deleteActivity().then(() => setIsModalOpen(false));
		}
	}

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedActivity(null);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
			<button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
				Add Activity
			</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Title</th>
							<th>Date</th>
							<th>Location</th>
							<th>Price</th>
							<th>Rating</th>
							<th>Booking Open</th>
							<th>Created By</th>
							<th>Inappropriate</th>
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						{activities.map((activity) => (
							<tr key={activity._id}>
								<td>{activity.title}</td>
								<td>{new Date(activity.date).toLocaleDateString()}</td>
								<td>{activity.location.city}, {activity.location.country}</td>
								<td>{activity.displayPrice}</td>
								<td>{activity.rating}</td>
								<td>{activity.bookingOpen ? 'Yes' : 'No'}</td>
								<td>{activity.createdByName}</td>
								<td>{activity.flaggedInappropriate ? 'Yes' : 'No'}</td>
								<td>
									<button className="btn btn-info btn-sm mr-2"
									        onClick={() => handleViewClick(activity)}>
										<i className="fas fa-eye"></i>
										View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(activity)}>
										<i className="fas fa-edit"></i>
										Edit
									</button>
									<button className="btn btn-warning btn-sm mr-2"
									        onClick={() => handleFlagClick(activity)}>
										<i className="fas fa-flag"></i>
										Flag
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(activity)}>
										<i className="fas fa-trash"></i>
										Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}

			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box w-full max-w-[100rem]">
						<ActivityForm activity={selectedActivity}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TourGuideActivities;