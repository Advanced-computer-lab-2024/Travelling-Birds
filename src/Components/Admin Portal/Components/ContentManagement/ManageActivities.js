import React, {useEffect, useState} from 'react';

const ManageActivities = () => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/admin`);
				const data = await response.json();
				data.forEach(activity => {
					activity.price = activity.price ? activity.price : `${activity.priceRange.lwBound} - ${activity.priceRange.hiBound}`;
				});
				setActivities(data);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch activities:', error);
			}
		};
		fetchActivities().then(r => r);
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
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
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						{activities.map((activity) => (
							<tr key={activity._id}>
								<td>{activity.title}</td>
								<td>{new Date(activity.date).toLocaleDateString()}</td>
								<td>{activity.location.city}, {activity.location.country}</td>
								<td>{activity.price}</td>
								<td>{activity.rating}</td>
								<td>{activity.bookingOpen ? 'Yes' : 'No'}</td>
								<td>{activity.createdByName}</td>
								<td>
									<button className="btn btn-primary btn-sm mr-2">Edit</button>
									<button className="btn btn-info btn-sm mr-2">View</button>
									<button className="btn btn-danger btn-sm mr-2">Delete</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default ManageActivities;