import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {MuseumForm} from "../../../Components/Models/Forms";

const TourismGovernorMuseums = () => {
	const [museums, setMuseums] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedMuseum, setSelectedMuseum] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMuseums = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/brief/${sessionStorage.getItem('user id')}`);
				const data = await response.json();
				setMuseums(data);
			} catch (error) {
				console.error('Failed to fetch museums:', error);
			}
		};
		fetchMuseums().then(() => setLoading(false));
	}, []);

	const handleViewClick = (museum) => {
		navigate(`/museums/${museum._id}`, {replace: true});
	}

	const handleEditClick = (museum) => {
		const fetchMuseum = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`);
				const data = await response.json();
				setSelectedMuseum(data);
			} catch (error) {
				console.error('Failed to fetch museum:', error);
			}
		}
		fetchMuseum().then(() => setIsModalOpen(true));
	};

	const handleDeleteClick = (museum) => {
		if (window.confirm(`Are you sure you want to delete ${museum.name}?`)) {
			const deleteMuseum = async () => {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/${museum._id}`, {
						method: 'DELETE'
					});
					const data = await response.json();
					if (data?.msg?.includes('deleted')) {
						setMuseums(museums.filter(a => a._id !== museum._id));
						toast.success('Museum deleted successfully');
					}
				} catch (error) {
					console.error('Failed to delete museum:', error);
					toast.error('Failed to delete museum');
				}
			}
			deleteMuseum().then(() => setIsModalOpen(false));
		}
	}

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedMuseum(null);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Museums</h2>
			<button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
				Add Museum
			</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Name</th>
							<th className='w-[50%]'>Description</th>
							<th>Location</th>
							<th>Tags</th>
							<th>Created By</th>
							<th className='w-[20%]'>Actions</th>
						</tr>
						</thead>
						<tbody>
						{museums.map((museum) => (
							<tr key={museum._id}>
								<td>{museum.name}</td>
								<td>{museum.description}</td>
								<td>{museum.location.city}, {museum.location.country}</td>
								<td>{museum.tags?.join(', ')}</td>
								<td>{museum.createdByName}</td>
								<td>
									<button className="btn btn-info btn-sm mr-2"
									        onClick={() => handleViewClick(museum)}>
										<i className="fas fa-eye"></i>
										View
									</button>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEditClick(museum)}>
										<i className="fas fa-edit"></i>
										Edit
									</button>
									<button className="btn btn-danger btn-sm mr-2"
									        onClick={() => handleDeleteClick(museum)}>
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
						<MuseumForm museum={selectedMuseum}
						            museums={museums}
						            setMuseums={setMuseums}/>
						<div className="modal-action">
							<button className="btn" onClick={closeModal}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TourismGovernorMuseums;