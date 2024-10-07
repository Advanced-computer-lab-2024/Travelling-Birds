// src/Components/Product Page/ProductHomePage.js

import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';

const ProductHomePage = () => {
	// State Variables
	const [products, setProducts] = useState([]); // State to store the list of fetched products
	const [loading, setLoading] = useState(false); // State to manage the loading status
	const [searchTerm, setSearchTerm] = useState(''); // State to hold the current search term entered by the user
	const [maxPrice, setMaxPrice] = useState(''); // State to hold the maximum price for filtering products
	const [isSearchActive, setIsSearchActive] = useState(false); // State to toggle the visibility of the search input field
	const [isFilterActive, setIsFilterActive] = useState(false); // State to toggle the visibility of the filter input field
	const [sortOrder, setSortOrder] = useState(''); // State to hold the current sorting order (e.g., ascending or descending)
	const [isSortActive, setIsSortActive] = useState(false); // State to toggle the visibility of the sort options dropdown
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State to toggle the visibility of the create product modal
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to toggle the update product modal
	const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the product being edited
	const [newProduct, setNewProduct] = useState({ // State to hold the new product's details

		name: '',
		description: '',
		price: '',
		availableQuantity: '',
		picture: '',
		ratings: [],
		reviews: [],
		seller: sessionStorage.getItem('user id') || '60d21b4667d0d8992e610c87'
	});

	const fetchProducts = async (search = '', filterPrice = '', sort = '', deleteProduct ='') => {
		setLoading(true);
		try {

			let url = `${process.env.REACT_APP_BACKEND}/api/products`;


			if (search) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${encodeURIComponent(search)}`;
			} else if (filterPrice) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/filter?maxPrice=${encodeURIComponent(filterPrice)}`;
			} else if (sort) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/sort?productsOrder=${encodeURIComponent(sort)}`;
			}else if (deleteProduct) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/delete?productsOrder=${encodeURIComponent(deleteProduct)}`;
			}


			console.log("Fetching products from:", url);
			const response = await fetch(url);
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {

				toast.error(data.message || 'Failed to fetch products');
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			toast.error('An error occurred while fetching products');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProduct = (product) => {
		setSelectedProduct(product);
		setIsUpdateModalOpen(true);
	};

	// Submit updated product to the backend
	const handleUpdateProductSubmit = async () => {
		if (!selectedProduct) return;


		console.log('Submitting product:', selectedProduct);

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${selectedProduct._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(selectedProduct),
			});

			const data = await response.json();
			console.log('Backend response:', data);

			if (response.ok) {
				toast.success('Product updated successfully');
				setIsUpdateModalOpen(false);
				setSelectedProduct(null);
				fetchProducts();
			} else {
				toast.error('Failed to update product');
			}
		} catch (error) {
			toast.error('An error occurred while updating the product');
			console.error('Error:', error); // Log error for debugging
		}
	};

	// Handle input changes in the update modal
	const handleProductChange = (e) => {
		const { name, value } = e.target;
		setSelectedProduct((prevProduct) => ({
			...prevProduct,
			[name]: value,
		}));
	};

	const handleDeleteProduct = async (productId) => {
		if (!window.confirm('Are you sure you want to delete this product?')) {
			return;
		}
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}`, {
				method: 'DELETE',
			});

			const data = await response.json();
			if (response.ok) {
				toast.success('Product deleted successfully');
				fetchProducts();  // Refresh the product list after deletion
			} else {
				toast.error(data.message || 'Failed to delete product');
			}
		} catch (error) {
			console.error('Error deleting product:', error);
			toast.error('An error occurred while deleting the product');
		}
	};

	const handleSearchButtonClick = () => {
		setIsSearchActive((prev) => !prev);
	};


	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter' && searchTerm) {
			fetchProducts(searchTerm);
			setIsSearchActive(false);
		}
	};


	const handleSearchBlur = () => {
		setIsSearchActive(false);
	};


	const handleFilterButtonClick = () => {
		setIsFilterActive((prev) => !prev);
	};


	const handleFilterKeyPress = (e) => {
		if (e.key === 'Enter' && maxPrice) {
			fetchProducts('', maxPrice);
			setIsFilterActive(false);
		}
	};

	const handleSortButtonClick = () => {
		setIsSortActive((prev) => !prev);
	};


	const handleSortSelection = (order) => {
		setSortOrder(order);
		fetchProducts('', '', order);
		setIsSortActive(false);
	};

	const handleFilterBlur = () => {
		setIsFilterActive(false);
	};


	const handleViewProducts = () => {
		fetchProducts();
	};


	const calculateAvgRating = (ratings) => {
		if (!ratings || ratings.length === 0) return 'No ratings';

		const avgRating = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1);
		return avgRating;
	};

	const handleCreateButtonClick = () => {
		setIsCreateModalOpen(true);
	};

	const handleNewProductChange = (e) => {
		const { name, value } = e.target;
		setNewProduct({ ...newProduct, [name]: value });
	};


	const handleCreateProduct = async () => {

		if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.availableQuantity || !newProduct.picture) {
			toast.error('Please fill in all required fields');
			return;
		}

		console.log("Creating product with data:", newProduct);

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newProduct),
			});

			const data = await response.json();
			console.log("Response data:", data);

			if (response.ok) {
				toast.success('Product created successfully');
				setIsCreateModalOpen(false);
				setNewProduct({
					name: '',
					description: '',
					price: '',
					availableQuantity: '',
					picture: '',
					ratings: [],
					reviews: [],
				});
				fetchProducts(); // Refresh the product list
			} else {
				toast.error(data.message || 'Failed to create product');
			}
		} catch (error) {
			console.error('Error creating product:', error);
			toast.error('An error occurred while creating the product');
		}
	};

	return (
		<div
			className="relative flex flex-col justify-center items-center h-screen"
			style={{
				backgroundImage: "url('/my-image.jpg')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* Top-left "Create Product" button */}
			<div className="absolute top-4 left-4 z-10">
				<button
					className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition duration-300 text-2xl"
					onClick={handleCreateButtonClick}
					title="Create Product"
				>
					＋
				</button>
			</div>

			{/* Top-right buttons for Search, Filter, and Sort */}
			<div className="absolute top-4 right-4 flex space-x-4 z-10">
				{/* Search Button and Input */}
				<div className="relative">
					<button
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl"
						onClick={handleSearchButtonClick}
						title="Search Products"
					>
						⌕
					</button>
					{isSearchActive && (
						<input
							type="text"
							className="absolute top-14 right-0 px-4 py-2 rounded-lg border border-gray-300 w-40 z-20"
							placeholder="Search products..." // Placeholder text for the input
							value={searchTerm} // Bind the input value to 'searchTerm' state
							onChange={(e) => setSearchTerm(e.target.value)} // Update 'searchTerm' state on input change
							onKeyPress={handleSearchKeyPress} // Attach key press handler to detect Enter key
							onBlur={handleSearchBlur} // Attach blur handler to hide the input when it loses focus
						/>
					)}
				</div>

				{/* Filter Button and Input */}
				<div className="relative">
					<button
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl"
						onClick={handleFilterButtonClick}
						title="Filter by Max Price"
					>
						▽
					</button>
					{isFilterActive && (
						<input
							type="number" // Input type is number for price
							className="absolute top-14 right-0 px-4 py-2 rounded-lg border border-gray-300 w-40 z-20"
							placeholder="Max Price..." // Placeholder text for the input
							value={maxPrice} // Bind the input value to 'maxPrice' state
							onChange={(e) => setMaxPrice(e.target.value)} // Update 'maxPrice' state on input change
							onKeyPress={handleFilterKeyPress} // Attach key press handler to detect Enter key
							onBlur={handleFilterBlur} // Attach blur handler to hide the input when it loses focus
						/>
					)}
				</div>

				{/* Sort Button and Dropdown */}
				<div className="relative">
					<button
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl"
						onClick={handleSortButtonClick}
						title="Sort Products"
					>
						↓↑
					</button>
					{isSortActive && (
						<div className="absolute top-14 right-0 bg-white rounded-lg shadow-lg z-20">
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left"
								onClick={() => handleSortSelection('asc')}
							>
								Ascending
							</button>
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left"
								onClick={() => handleSortSelection('desc')}
							>
								Descending
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Center "View Products" Button, displayed only when there are no products */}
			{products.length === 0 && !loading && (
				<button
					className="px-20 py-10 text-4xl bg-white text-black rounded-lg hover:bg-gray-500 hover:text-white transition duration-300 z-0"
					onClick={handleViewProducts}
				>
					View Products
				</button>
			)}

			{/* Display a loading message when products are being fetched */}
			{loading && (
				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-xl z-0">
					Loading products...
				</div>
			)}

			{/* Display the list of fetched products when available */}
			{products.length > 0 && (
				<div className="absolute top-20 left-0 right-0 overflow-y-auto z-0 p-4 max-h-screen">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{products.map((product) => (
							<div key={product._id} className="p-4 bg-white rounded-lg shadow-lg relative">


								<img
									src={`${process.env.REACT_APP_BACKEND}/uploads/${product.picture}`}
									alt={product.name}
									className="w-full h-40 object-cover mb-2 rounded-lg"
								/>
								<h3 className="font-bold text-lg">{product.name}</h3>
								<p>{product.description}</p>
								<p><strong>Price:</strong> ${product.price}</p>
								<p><strong>Available Quantity:</strong> {product.availableQuantity}</p>
								<p><strong>Average Rating:</strong> {calculateAvgRating(product.ratings)}</p>
								<p><strong>Reviews:</strong></p>
								<ul className="list-disc ml-5">
									{product.reviews.length > 0 ? (
										product.reviews.map((review, index) => (
											<li key={index}>{review}</li>
										))
									) : (
										<li>No reviews yet</li>
									)}
								</ul>
								{/* Edit Button */}
								<button
									onClick={() => handleUpdateProduct(product)}
									className="absolute top-2 right-10 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
									title="Edit Product"
								>
									✎
								</button>

								<button
									onClick={() => handleDeleteProduct(product._id)}
									className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300"
									title="Delete Product"
								>
									⌫
								</button>
							</div>
						))}

					</div>
				</div>
			)}
			{/* Update Product Modal */}
			{isUpdateModalOpen && selectedProduct && (
				<div
					className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
						<h2 className="text-2xl mb-4">Update Product</h2>
						<form onSubmit={handleUpdateProductSubmit}>
							<div className="mb-4">
								<label className="block text-gray-700">Name<span className="text-red-500">*</span></label>
								<input
									type="text"
									name="name"
									placeholder="Name"
									value={selectedProduct.name}
									onChange={handleProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Description<span className="text-red-500">*</span></label>
								<textarea
									name="description"
									placeholder="Description"
									value={selectedProduct.description}
									onChange={handleProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								></textarea>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Price ($)<span className="text-red-500">*</span></label>
								<input
									type="number"
									name="price"
									placeholder="Price"
									value={selectedProduct.price}
									onChange={handleProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									min="0"
									step="0.01"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Available Quantity<span className="text-red-500">*</span></label>
								<input
									type="number"
									name="availableQuantity"
									placeholder="Available Quantity"
									value={selectedProduct.availableQuantity}
									onChange={handleProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									min="0"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Picture URL<span className="text-red-500">*</span></label>
								<input
									type="text"
									name="picture"
									placeholder="Picture URL"
									value={selectedProduct.picture}
									onChange={handleProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								/>
							</div>
							{/* Ratings and Reviews can be added here lw m7tgenha */}
							<div className="flex justify-end space-x-2 mt-6">
								<button
									type="button"
									onClick={() => { setIsUpdateModalOpen(false); setSelectedProduct(null); }}
									className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
								>
									Update
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Create Product Modal */}
			{isCreateModalOpen && (
				<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
						<h2 className="text-2xl mb-4">Create New Product</h2>
						<form onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
							<div className="mb-4">
								<label className="block text-gray-700">Name<span className="text-red-500">*</span></label>
								<input
									type="text"
									name="name"
									placeholder="Name"
									value={newProduct.name}
									onChange={handleNewProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Description<span className="text-red-500">*</span></label>
								<textarea
									name="description"
									placeholder="Description"
									value={newProduct.description}
									onChange={handleNewProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								></textarea>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Price ($)<span className="text-red-500">*</span></label>
								<input
									type="number"
									name="price"
									placeholder="Price"
									value={newProduct.price}
									onChange={handleNewProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									min="0"
									step="0.01"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Available Quantity<span className="text-red-500">*</span></label>
								<input
									type="number"
									name="availableQuantity"
									placeholder="Available Quantity"
									value={newProduct.availableQuantity}
									onChange={handleNewProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									min="0"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Picture URL<span className="text-red-500">*</span></label>
								<input
									type="text"
									name="picture"
									placeholder="Picture URL"
									value={newProduct.picture}
									onChange={handleNewProductChange}
									className="w-full p-2 border border-gray-300 rounded mt-1"
									required
								/>
							</div>
							{/* Ratings and Reviews can be added here lw m7tagenha */}
							<div className="flex justify-end space-x-2 mt-6">
								<button
									type="button"
									onClick={() => setIsCreateModalOpen(false)}
									className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
								>
									Create
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);


};

export default ProductHomePage; // Export the ProductHomePage component as the default export
