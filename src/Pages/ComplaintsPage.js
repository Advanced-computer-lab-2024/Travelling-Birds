import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintsPage = () => {
	const [complaints, setComplaints] = useState([]);
	const [showDetails, setShowDetails] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [newComplaint, setNewComplaint] = useState({
		title: '',
		body: '',
		createdBy: '' // Fill this in dynamically as needed
	});

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_BACKEND}/api/complaints`)
			.then(response => setComplaints(response.data))
			.catch(error => console.error('Error fetching complaints:', error));
	}, []);

	const handleShowDetails = (complaint) => {
		setSelectedComplaint(complaint);
		setShowDetails(true);
	};

	const handleCreateComplaint = () => {
		axios.post(`${process.env.REACT_APP_BACKEND}/api/complaints`, newComplaint)
			.then(response => {
				setComplaints([...complaints, response.data]);
				setShowCreateForm(false);
				setNewComplaint({ title: '', body: '', createdBy: '' });
			})
			.catch(error => console.error('Error creating complaint:', error));
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<button
					className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
					onClick={() => setShowCreateForm(true)}
				>
					Create a New Complaint
				</button>
				<h1 className="text-2xl font-bold">Complaints</h1>
			</div>

			{/* Complaint Cards */}
			<div className="space-y-4">
				{complaints.map((complaint, index) => (
					<div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
						<div>
							<h3 className="text-lg font-semibold">{complaint.title}</h3>
							<p className="text-sm text-gray-600">Date: {new Date(complaint.date).toLocaleDateString()}</p>
							<p className="text-sm text-gray-600">Status: {complaint.status}</p>
						</div>
						<button
							className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
							onClick={() => handleShowDetails(complaint)}
						>
							View Details
						</button>
					</div>
				))}
			</div>

			{/* Popup for complaint details */}
			{showDetails && selectedComplaint && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-xl font-bold mb-2">{selectedComplaint.title}</h2>
						<p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
						<p><strong>Status:</strong> {selectedComplaint.status}</p>
						<p><strong>Details:</strong> {selectedComplaint.body}</p>
						<p><strong>Reply:</strong> {selectedComplaint.reply || 'No reply yet'}</p>
						<button
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
							onClick={() => setShowDetails(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Popup for creating a new complaint */}
			{showCreateForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">Create a New Complaint</h2>
						<input
							type="text"
							placeholder="Title"
							className="w-full mb-2 p-2 border border-gray-300 rounded-md"
							value={newComplaint.title}
							onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
						/>
						<textarea
							placeholder="Complaint Details"
							className="w-full mb-2 p-2 border border-gray-300 rounded-md"
							value={newComplaint.body}
							onChange={(e) => setNewComplaint({ ...newComplaint, body: e.target.value })}
						/>
						<input
							type="text"
							placeholder="Created By (User ID)"
							className="w-full mb-2 p-2 border border-gray-300 rounded-md"
							value={newComplaint.createdBy}
							onChange={(e) => setNewComplaint({ ...newComplaint, createdBy: e.target.value })}
						/>
						<button
							className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
							onClick={handleCreateComplaint}
						>
							Submit
						</button>
						<button
							className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
							onClick={() => setShowCreateForm(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ComplaintsPage;
