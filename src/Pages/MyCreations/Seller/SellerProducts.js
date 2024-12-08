import {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const SellerDashboard = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [availableQuantity, setAvailableQuantity] = useState('');
	const [picture, setPicture] = useState(null);
	const [isArchived, setIsArchived] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const [salesReport, setSalesReport] = useState({totalRevenue: 0, totalSales: 0});
	const [filters, setFilters] = useState({productId: '', startDate: '', endDate: ''});

	const clearFields = () => {
		setName('');
		setDescription('');
		setPrice('');
		setAvailableQuantity('');
		setPicture(null);
		setIsArchived(false);
		setSelectedProduct('');
		setModalVisible(false);
		setCreateModalVisible(false);
		setImagePreview(null);
	};

	useEffect(() => {
		const fetchProducts = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/products/admin`)
				.then((response) => response.json())
				.then((data) => {
					setProducts(data.filter(product => product.seller._id === sessionStorage.getItem('user id')));
					setLoading(false);
				});
		};
		fetchProducts();
	}, []);

	useEffect(() => {
		fetchSalesReport();
	}, [filters]);

	const fetchSalesReport = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/sales/${sessionStorage.getItem('user id')}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(filters),
			});
			const data = await response.json();
			setSalesReport(data);
		} catch (error) {
			console.error('Error fetching sales report:', error);
		}
	};

	const handleFilterChange = (e) => {
		setFilters({...filters, [e.target.name]: e.target.value});
	};

	const handleUpdate = (product) => {
		setSelectedProduct(product._id);
		setName(product.name);
		setDescription(product.description);
		setPrice(product.price);
		setAvailableQuantity(product.availableQuantity);
		setPicture(null);	
		setIsArchived(product.isArchived);
		setModalVisible(true);
	};

	const handleSave = () => {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append('price', parseFloat(price));
		formData.append('availableQuantity', parseInt(availableQuantity, 10));
		if (picture) {
			formData.append('picture', picture);
		}
		formData.append('isArchived', isArchived);

		const endpoint = selectedProduct ? `${process.env.REACT_APP_BACKEND}/api/products/${selectedProduct}` : `${process.env.REACT_APP_BACKEND}/api/products`;
		const method = selectedProduct ? 'PUT' : 'POST';

		fetch(endpoint, {
			method,
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success(selectedProduct ? 'Product updated successfully' : 'Product created successfully');
					setProducts(selectedProduct ? products.map(product => product._id === selectedProduct ? data : product) : [...products, data]);
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

	const handleViewImage = (product) => {
		const fetchImage = async (product) => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${product._id}`);
				const p = await response.json();

				let imageBase64 = null;
				if (p.picture?.data?.data && p.picture?.contentType) {
					try {
						const byteArray = new Uint8Array(p.picture?.data.data);
						const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
						imageBase64 = `data:${p.picture?.contentType};base64,${btoa(binaryString)}`;
					} catch (error) {
						console.error('Error converting image data to base64:', error);
					}
				}

				setImagePreview(imageBase64);
			} catch (error) {
				console.error('Error fetching image:', error);
			}
		};
		fetchImage(product).then();
	}

	const closeImagePreview = () => {
		setImagePreview(null);
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Sales Report</h2>
			<div className="mb-4">
				<label className="block mb-1">Product</label>
				<select
					name="productId"
					value={filters.productId}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				>
					<option value="">All Products</option>
					{products.map((product) => (
						<option key={product._id} value={product._id}>{product.name}</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label className="block mb-1">Start Date</label>
				<input
					type="date"
					name="startDate"
					value={filters.startDate}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1">End Date</label>
				<input
					type="date"
					name="endDate"
					value={filters.endDate}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				/>
			</div>
			<button
				onClick={fetchSalesReport}
				className="bg-blue-500 text-white p-3 rounded-lg"
			>
				Filter
			</button>
			<div className="mt-6">
				<h3 className="text-xl font-semibold">Total Revenue: ${salesReport.totalRevenue}</h3>
				<h3 className="text-xl font-semibold">Total Sales: {salesReport.totalSales}</h3>
			</div>

			<h2 className="text-2xl font-bold mb-4 mt-8">My Products</h2>
			<button className="btn btn-primary mb-2" onClick={() => setCreateModalVisible(true)}>Add Product</button>
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
							<td>{product.purchases.reduce((acc, purchase) => acc + purchase.quantity, 0)}</td>
							<td>{product.ratings}</td>
							<td>{product.reviews?.map((review, index) => <div key={index}>{review}</div>)}</td>
							<td>
								<button className="btn btn-primary btn-sm mr-2"
								        onClick={() => handleUpdate(product)}>Edit
								</button>
								<button className="btn btn-secondary btn-sm mr-2"
								        onClick={() => handleArchive(product._id, product.isArchived)}>
									{product.isArchived ? 'Unarchive' : 'Archive'}
								</button>
								<button className="btn btn-info btn-sm" onClick={() => handleViewImage(product)}>View
									Image
								</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>

			{imagePreview && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
				     onClick={closeImagePreview}>
					<div className="bg-white p-4 rounded shadow-md flex flex-col items-center"
					     onClick={(e) => e.stopPropagation()}>
						<img src={imagePreview} alt="Product" className="max-w-full max-h-screen mb-4"/>
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
							<button className="btn" onClick={() => {
								setModalVisible(false);
								clearFields();
							}}>Close
							</button>
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
							<button className="btn" onClick={() => {
								setCreateModalVisible(false);
								clearFields();
							}}>Close
							</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
};

export default SellerDashboard;