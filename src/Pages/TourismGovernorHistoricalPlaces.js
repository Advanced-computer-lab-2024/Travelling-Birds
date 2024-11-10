import React, {useEffect, useState} from "react";
import HistoricalPlaceForm from "../Components/Models/Forms/HistoricalPlaceForm";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const TourismGovernorHistoricalPlaces = () => {
	const [historicalPlaces, setHistoricalPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedHistoricalPlace, setSelectedHistoricalPlace] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchHistoricalPlaces = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/brief/${sessionStorage.getItem('user id')}`);
				const data = await response.json();
				setHistoricalPlaces(data);
			} catch (error) {
				console.error('Failed to fetch historical places:', error);
			}
		};
		fetchHistoricalPlaces().then(() => setLoading(false));
	}, []);

	const handleViewClick = (historicalPlace) => {
		navigate(`/historicalPlaces/${historicalPlace._id}`, {replace: true});
	}

	const handleEditClick = (historicalPlace) => {
		const fetchHistoricalPlace = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`);
				const data = await response.json();
				setSelectedHistoricalPlace(data);
			} catch (error) {
				console.error('Failed to fetch historicalPlace:', error);
			}
		}
		fetchHistoricalPlace().then(() => setIsModalOpen(true));
	};

	const handleDeleteClick = (historicalPlace) => {
		if (window.confirm(`Are you sure you want to delete ${historicalPlace.name}?`)) {
			const deleteActivity = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${historicalPlace._id}`, {
						method: 'DELETE'
					});
					const data = await response.json();
					if (data?.msg?.includes('deleted')) {
						const updatedHistoricalPlaces = historicalPlaces.filter(a => a._id !== historicalPlace._id);
						setHistoricalPlaces(updatedHistoricalPlaces);
						toast.success('Historical Place deleted successfully');
					}
				} catch (error) {
					console.error('Failed to delete historical place:', error);
					toast.error('Failed to delete historical place');
				}
			}
			deleteActivity().then(() => setIsModalOpen(false));
		}
	}

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedHistoricalPlace(null);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Historical Places</h2>
			<button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
				Add Historical Place
			</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Location</th>
							<th>Tags</th>
							<th className='w-[20%]'>Actions</th>
						</tr>
						</thead>
						<tbody>
						{historicalPlaces.map((historicalPlace) => (
							<tr key={historicalPlace._id}>
								<td>{historicalPlace.name}</td>
								<td>{historicalPlace.description}</td>
								<td>{historicalPlace.location.city}, {historicalPlace.location.country}</td>
								<td>{historicalPlace.tags.join(', ')}</td>
								<td>
									<button className="btn btn-info btn-sm mr-2"
									        onClick={() => handleViewClick(historicalPlace)}>
										<i className="fas fa-eye"></i>
										View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(historicalPlace)}>
										<i className="fas fa-edit"></i>
										Edit
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(historicalPlace)}>
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
						<HistoricalPlaceForm historicalPlace={selectedHistoricalPlace}
						                     historicalPlaces={historicalPlaces}
						                     setHistoricalPlaces={setHistoricalPlaces}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TourismGovernorHistoricalPlaces;