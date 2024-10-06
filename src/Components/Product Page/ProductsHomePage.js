import React, {useState} from 'react';
import {toast} from 'react-toastify'; // Optional: To show notifications

const ProductHomePage = () => {
	const [products, setProducts] = useState([]); // State to store fetched products
	const [loading, setLoading] = useState(false); // State to show loading spinner or message

	// Function to fetch products from the backend
	const fetchProducts = async () => {
		setLoading(true); // Start loading spinner
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products`;
			console.log("Fetching products from:", url);
			const response = await fetch(url);
			const data = await response.json();

			if (response.ok) {
				setProducts(data); // Update state with fetched products
			} else {
				toast.error(data.message || 'Failed to fetch products');
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			toast.error('An error occurred while fetching products');
		} finally {
			setLoading(false); // Stop loading spinner
		}
	};

	// Handle button click to view products
	const handleViewProducts = () => {
		fetchProducts().then(r => r);
	};

	// Function to calculate average rating from the ratings array
	const calculateAvgRating = (ratings) => {
		if (!ratings || ratings.length === 0) return 'No ratings';
		const avgRating = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1);
		return avgRating;
	};

	return (
		<div
			className="relative flex justify-center items-center h-screen"
			style={{
				backgroundImage: "url('/my-image.jpg')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* Top-right buttons */}
			<div className="absolute top-4 right-4 flex space-x-4">
				<button
					className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl">
					⌕
				</button>
				<button
					className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl">
					↓↑
				</button>
				<button
					className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300 text-xl">
					▽
				</button>
			</div>

			{/* Center button to view products */}
			<button
				className="px-20 py-10 text-4xl bg-white text-brown rounded-lg hover:bg-gray-500 hover:text-white transition duration-300"
				onClick={handleViewProducts}
			>
				View Products
			</button>

			{/* Display loading message */}
			{loading && (
				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-xl">
					Loading products...
				</div>
			)}

			{/* Display the fetched products */}
			{products.length > 0 && (
				<div
					className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
					{products.map((product) => (
						<div key={product._id} className="p-4 border-b mb-4">
							<img
								src={`${process.env.REACT_APP_BACKEND}/uploads/${product.picture}`}
								alt={product.name}
								className="w-32 h-32 object-cover mb-2"
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
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductHomePage;
