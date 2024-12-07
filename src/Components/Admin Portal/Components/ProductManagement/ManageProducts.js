import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const ManageProducts = () => {
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
	const [imagePreview, setImagePreview] = useState(null);

	useEffect(() => {
		const fetchProducts = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/products/admin`)
				.then((response) => response.json())
				.then((data) => {
					setProducts(data);
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
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append('price', parseFloat(price));
		formData.append('availableQuantity', parseInt(availableQuantity, 10));
		if (picture) {
			formData.append('picture', picture);
		}
		formData.append('seller', seller);
		formData.append('isArchived', isArchived);
		fetch(endpoint, {
			method,
			body: formData
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

	const handleArchive = (product) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/products/${product._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({isArchived: !product.isArchived}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success(product.isArchived ? 'Product unarchived successfully' : 'Product archived successfully');
					setProducts(products.map(p => p._id === product._id ? {
						...product,
						isArchived: !product.isArchived
					} : p));
				} else {
					toast.error('Failed to archive/unarchive product');
				}
			});
	};

	const handleDelete = (product) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/products/${product._id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then(data => {
				if (data.message.includes('deleted')) {
					toast.success('Product deleted successfully');
					setProducts(products.filter(p => p._id !== product._id));
				} else {
					toast.error('Failed to delete product');
				}
			});
	};
	const handleViewImage = (product) => {
		let imageBase64 = null;
		if (product.picture?.data?.data && product.picture?.contentType) {
			try {
				const byteArray = new Uint8Array(product.picture?.data.data);
				const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
				imageBase64 = `data:${product.picture?.contentType};base64,${btoa(binaryString)}`;
			} catch (error) {
				console.error('Error converting image data to base64:', error);
			}
		}

		setImagePreview(imageBase64);
	}

	const closeImagePreview = () => {
		setImagePreview(null);
	};


	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
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
							<th>Seller</th>
							<th>Average Rating</th>
							<th className='w-[25%]'>Reviews</th>
							<th className='w-[25%]'>Actions</th>
						</tr>
						</thead>
						<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product.name}</td>
								<td>{product.description}</td>
								<td>{product.price}</td>
								<td>{product.availableQuantity}</td>
								<td>{product.purchases.reduce((acc, purchase) => acc + purchase.quantity, 0)}</td>
								<td>{product.sellerName}</td>
								<td>{product.ratings}</td>
								<td>{product.reviews?.join(', ')}</td>
								<td>
									<button className="btn btn-primary btn-sm mr-2"
									        onClick={() => handleUpdate(product)}>Edit
									</button>
									<button className="btn btn-secondary btn-sm mr-2"
									        onClick={() => handleArchive(product)}>
										{product.isArchived ? 'Un-archive' : 'Archive'}
									</button>
									<button className="btn btn-info btn-sm mr-2"
									        onClick={() => handleViewImage(product)}>View Image
									</button>
									<button className="btn btn-danger btn-sm"
									        onClick={() => handleDelete(product)}>Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
			{imagePreview && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeImagePreview}>
					<div className="bg-white p-4 rounded shadow-md flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
						<img src={imagePreview} alt="Product" className="max-w-full max-h-screen mb-4" />
						<p className="text-gray-700">Click outside the box to exit.</p>
					</div>
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
							<label className="block text-sm font-medium text-gray-700">Image</label>
							<input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])}
							       className="w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Save</button>
							<button className="btn" onClick={() => setModalVisible(false)}>Close</button>
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
							<label className="block text-sm font-medium text-gray-700">Image</label>
							<input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])}
							       className="w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Create</button>
							<button className="btn" onClick={() => setCreateModalVisible(false)}>Close</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default ManageProducts;