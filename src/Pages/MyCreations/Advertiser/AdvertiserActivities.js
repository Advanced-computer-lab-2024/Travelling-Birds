import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ActivityForm} from '../../../Components/Models/Forms';

const AdvertiserActivities = () => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedActivity, setSelectedActivity] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filters, setFilters] = useState({activityId: ''});
	const [activitiesReport, setActivitiesReport] = useState({
		totalRevenue: 0,
		totalBookings: 0,
	});
	const navigate = useNavigate();

	// Fetch activities
	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/brief/${sessionStorage.getItem('user id')}`);
				const data = await response.json();
				setActivities(data);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch activities:', error);
			}
		};
		fetchActivities();
	}, []);

	// Fetch activity report based on filters
	useEffect(() => {
		const fetchActivitiesReport = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/sales/${sessionStorage.getItem('user id')}`, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(filters),
				});
				const data = await response.json();
				setActivitiesReport(data.activities);
			} catch (error) {
				console.error('Error fetching activities report:', error);
			}
		};

		fetchActivitiesReport();
	}, [filters]);

	// Handle filter change
	const handleFilterChange = (e) => {
		const {name, value} = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}));
	};

	// View Activity details
	const handleViewClick = (activity) => {
		navigate(`/activities/${activity._id}`, {replace: true});
	};

	// Toggle booking status
	const handleToggleBooking = (activity) => {
		const newBookingStatus = !activity.bookingOpen;
		fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				bookingOpen: newBookingStatus,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Booking status updated successfully');
					setActivities(activities.map((a) => {
						if (a._id === activity._id) {
							return {...a, bookingOpen: newBookingStatus};
						}
						return a;
					}));
				} else {
					toast.error('Failed to update booking status');
				}
			});
	};

	// Edit Activity
	const handleEditClick = (activity) => {
		const fetchActivity = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`);
				const data = await response.json();
				setSelectedActivity(data);
			} catch (error) {
				console.error('Failed to fetch activity:', error);
			}
		};
		fetchActivity().then(() => setIsModalOpen(true));
	};

	// Delete Activity
	const handleDeleteClick = (activity) => {
		if (window.confirm(`Are you sure you want to delete ${activity.title}?`)) {
			const deleteActivity = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activity._id}`, {
						method: 'DELETE',
					});
					if (response.ok) {
						const updatedActivities = activities.filter((a) => a._id !== activity._id);
						setActivities(updatedActivities);
						toast.success('Activity deleted successfully');
					}
				} catch (error) {
					console.error('Failed to delete activity:', error);
					toast.error('Failed to delete activity');
				}
			};
			deleteActivity().then(() => setIsModalOpen(false));
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedActivity(null);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">My Activities</h2>

			{/* Activities Filter Component */}
			<ActivitiesFilter activities={activities} filters={filters} handleFilterChange={handleFilterChange}/>

			{/* Activities Report */}
			<div className="mt-6">
				<h4 className="text-xl font-semibold">Activities Report</h4>
				<p>Total Revenue: ${activitiesReport.totalRevenue}</p>
				<p>Total Bookings: {activitiesReport.totalBookings}</p>
			</div>

			{/* Add Activity Button */}
			<button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
				Add Activity
			</button>

			{/* Activities Table */}
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
										<i className="fas fa-eye"></i> View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleToggleBooking(activity)}>
										<i className="fas fa-flag"></i> Flag
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(activity)}>
										<i className="fas fa-edit"></i> Edit
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(activity)}>
										<i className="fas fa-trash"></i> Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}

			{/* Modal for Editing Activity */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box w-full max-w-[100rem]">
						<ActivityForm activity={selectedActivity} activities={activities}
						              setActivities={setActivities}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdvertiserActivities;

const ActivitiesFilter = ({activities, filters, handleFilterChange}) => {
	return (
		<div className="form-control">
			<label className="label">
				<span className="label-text">Activity</span>
			</label>
			<select
				name="activityId"
				value={filters.activityId}
				onChange={handleFilterChange}
				className="select select-bordered w-full"
			>
				<option value="">All Activities</option>
				{activities.map((activity) => (
					<option key={activity._id} value={activity._id}>
						{activity.title}
					</option>
				))}
			</select>
			{/* Date Filters */}
			<div className="form-control">
				<label className="label">
					<span className="label-text">Start Date</span>
				</label>
				<input
					type="date"
					name="startDate"
					value={filters.startDate}
					onChange={handleFilterChange}
					className="input input-bordered w-full"
				/>
			</div>

			<div className="form-control">
				<label className="label">
					<span className="label-text">End Date</span>
				</label>
				<input
					type="date"
					name="endDate"
					value={filters.endDate}
					onChange={handleFilterChange}
					className="input input-bordered w-full"
				/>
			</div>
		</div>
	);
};