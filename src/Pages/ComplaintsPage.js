import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintsPage = () => {
	const [complaints, setComplaints] = useState([]);
	const [showDetails, setShowDetails] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [newComplaint, setNewComplaint] = useState({
		title: '',
		body: ''
	});

	useEffect(() => {
		const userId = sessionStorage.getItem('user id');
		axios.get(`${process.env.REACT_APP_BACKEND}/api/complaints`)
			.then(response => {
				const userComplaints = response.data.filter(complaint => complaint.createdBy === userId);
				setComplaints(userComplaints);
			})
			.catch(error => console.error('Error fetching complaints:', error));
	}, []);

	const handleShowDetails = (complaint) => {
		setSelectedComplaint(complaint);
		setShowDetails(true);
	};

	const handleCreateComplaint = () => {
		const userId = sessionStorage.getItem('user id');
		const complaintWithUser = { ...newComplaint, createdBy: userId };

		axios.post(`${process.env.REACT_APP_BACKEND}/api/complaints`, complaintWithUser)
			.then(response => {
				setComplaints([...complaints, response.data]);
				setShowCreateForm(false);
				setNewComplaint({ title: '', body: '' });
			})
			.catch(error => console.error('Error creating complaint:', error));
	};

	const getStatusColor = (status) => {
		if (status.toLowerCase() === 'pending') return 'text-yellow-500';
		if (status.toLowerCase() === 'resolved') return 'text-green-500';
		return 'text-gray-600';
	};

	return (
		<div className="bg-white min-h-screen">
			<div className="bg-white max-w-4xl mx-auto p-4">
				<h1 className="text-3xl font-bold text-center mb-4" style={{ color: '#330577' }}>Complaints</h1>

				<div className="space-y-4">
					{complaints.map((complaint, index) => (
						<div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
							<div>
								<h3 className="text-lg font-semibold" style={{ color: '#330577' }}>{complaint.title}</h3>
								<p className="text-sm text-gray-600">Date: {new Date(complaint.date).toLocaleDateString()}</p>
								<p className={`text-sm ${getStatusColor(complaint.status)}`}>Status: {complaint.status}</p>
							</div>
							<button
								className="px-3 py-1 rounded-md hover:bg-opacity-80"
								style={{ backgroundColor: '#330577', color: 'white' }}
								onClick={() => handleShowDetails(complaint)}
							>
								View Details
							</button>
						</div>
					))}
				</div>

				<div className="flex justify-center mt-6">
					<button
						className="px-4 py-2 rounded-md hover:bg-opacity-80"
						style={{ backgroundColor: '#330577', color: 'white' }}
						onClick={() => setShowCreateForm(true)}
					>
						Create a New Complaint
					</button>
				</div>

				{showDetails && selectedComplaint && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-xl font-bold mb-2" style={{ color: '#330577' }}>{selectedComplaint.title}</h2>
							<p><strong style={{ color: '#330577' }}>Date:</strong> <span className="text-gray-600">{new Date(selectedComplaint.date).toLocaleDateString()}</span></p>
							<p><strong style={{ color: '#330577' }}>Status:</strong> <span className={getStatusColor(selectedComplaint.status)}>{selectedComplaint.status}</span></p>
							<p><strong style={{ color: '#330577' }}>Details:</strong> <span className="text-gray-600">{selectedComplaint.body}</span></p>
							<p><strong style={{ color: '#330577' }}>Reply:</strong> <span className="text-gray-600">{selectedComplaint.reply || 'No reply yet'}</span></p>
							<button
								className="mt-4 px-4 py-2 rounded-md hover:bg-opacity-80"
								style={{ backgroundColor: '#330577', color: 'white' }}
								onClick={() => setShowDetails(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}

				{showCreateForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-xl font-bold mb-4" style={{ color: '#330577' }}>Create a New Complaint</h2>
							<input
								type="text"
								placeholder="Title"
								className="w-full mb-2 p-2 border border-gray-300 rounded-md"
								style={{ color: 'black', backgroundColor: 'white' }}
								value={newComplaint.title}
								onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
							/>
							<textarea
								placeholder="Complaint Details"
								className="w-full mb-2 p-2 border border-gray-300 rounded-md"
								style={{ color: 'black', backgroundColor: 'white' }}
								value={newComplaint.body}
								onChange={(e) => setNewComplaint({ ...newComplaint, body: e.target.value })}
							/>
							<button
								className="px-4 py-2 rounded-md hover:bg-opacity-80"
								style={{ backgroundColor: '#330577', color: 'white' }}
								onClick={handleCreateComplaint}
							>
								Submit
							</button>
							<button
								className="ml-2 px-4 py-2 rounded-md hover:bg-opacity-80"
								style={{ backgroundColor: '#330577', color: 'white' }}
								onClick={() => setShowCreateForm(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ComplaintsPage;