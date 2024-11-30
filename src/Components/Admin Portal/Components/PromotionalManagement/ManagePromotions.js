import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";

const ManagePromotions = () => {
	const [promotions, setPromotions] = useState([]);
	const [selectedPromotion, setSelectedPromotion] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [promoCode, setPromoCode] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [discount, setDiscount] = useState('');
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const fetchPromotions = async () => {
			fetch('http://localhost:8000/api/promotions')
				.then(response => response.json())
				.then(data => setPromotions(data));
		};
		fetchPromotions().then(() => setLoading(false));
	}, []);

	const handleCreate = () => {
		setPromoCode('');
		setStartDate('');
		setEndDate('');
		setDiscount('');
		setIsActive(true);
		setSelectedPromotion(null);
		setUpdating(false);
		setModalVisible(true);
	}

	const handleEdit = (promotion) => {
		setPromoCode(promotion.promoCode);
		setStartDate(promotion.startDate);
		setEndDate(promotion.endDate);
		setDiscount(promotion.discount);
		setIsActive(promotion.isActive);
		setSelectedPromotion(promotion);
		setUpdating(true);
		setModalVisible(true);
	}

	const handleSave = async () => {
		const data = {
			promoCode,
			startDate,
			endDate,
			discount,
			isActive,
		};
		const response = await fetch(`http://localhost:8000/api/promotions${updating ? `/${selectedPromotion._id}` : ""}`, {
			method: updating ? 'PUT' : 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			const newPromotion = await response.json();
			if (updating) {
				setPromotions(promotions.map((p) => p._id === newPromotion._id ? newPromotion : p));
				toast.success('Promotion updated successfully');
			} else {
				setPromotions([...promotions, newPromotion]);
				toast.success('Promotion created successfully');
			}
			setModalVisible(false);
		}
	}

	const handleActivate = async (promotion) => {
		const data = {
			isActive: !promotion.isActive,
		};
		const response = await fetch(`http://localhost:8000/api/promotions/${promotion._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			console.log(promotion);
			setPromotions(promotions.map((p) => p._id === promotion._id ? {
				...promotion,
				isActive: !promotion.isActive
			} : p));
			toast.success(`Promotion ${promotion.isActive ? 'de-activated' : 'activated'} successfully`);
		} else {
			toast.error('An error occurred');
		}
	}

	const handleDelete = async (promotion) => {
		if (window.confirm('Are you sure you want to delete this promotion?')) {
			const response = await fetch(`http://localhost:8000/api/promotions/${promotion._id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				setPromotions(promotions.filter((p) => p._id !== promotion._id));
				toast.success('Promotion deleted successfully');
			} else {
				toast.error('An error occurred');
			}
		}
	}

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Promotions</h2>
			<button className="btn btn-primary mb-2" onClick={handleCreate}>Add Promotion</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Promo Code</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>% Discount</th>
							<th>Active</th>
							<th className='w-[25%]'>Actions</th>
						</tr>
						</thead>
						<tbody>
						{promotions.map((promotion) => (
							<tr key={promotion._id}>
								<td>{promotion.promoCode}</td>
								<td>{promotion.startDate.split('T')[0]}</td>
								<td>{promotion.endDate.split('T')[0]}</td>
								<td>{promotion.discount}</td>
								<td>{promotion.isActive ? "Yes" : "No"}</td>
								<td>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleEdit(promotion)}>Edit
									</button>
									<button className="btn btn-secondary btn-sm mr-2"
									        onClick={() => handleActivate(promotion)}>{promotion.isActive ? "De-Activate" : "Activate"}</button>
									<button className="btn btn-danger btn-sm"
									        onClick={() => handleDelete(promotion)}>Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}

			{modalVisible && (
				<dialog id="update_modal" className="modal modal-bottom sm:modal-middle" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">{updating ? "Update Promotion" : "Create Promotion"}</h3>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Promo Code</label>
							<input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Start Date</label>
							<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">End Date</label>
							<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Discount</label>
							<div className="relative">
								<input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
								       className="input input-bordered w-full pr-10"/>
								<span
									className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
							</div>
						</div>
						<div className="py-4 form-control">
							<label className="label cursor-pointer">
								<span className="label-text block text-sm font-medium text-gray-700">Active</span>
								<input type="checkbox" checked={isActive}
								       onChange={(e) => setIsActive(e.target.checked)} className="checkbox"/>
							</label>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Save</button>
							<button className="btn" onClick={() => setModalVisible(false)}>Close</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default ManagePromotions;