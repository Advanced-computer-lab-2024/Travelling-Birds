import React, {useEffect, useState} from 'react';

const ViewComplaints = () => {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [replying, setReplying] = useState(false);
	
	const toggleReply = (complaintId) => {
		setReplying(true);
		// open reply modal


	}

	useEffect(() => {
		const getComplaints = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/complaints`)
				.then((response) => response.json())
				.then(complaints => {
					setComplaints(complaints);
					setLoading(false);
				});
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
								<td>{complaint.reply || <button className="btn btn-primary btn-sm">Reply
								</button>}</td>
								<td>{complaint.createdByName}</td>
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