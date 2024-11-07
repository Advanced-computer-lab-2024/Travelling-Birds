import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const ViewComplaints = () => {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [reply, setReply] = useState('');
	const [selectedComplaint, setSelectedComplaint] = useState({});
	const [statusFilter, setStatusFilter] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');

	const handleReplySubmit = (e) => {
		e.preventDefault();
		fetch(`${process.env.REACT_APP_BACKEND}/api/complaints/${selectedComplaint._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				reply,
				status: 'resolved'
			})
		})
			.then((response) => response.json())
			.then(data => {
				if (data?.reply) {
					toast.success('Reply sent successfully');
					setComplaints(complaints.map(complaint => {
						if (complaint._id === selectedComplaint._id) {
							return {...complaint, reply, status: 'resolved'};
						}
						return complaint;
					}));
					document.getElementById('my_modal_5').close();
					setReply('');
					setSelectedComplaint({});
				} else {
					toast.error('Failed to send reply');
				}
			});
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

	const filteredComplaints = complaints
		.filter(complaint => statusFilter ? complaint.status === statusFilter : true)
		.sort((a, b) => sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">View Complaints</h2>
			<div className="mb-4">
				<label className="mr-2">Filter by Status:</label>
				<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
				        className="select select-bordered">
					<option value="">All</option>
					<option value="pending">Pending</option>
					<option value="resolved">Resolved</option>
				</select>
				<label className="ml-4 mr-2">Sort by Date:</label>
				<select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
				        className="select select-bordered">
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>
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
						{filteredComplaints.map((complaint) => (
							<tr key={complaint._id}>
								<td>{complaint.title}</td>
								<td>{new Date(complaint.date).toLocaleDateString()}</td>
								<td>{complaint.body}</td>
								<td>{complaint.status}</td>
								<td>{complaint.reply || <button className="btn btn-primary btn-sm"
								                                onClick={() => {
									                                document.getElementById('my_modal_5').showModal();
									                                setSelectedComplaint(complaint)
								                                }}>Reply
								</button>}</td>
								<td>{complaint.createdByName}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
			<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Reply to Complaint</h3>
					<form onSubmit={handleReplySubmit}>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Title</label>
							<input type="text" name="title" value={selectedComplaint.title} readOnly
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Date</label>
							<input type="text" name="date" value={new Date(selectedComplaint.date).toLocaleDateString()}
							       readOnly className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Body</label>
							<textarea name="body" value={selectedComplaint.body} readOnly
							          className="textarea textarea-bordered w-full"></textarea>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Reply</label>
							<textarea name="reply" value={reply} onChange={(e) => setReply(e.target.value)}
							          className="textarea textarea-bordered w-full"></textarea>
						</div>
						<div className="modal-action">
							<button type="submit" className="btn btn-primary">Submit Reply</button>
							<button type="button" className="btn"
							        onClick={() => document.getElementById('my_modal_5').close()}>Close
							</button>
						</div>
					</form>
				</div>
			</dialog>
		</div>
	);
}

export default ViewComplaints;