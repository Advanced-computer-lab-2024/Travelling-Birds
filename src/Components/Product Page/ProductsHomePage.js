// src/Components/Product Page/ProductHomePage.js

import React, {useState} from 'react'; // Import React and necessary hooks
import {toast} from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles

const ProductHomePage = () => {
	const [products, setProducts] = useState([]); // State to store the list of fetched products
	const [loading, setLoading] = useState(false); // State to manage the loading status
	const [searchTerm, setSearchTerm] = useState(''); // State to hold the current search term entered by the user
	const [maxPrice, setMaxPrice] = useState(''); // State to hold the maximum price for filtering products
	const [isSearchActive, setIsSearchActive] = useState(false); // State to toggle the visibility of the search input field
	const [isFilterActive, setIsFilterActive] = useState(false); // State to toggle the visibility of the filter input field
	const [sortOrder, setSortOrder] = useState(''); // State to hold the current sorting order (e.g., ascending or descending)
	const [isSortActive, setIsSortActive] = useState(false); // State to toggle the visibility of the sort options dropdown
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State to toggle the visibility of the create product modal
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

	/**
	 * Fetch products from the backend API.
	 * Can fetch all products, search by name, filter by max price, or sort by rating.
	 *
	 * @param {string} search - The search term to filter products by name.
	 * @param {string} filterPrice - The maximum price to filter products.
	 * @param {string} sort - The sort order ('asc' or 'desc').
	 */
	const fetchProducts = async (search = '', filterPrice = '', sort = '') => {
		setLoading(true); // Set loading state to true to indicate that data fetching has started
		try {
			// Initialize the base URL for fetching products
			let url = `${process.env.REACT_APP_BACKEND}/api/products`;

			// Modify the URL based on the presence of search, filter, or sort parameters
			if (search) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${encodeURIComponent(search)}`;
			} else if (filterPrice) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/filter?maxPrice=${encodeURIComponent(filterPrice)}`;
			} else if (sort) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/sort?productsOrder=${encodeURIComponent(sort)}`;
			}

			console.log("Fetching products from:", url); // Log the URL being fetched for debugging purposes
			const response = await fetch(url); // Make the API request to the constructed URL
			const data = await response.json(); // Parse the JSON response

			if (response.ok) { // Check if the response status is OK (status code 200-299)
				setProducts(data); // Update the 'products' state with the fetched data
			} else {
				// If the response is not OK, display an error notification with the message from the response or a default message
				toast.error(data.message || 'Failed to fetch products');
			}
		} catch (error) { // Catch any errors that occur during the fetch operation
			console.error('Error fetching products:', error); // Log the error to the console for debugging
			toast.error('An error occurred while fetching products'); // Display a generic error notification to the user
		} finally {
			setLoading(false); // Set loading state to false to indicate that data fetching has completed
		}
	};


	/**
	 * Handler for the search button click event.
	 * Toggles the visibility of the search input field.
	 */
	const handleSearchButtonClick = () => {
		setIsSearchActive((prev) => !prev); // Toggle the 'isSearchActive' state between true and false
	};

	/**
	 * Handler for key press events in the search input field.
	 * Initiates a search when the Enter key is pressed.
	 *
	 * @param {Object} e - The event object.
	 */
	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter' && searchTerm) { // Check if the pressed key is Enter and if a search term exists
			fetchProducts(searchTerm); // Fetch products based on the search term
			setIsSearchActive(false); // Hide the search input field after initiating the search
		}
	};

	/**
	 * Handler for when the search input field loses focus.
	 * Hides the search input field.
	 */
	const handleSearchBlur = () => {
		setIsSearchActive(false); // Set 'isSearchActive' to false to hide the search input
	};

	/**
	 * Handler for the filter button click event.
	 * Toggles the visibility of the filter input field.
	 */
	const handleFilterButtonClick = () => {
		setIsFilterActive((prev) => !prev); // Toggle the 'isFilterActive' state between true and false
	};

	/**
	 * Handler for key press events in the filter input field.
	 * Initiates a filter when the Enter key is pressed.
	 *
	 * @param {Object} e - The event object.
	 */
	const handleFilterKeyPress = (e) => {
		if (e.key === 'Enter' && maxPrice) { // Check if the pressed key is Enter and if a max price is entered
			fetchProducts('', maxPrice); // Fetch products based on the max price filter
			setIsFilterActive(false); // Hide the filter input field after initiating the filter
		}
	};

	/**
	 * Handler for the sort button click event.
	 * Toggles the visibility of the sort options dropdown.
	 */
	const handleSortButtonClick = () => {
		setIsSortActive((prev) => !prev); // Toggle the 'isSortActive' state between true and false
	};

	/**
	 * Handler for selecting a sort option.
	 * Sets the sort order and fetches products based on the selected order.
	 *
	 * @param {string} order - The selected sort order ('asc' or 'desc').
	 */
	const handleSortSelection = (order) => {
		setSortOrder(order); // Update the 'sortOrder' state with the selected order
		fetchProducts('', '', order); // Fetch products based on the selected sort order
		setIsSortActive(false); // Hide the sort options dropdown after selection
	};

	/**
	 * Handler for when the filter input field loses focus.
	 * Hides the filter input field.
	 */
	const handleFilterBlur = () => {
		setIsFilterActive(false); // Set 'isFilterActive' to false to hide the filter input
	};

	/**
	 * Handler for the "View Products" button click event.
	 * Fetches all products without any filters or sorting.
	 */
	const handleViewProducts = () => {
		fetchProducts(); // Fetch all products by calling fetchProducts without any arguments
	};

	/**
	 * Function to calculate the average rating from an array of ratings.
	 *
	 * @param {Array<number>} ratings - An array of numerical ratings.
	 * @returns {string} - The average rating rounded to one decimal place or a message if no ratings exist.
	 */
	const calculateAvgRating = (ratings) => {
		if (!ratings || ratings.length === 0) return 'No ratings'; // Return a default message if ratings are empty or undefined
		// Calculate the sum of all ratings and divide by the number of ratings to get the average
		const avgRating = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1);
		return avgRating; // Return the average rating as a string with one decimal place
	};

	/**
	 * Handler for the "Create Product" button click event.
	 * Opens the create product modal.
	 */
	const handleCreateButtonClick = () => {
		setIsCreateModalOpen(true); // Set 'isCreateModalOpen' to true to show the modal
	};

	/**
	 * Handler for changes in the create product form inputs.
	 *
	 * @param {Object} e - The event object.
	 */
	const handleNewProductChange = (e) => {
		const {name, value} = e.target; // Destructure name and value from the input
		setNewProduct({...newProduct, [name]: value}); // Update the 'newProduct' state with the new value
	};

	/**
	 * Handler for submitting the create product form.
	 * Sends a POST request to the backend to create a new product.
	 */
	const handleCreateProduct = async () => {
		// Basic validation to ensure required fields are filled
		if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.availableQuantity || !newProduct.picture) {
			toast.error('Please fill in all required fields');
			return;
		}

		console.log("Creating product with data:", newProduct);  // Log the new product data

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newProduct),
			});

			const data = await response.json();
			console.log("Response data:", data);  // Log response data

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
				backgroundImage: "url('/my-image.jpg')", // Set the background image of the page
				backgroundSize: 'cover', // Ensure the background image covers the entire area
				backgroundPosition: 'center', // Center the background image
			}}
		>
			{/* Top-left "Create Product" button */}
			<div className="absolute top-4 left-4 z-10">
				<button
					className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition duration-300 text-2xl"
					onClick={handleCreateButtonClick}
					title="Create Product"
				>
					＋ {/* Unicode for plus sign */}
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
						⌕ {/* Unicode character for the search icon */}
					</button>
					{isSearchActive && ( // Conditionally render the search input field if 'isSearchActive' is true
						<input
							type="text" // Input type is text
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
						▽ {/* Unicode character representing a filter icon */}
					</button>
					{isFilterActive && ( // Conditionally render the filter input field if 'isFilterActive' is true
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
						↓↑ {/* Unicode characters representing sort ascending and descending */}
					</button>
					{isSortActive && ( // Conditionally render the sort options dropdown if 'isSortActive' is true
						<div className="absolute top-14 right-0 bg-white rounded-lg shadow-lg z-20">
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left"
								onClick={() => handleSortSelection('asc')} // Attach click handler to select ascending sort order
							>
								Ascending {/* Text for the ascending sort option */}
							</button>
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left"
								onClick={() => handleSortSelection('desc')} // Attach click handler to select descending sort order
							>
								Descending {/* Text for the descending sort option */}
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
					View Products {/* Text displayed on the button */}
				</button>
			)}

			{/* Display a loading message when products are being fetched */}
			{loading && (
				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-xl z-0">
					Loading products... {/* Text displayed during loading */}
				</div>
			)}

			{/* Display the list of fetched products when available */}
			{products.length > 0 && (
				<div className="absolute top-20 left-0 right-0 overflow-y-auto z-0 p-4 max-h-screen">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{products.map((product) => (
							<div key={product._id} className="p-4 bg-white rounded-lg shadow-lg">
								<img
									src={`${process.env.REACT_APP_BACKEND}/uploads/${product.picture}`} // Image source constructed from backend URL and product picture filename
									alt={product.name} // Alt text for the image using the product's name
									className="w-full h-40 object-cover mb-2 rounded-lg"
								/>
								<h3 className="font-bold text-lg">{product.name}</h3> {/* Display the product's name */}
								<p>{product.description}</p> {/* Display the product's description */}
								<p><strong>Price:</strong> ${product.price}</p> {/* Display the product's price */}
								<p><strong>Available Quantity:</strong> {product.availableQuantity}
								</p> {/* Display the available quantity */}
								<p><strong>Average Rating:</strong> {calculateAvgRating(product.ratings)}
								</p> {/* Display the average rating calculated from ratings */}
								<p><strong>Reviews:</strong></p> {/* Label for the reviews section */}
								<ul className="list-disc ml-5">
									{product.reviews.length > 0 ? ( // Check if there are any reviews
										product.reviews.map((review, index) => (
											<li key={index}>{review}</li> // Display each review as a list item
										))
									) : (
										<li>No reviews yet</li> // Display a message if there are no reviews
									)}
								</ul>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Create Product Modal */}
			{isCreateModalOpen && (
				<div
					className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
						<h2 className="text-2xl mb-4">Create New Product</h2>
						<form onSubmit={(e) => {
							e.preventDefault();
							handleCreateProduct();
						}}>
							<div className="mb-4">
								<label className="block text-gray-700">Name<span
									className="text-red-500">*</span></label>
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
								<label className="block text-gray-700">Description<span
									className="text-red-500">*</span></label>
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
								<label className="block text-gray-700">Available Quantity<span
									className="text-red-500">*</span></label>
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
								<label className="block text-gray-700">Picture URL<span
									className="text-red-500">*</span></label>
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
							{/* Ratings and Reviews can be added here if needed */}
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
