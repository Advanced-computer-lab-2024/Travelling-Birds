import React, { useState } from 'react';
import { toast } from 'react-toastify';


const ProductHomePage = () => {
	// Declare state variables u

	const [products, setProducts] = useState([]); // State to store the list of fetched products, initialized as an empty array
	const [loading, setLoading] = useState(false); // State to manage the loading status, initialized as false
	const [searchTerm, setSearchTerm] = useState(''); // State to hold the current search term entered by the user
	const [maxPrice, setMaxPrice] = useState(''); // State to hold the maximum price for filtering products
	const [isSearchActive, setIsSearchActive] = useState(false); // State to toggle the visibility of the search input field
	const [isFilterActive, setIsFilterActive] = useState(false); // State to toggle the visibility of the filter input field
	const [sortOrder, setSortOrder] = useState(''); // State to hold the current sorting order (e.g., ascending or descending)
	const [isSortActive, setIsSortActive] = useState(false); // State to toggle the visibility of the sort options dropdown


	const fetchProducts = async (search = '', filterPrice = '', sort = '') => {
		setLoading(true); // Set loading state to true to indicate that data fetching has started
		try {
			//  URL for fetching products
			let url = `${process.env.REACT_APP_BACKEND}/api/products`;

			// Modify the URL based on lw search, filter, or sort parameters mawgoden
			if (search) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${search}`;
			} else if (filterPrice) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/filter?maxPrice=${filterPrice}`;
			} else if (sort) {
				url = `${process.env.REACT_APP_BACKEND}/api/products/sort?productsOrder=${sort}`;
			}

			console.log("Fetching products from:", url); // Log the URL being fetched 34an debug
			const response = await fetch(url); // API request URL
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {

				toast.error(data.message || 'Failed to fetch products');
			}
		} catch (error) {
			console.error('Error fetching products:', error); // Log the error to the console for debugging
			toast.error('An error occurred while fetching products'); // Display a generic error notification to the user
		} finally {
			setLoading(false); // lw heya false m3nhaa eldata weslet khalas
		}
	};


	const handleSearchButtonClick = () => {
		setIsSearchActive((prev) => !prev); // Toggle the 'isSearchActive' state between true and false
	};


	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter' && searchTerm) { // byshoof lw fee search term we dost enter
			fetchProducts(searchTerm); // Fetch products based on the search term
			setIsSearchActive(false); // Hide the search input b3d el search
		}
	};

	const handleSearchBlur = () => {
		setIsSearchActive(false); // hide search input
	};


	const handleFilterButtonClick = () => {
		setIsFilterActive((prev) => !prev); // Toggle the 'isFilterActive' state between true and false
	};

	const handleFilterKeyPress = (e) => {
		if (e.key === 'Enter' && maxPrice) { //byshof lw fe maxPrice and enter is pressed
			fetchProducts('', maxPrice); // Fetch products based on the max price filter
			setIsFilterActive(false); // Hide the filter input field
		}
	};

	const handleSortButtonClick = () => {
		setIsSortActive((prev) => !prev); // Toggle the 'isSortActive' state between true and false
	};

	const handleSortSelection = (order) => {
		setSortOrder(order); // Update the 'sortOrder' state with the selected order
		fetchProducts('', '', order); // Fetch products 7sb selected sort order
		setIsSortActive(false); // Hide the sort options dropdown after selection
	};

	/**
	 * Handler for when the filter input field loses focus.
	 * Hides the filter input field.
	 */
	const handleFilterBlur = () => {
		setIsFilterActive(false); // hide the filter input
	};


	const handleViewProducts = () => {
		fetchProducts(); // Fetch all products by calling fetchProducts
	};

	const calculateAvgRating = (ratings) => {
		if (!ratings || ratings.length === 0) return 'No ratings'; // Return a default message if ratings are empty or undefined
		// Calculate the sum of all ratings and divide by the number of ratings to get the average
		const avgRating = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1);
		return avgRating; // Return the average rating as a string with one decimal place
	};


	return (
		<div
			className="relative flex flex-col justify-center items-center h-screen" // Apply Tailwind CSS classes for layout and styling
			style={{
				backgroundImage: "url('/my-image.jpg')", // Set the background image of the page
				backgroundSize: 'cover', // Ensure the background image covers the entire area
				backgroundPosition: 'center', // Center the background image
			}}
		>
			{/* Container for the top-right buttons with a higher z-index to ensure they appear above other elements */}
			<div className="absolute top-4 right-4 flex space-x-4 z-10">
				{/* Search Button and Input */}
				<div className="relative">
					<button
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl" // Styling for the search button
						onClick={handleSearchButtonClick} // Attach the click handler to toggle search input visibility
					>
						⌕ {/* Unicode character for the search icon */}
					</button>
					{isSearchActive && ( // 'isSearchActive' is true
						<input
							type="text" // Input type is text
							className="absolute top-14 right-0 px-4 py-2 rounded-lg border border-gray-300 w-40 z-20" // Styling for the search input
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
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl" // Styling for the filter button
						onClick={handleFilterButtonClick} // Attach the click handler to toggle filter input visibility
					>
						▽ {/* Unicode character representing a dropdown/filter icon */}
					</button>
					{isFilterActive && ( // Conditionally render the filter input field if 'isFilterActive' is true
						<input
							type="text" // Input type is text
							className="absolute top-14 right-0 px-4 py-2 rounded-lg border border-gray-300 w-40 z-20" // Styling for the filter input
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
						className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl" // Styling for the sort button
						onClick={handleSortButtonClick} // Attach the click handler to toggle sort options visibility
					>
						↓↑ {/* Unicode characters representing sort ascending and descending */}
					</button>
					{isSortActive && ( // Conditionally render the sort options dropdown if 'isSortActive' is true
						<div className="absolute top-14 right-0 bg-white rounded-lg shadow-lg z-20"> {/* Container for sort options with styling */}
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left" // Styling for the ascending sort option
								onClick={() => handleSortSelection('asc')} // Attach click handler to select ascending sort order
							>
								Ascending {/* Text for the ascending sort option */}
							</button>
							<button
								className="px-4 py-2 hover:bg-gray-300 w-full text-left" // Styling for the descending sort option
								onClick={() => handleSortSelection('desc')} // Attach click handler to select descending sort order
							>
								Descending {/* Text for the descending sort option */}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Center "View Products" Button, displayed only when there are no products */}
			{products.length === 0 && (
				<button
					className="px-20 py-10 text-4xl bg-white text-brown rounded-lg hover:bg-gray-500 hover:text-white transition duration-300 z-0" // Styling for the "View Products" button
					onClick={handleViewProducts} // Attach click handler to fetch all products
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
				<div className="absolute top-20 left-0 right-0 overflow-y-auto z-0 p-4"> {/* Container for the products list with styling */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Responsive grid layout for products */}
						{products.map((product) => ( // Iterate over each product in the 'products' array
							<div key={product._id} className="p-4 bg-white rounded-lg shadow-lg"> {/* Container for an individual product with styling */}
								<img
									src={`${process.env.REACT_APP_BACKEND}/uploads/${product.picture}`} // Image source constructed from backend URL and product picture filename
									alt={product.name} // Alt text for the image using the product's name
									className="w-full h-40 object-cover mb-2 rounded-lg" // Styling for the product image
								/>
								<h3 className="font-bold text-lg">{product.name}</h3> {/* Display the product's name */}
								<p>{product.description}</p> {/* Display the product's description */}
								<p><strong>Price:</strong> ${product.price}</p> {/* Display the product's price */}
								<p><strong>Available Quantity:</strong> {product.availableQuantity}</p> {/* Display the available quantity */}
								<p><strong>Average Rating:</strong> {calculateAvgRating(product.ratings)}</p> {/* Display the average rating calculated from ratings */}
								<p><strong>Reviews:</strong></p> {/* Label for the reviews section */}
								<ul className="list-disc ml-5"> {/* Unordered list for product reviews with bullet points */}
									{product.reviews.length > 0 ? ( // Check if there are any reviews
										product.reviews.map((review, index) => ( // Iterate over each review
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
		</div>
	);
};

export default ProductHomePage;
