import {useEffect, useState} from 'react';

const ViewComplaints = () => {
	const [complaints, setComplaints] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [loading, setLoading] = useState(true);

	const getUser = async (userId) => {
		let name = '';
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`)
			.then((response) => response.json())
			.then(user => {
				name = user.firstName + ' ' + user.lastName;
			});
		return name;
	}

	useEffect(() => {
		const getComplaints = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/complaints`)
				.then((response) => response.json())
				.then(complaints => {
					setComplaints(complaints);
					setLoading(false);
				});
			console.log(userMap);
		}
		getComplaints();
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">View Complaints</h2>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Title</th>
							<th>Date</th>
							<th>Body</th>
							<th>Status</th>
							<th>Reply</th>
							<th>Created By</th>
						</tr>
						</thead>
						<tbody>
						{complaints.map((complaint) => (
							<tr key={complaint._id}>
								<td>{complaint.title}</td>
								<td>{new Date(complaint.date).toLocaleDateString()}</td>
								<td>{complaint.body}</td>
								<td>{complaint.status}</td>
								<td>{complaint.reply || 'N/A'}</td>
								<td>{userMap[complaint.createdBy]}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default ViewComplaints;