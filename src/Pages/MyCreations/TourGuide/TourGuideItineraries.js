import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ItineraryForm} from '../../../Components/Models/Forms';

const TourGuideItineraries = () => {
	const [itineraries, setItineraries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedItinerary, setSelectedItinerary] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filters, setFilters] = useState({
		productId: '',
		activityId: '',
		itineraryId: '',
		startDate: '',
		endDate: '',
	});
	const [itinerariesReport, setItinerariesReport] = useState({
		totalRevenue: 0,
		totalBookings: 0,
	});

	const navigate = useNavigate();

	useEffect(() => {
		const fetchItineraries = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/brief/${sessionStorage.getItem('user id')}`);
				const data = await response.json();
				setItineraries(data);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch itineraries:', error);
			}
		};
		fetchItineraries();
	}, []);

	useEffect(() => {
		const fetchItinerariesReport = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/sales/${sessionStorage.getItem('user id')}`, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(filters),
				});
				const data = await response.json();
				setItinerariesReport(data.itineraries);
			} catch (error) {
				console.error('Error fetching itineraries report:', error);
			}
		};
		fetchItinerariesReport();
	}, [filters]);

	const handleViewClick = (itinerary) => {
		navigate(`/itineraries/${itinerary._id}`, {replace: true});
	};

	const handleEditClick = (itinerary) => {
		const fetchItinerary = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`);
				const data = await response.json();
				setSelectedItinerary(data);
			} catch (error) {
				console.error('Failed to fetch itinerary:', error);
			}
		};
		fetchItinerary().then(() => setIsModalOpen(true));
	};

	const handleFlagClick = (itinerary) => {
		const flagItinerary = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({active: !itinerary.active}),
				});
				const data = await response.json();
				if (data._id) {
					const updatedItineraries = itineraries.map((a) => {
						if (a._id === itinerary._id) {
							a.active = !itinerary.active;
						}
						return a;
					});
					setItineraries(updatedItineraries);
					itinerary.active
						? toast.success('Itinerary de-activated successfully')
						: toast.success('Itinerary activated successfully');
				} else {
					toast.error('Failed to flag itinerary');
				}
			} catch (error) {
				itinerary.active
					? toast.error('Failed to de-activate itinerary')
					: toast.error('Failed to activate itinerary');
			}
		};
		flagItinerary().then(() => setIsModalOpen(false));
	};

	const handleDeleteClick = (itinerary) => {
		if (window.confirm(`Are you sure you want to delete ${itinerary.title}?`)) {
			const deleteItinerary = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itinerary._id}`, {
						method: 'DELETE',
					});
					if (response.ok) {
						const updatedItineraries = itineraries.filter((i) => i._id !== itinerary._id);
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
			};
			deleteItinerary().then(() => setIsModalOpen(false));
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedItinerary(null);
	};

	const handleFilterChange = (e) => {
		setFilters({...filters, [e.target.name]: e.target.value});
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Itineraries</h2>

			{/* Filters Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<ItinerariesFilter itineraries={itineraries} filters={filters} handleFilterChange={handleFilterChange}/>
			</div>

			<div className="mt-6">
				<h4 className="text-xl font-semibold">Itinerary Report</h4>
				<p>Total Revenue: ${itinerariesReport.totalRevenue}</p>
				<p>Total Bookings: {itinerariesReport.totalBookings}</p>
			</div>

			<div className="mb-4">
				<button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
					Add Itinerary
				</button>
			</div>

			{/* Itinerary Table */}
			{!loading && (
				<div className="overflow-x-auto mb-6">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Language</th>
							<th>Price</th>
							<th>Inappropriate</th>
							<th>Active</th>
							<th>Created By</th>
							<th>Actions</th>
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
										View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(itinerary)}>
										Edit
									</button>
									<button className="btn btn-warning btn-sm mr-2"
									        onClick={() => handleFlagClick(itinerary)}>
										Flag
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(itinerary)}>
										Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}

			{/* Itinerary Modal */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box w-full max-w-[100rem]">
						<ItineraryForm itinerary={selectedItinerary} itineraries={itineraries}
						               setItineraries={setItineraries}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TourGuideItineraries;


const ItinerariesFilter = ({itineraries, filters, handleFilterChange}) => {

	return (
		<div className="form-control">
			<label className="label">
				<span className="label-text">Itinerary</span>
			</label>
			<select
				name="itineraryId"
				value={filters.itineraryId}
				onChange={handleFilterChange}
				className="select select-bordered w-full"
			>
				<option value="">All Itineraries</option>
				{itineraries.map((itinerary) => (
					<option key={itinerary._id} value={itinerary._id}>
						{itinerary.title}
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