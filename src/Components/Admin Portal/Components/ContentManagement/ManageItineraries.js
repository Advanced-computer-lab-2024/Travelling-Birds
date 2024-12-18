import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {ItineraryForm} from "../../../Models/Forms";
const ManageItineraries = () => {
	const [itineraries, setItineraries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchItineraries = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/brief`);
				const data = await response.json();
				setItineraries(data);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch itineraries:', error);
			}
		};
		fetchItineraries().then(() => setLoading(false));
	}, []);

	const handleViewClick = (itinerary) => {
		navigate(`/itineraries/${itinerary._id}`, {replace: true});
	}

	const handleEditClick = (itinerary) => {
		const fetchItinerary = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`);
				const data = await response.json();
				setSelectedItinerary(data);
			} catch (error) {
				console.error('Failed to fetch itinerary:', error);
			}
		}
		fetchItinerary().then(() => setIsModalOpen(true));
	};
	const handleFlagClick = (itinerary) => {
		const flagItinerary = async () => {
			try {
				// Toggle the flagged status
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ flaggedInappropriate: !itinerary.flaggedInappropriate }),
				});
	
				if (!response.ok) {
					throw new Error('Failed to flag itinerary');
				}
	
				const updatedItineraries = itineraries.map(i => {
					if (i._id === itinerary._id) {
						i.flaggedInappropriate = !itinerary.flaggedInappropriate;
					}
					return i;
				});
	
				setItineraries(updatedItineraries);
	
				// Notify the user about the flagging action
				const successMessage = itinerary.flaggedInappropriate
					? 'Itinerary unflagged successfully'
					: 'Itinerary flagged successfully';
				toast.success(successMessage);
	
				// If flagged, send an email notification to the tour guide
				if (!itinerary.flaggedInappropriate) {
					const emailSubject = `Itinerary Flagged as Inappropriate: ${itinerary.title}`;
					const emailHtmlContent = `
						<h1>Itinerary Flagged</h1>
						<p>Your itinerary titled <strong>${itinerary.title}</strong> has been flagged as inappropriate.</p>
						<p>Please review the itinerary details and address any issues as soon as possible.</p>
						<p>Thank you for your attention.</p>
					`;
	
					// Fetch tour guide details
					const tourGuideResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${itinerary.createdBy}`);
					if (!tourGuideResponse.ok) {
						throw new Error('Failed to fetch tour guide details');
					}
	
					const tourGuide = await tourGuideResponse.json();
	
					// Send email
					const mailResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: tourGuide.email,
							subject: emailSubject,
							message: '', // Optional plain text fallback
							htmlContent: emailHtmlContent,
						}),
					});
	
					if (!mailResponse.ok) {
						throw new Error('Failed to send email notification to the tour guide');
					}
	
					toast.success('Email notification sent to the tour guide');
				}
			} catch (error) {
				console.error('Failed to flag itinerary:', error);
				toast.error('Failed to flag itinerary');
			}
		};
		flagItinerary().then(() => setIsModalOpen(false));
	};

	const handleDeleteClick = (itinerary) => {
		if (window.confirm(`Are you sure you want to delete ${itinerary.title}?`)) {
			const deleteItinerary = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
						method: 'DELETE'
					});
					if (response.ok) {
						const updatedItineraries = itineraries.filter(i => i._id !== itinerary._id);
						setItineraries(updatedItineraries);
						toast.success('Itinerary deleted successfully');
					}
					if (response.status === 400) {
						toast.error('Can not delete itinerary with bookings');
					}
				} catch (error) {
					console.error('Failed to delete itinerary:', error);
					toast.error('Failed to delete itinerary');
				}
			}
			deleteItinerary().then(() => setIsModalOpen(false));
		}
	}

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedItinerary(null);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Itineraries</h2>
			<button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
				Add Itinerary
			</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							{/*title description duration language price createdByName*/}
							<th>Title</th>
							<th className='w-[40%]'>Description</th>
							<th>Language</th>
							<th>Price</th>
							<th>Inappropriate</th>
							<th>Active</th>
							<th>Created By</th>
						</tr>
						</thead>
						<tbody>
						{itineraries.map((itinerary) => (
							<tr key={itinerary._id}>
								<td>{itinerary.title}</td>
								<td>{itinerary.description}</td>
								<td>{itinerary.language}</td>
								<td>{itinerary.price}</td>
								<td>{itinerary.flaggedInappropriate ? 'Yes' : 'No'}</td>
								<td>{itinerary.active ? 'Yes' : 'No'}</td>
								<td>{itinerary.createdByName}</td>
								<td>
									<button className="btn btn-info btn-sm mr-2"
									        onClick={() => handleViewClick(itinerary)}>
										<i className="fas fa-eye"></i>
										View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(itinerary)}>
										<i className="fas fa-edit"></i>
										Edit
									</button>
									<button className="btn btn-warning btn-sm mr-2"
									        onClick={() => handleFlagClick(itinerary)}>
										<i className="fas fa-flag"></i>
										Flag
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(itinerary)}>
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
						<ItineraryForm itinerary={selectedItinerary} itineraries={itineraries}
						              setItineraries={setItineraries}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ManageItineraries;