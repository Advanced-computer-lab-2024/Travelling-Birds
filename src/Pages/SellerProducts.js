import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const SellerProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [availableQuantity, setAvailableQuantity] = useState('');
	const [picture, setPicture] = useState('');
	const [seller, setSeller] = useState(sessionStorage.getItem('user id'));
	const [isArchived, setIsArchived] = useState(false);

	const average = (array) => {
		if (array.length === 0) {
			return 0;
		}
		return array.reduce((a, b) => a + b) / array.length;
	}

	const clearFields = () => {
		setName('');
		setDescription('');
		setPrice('');
		setAvailableQuantity('');
		setPicture('');
		setIsArchived(false);
		setSelectedProduct(null);
		setModalVisible(false);
		setCreateModalVisible(false);
	}

	useEffect(() => {
		const fetchProducts = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/products/admin`)
				.then((response) => response.json())
				.then((data) => {
					setProducts(data.filter(product => product.seller === sessionStorage.getItem('user id')));
					setLoading(false);
				});
		}
		fetchProducts();
	}, []);

	const handleUpdate = (product) => {
		setSelectedProduct(product);
		setName(product.name);
		setDescription(product.description);
		setPrice(product.price);
		setAvailableQuantity(product.availableQuantity);
		setPicture(product.picture);
		setSeller(product.seller);
		setIsArchived(product.isArchived);
		setModalVisible(true);
	};

	const handleSave = () => {
		const endpoint = selectedProduct ? `${process.env.REACT_APP_BACKEND}/api/products/${selectedProduct._id}` : `${process.env.REACT_APP_BACKEND}/api/products`;
		const method = selectedProduct ? 'PUT' : 'POST';
		fetch(endpoint, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name, description, price, availableQuantity, picture, seller, isArchived}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success(selectedProduct ? 'Product updated successfully' : 'Product created successfully');
					setProducts(selectedProduct ? products.map(product => product._id === selectedProduct._id ? data : product) : [...products, data]);
					setModalVisible(false);
					setCreateModalVisible(false);
				} else {
					toast.error('Failed to save product');
				}
			});
	};

	const handleArchive = (id, isArchived) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/products/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({isArchived: !isArchived}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success(isArchived ? 'Product unarchived successfully' : 'Product archived successfully');
					setProducts(products.map(product => product._id === id ? {
						...product,
						isArchived: !isArchived
					} : product));
				} else {
					toast.error('Failed to archive/unarchive product');
				}
			});
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">My Products</h2>
			<button className="btn btn-primary mb-2" onClick={() => setCreateModalVisible(true)}>Add Product</button>
			{!loading && (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Sold</th>
							<th>Average Rating</th>
							<th>Reviews</th>
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product.name}</td>
								<td>{product.description}</td>
								<td>{product.price}</td>
								<td>{product.availableQuantity}</td>
								<td>{product.userPurchased.length}</td>
								<td>{average(product.ratings)}</td>
								<td>{product.reviews?.join(', ')}</td>
								<td>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleUpdate(product)}>Edit
									</button>
									<button className="btn btn-secondary btn-sm mr-2"
									        onClick={() => handleArchive(product._id, product.isArchived)}>
										{product.isArchived ? 'Unarchive' : 'Archive'}
									</button>
									<button className="btn btn-info btn-sm"
									        onClick={() => window.open(product.picture, '_blank')}>View Image
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
						<h3 className="font-bold text-lg">Update Product</h3>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input type="text" value={name} onChange={(e) => setName(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Description</label>
							<textarea value={description} onChange={(e) => setDescription(e.target.value)}
							          className="textarea textarea-bordered w-full"></textarea>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Price</label>
							<input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Available Quantity</label>
							<input type="number" value={availableQuantity}
							       onChange={(e) => setAvailableQuantity(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Picture URL</label>
							<input type="text" value={picture} onChange={(e) => setPicture(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Save</button>
							<button className="btn" onClick={() => {setModalVisible(false); clearFields();}}>Close</button>
						</div>
					</div>
				</dialog>
			)}

			{createModalVisible && (
				<dialog id="create_modal" className="modal modal-bottom sm:modal-middle" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">Create Product</h3>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input type="text" value={name} onChange={(e) => setName(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Description</label>
							<textarea value={description} onChange={(e) => setDescription(e.target.value)}
							          className="textarea textarea-bordered w-full"></textarea>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Price</label>
							<input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Available Quantity</label>
							<input type="number" value={availableQuantity}
							       onChange={(e) => setAvailableQuantity(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Picture URL</label>
							<input type="text" value={picture} onChange={(e) => setPicture(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Create</button>
							<button className="btn" onClick={() => {setCreateModalVisible(false); clearFields();}}>Close</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default SellerProducts;