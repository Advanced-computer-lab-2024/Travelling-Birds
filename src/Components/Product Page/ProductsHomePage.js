// src/Components/Product Page/ProductHomePage.js

import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import Slider from "rc-slider";

import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

const ProductHomePage = () => {
	const [isHovered, setIsHovered] = useState(false);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [maxPrice, setMaxPrice] = useState();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isSoldOut, setIsSoldOut] = useState(false);
	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		price: '',
		availableQuantity: '',
		ratings: [],
		picture: {
			data: '',
			contentType: ''
		},
		reviews: [],
		seller: sessionStorage.getItem('user id') || '60d21b4667d0d8992e610c87'
	});

	useEffect(() => {
		fetchAllProducts();
	}, []);
	const fetchAllProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products`);
				const data = await response.json();

				if (response.ok) {
					const productsWithImages = data.map(product => {
						let imageBase64 = null;
						if (product.picture?.data && product.picture.contentType) {
							try {
								const byteArray = new Uint8Array(product.picture.data.data); // Ensure data access structure is correct
								const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
								imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
							} catch (error) {
								console.error('Error converting image data to base64:', error);
							}
						}
						// Return the product with the base64 image URL
						return {
							...product,
							picture: imageBase64 // Set the picture to the base64 string
						};
					});

					setProducts(productsWithImages); // Update state with products and base64 images
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

		const filterProducts = async (maxPrice) => {
		setLoading(true);
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products/filter?maxPrice=${encodeURIComponent(maxPrice)}`;
			const response = await fetch(url);
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {
				toast.error(data.message || 'Failed to fetch filtered products');
			}
		} catch (error) {
			console.error('Error filtering products:', error);
			toast.error('An error occurred while filtering products');
		} finally {
			setLoading(false);
		}
	};
	// Helper function to render stars based on rating
	const renderStars = (rating) => {
		if (typeof rating !== 'number' || isNaN(rating) || rating < 0) {
			rating = 0;
		}
		const totalStars = 5;
		const fullStars = Math.min(Math.floor(rating), totalStars);
		const halfStars = rating % 1 !== 0 && fullStars < totalStars;

		return (
			<>
				{[...Array(fullStars)].map((_, i) => (
					<FaStar key={i} style={{ color: '#330577' }} />
				))}
				{halfStars && <FaStarHalfAlt style={{ color: '#330577' }} />}
				{[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} style={{ color: '#330577' }} />
				))}
			</>
		);
	};

	const searchProducts = async (searchTerm) => {
		setLoading(true);
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${encodeURIComponent(searchTerm)}`;
			const response = await fetch(url);
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {
				toast.error(data.message || 'Failed to fetch search results');
			}
		} catch (error) {
			console.error('Error searching products:', error);
			toast.error('An error occurred while searching for products');
		} finally {
			setLoading(false);
		}
	};

	const sortProducts = async (sortOrder) => {
		setLoading(true);
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products/sort?productsOrder=${encodeURIComponent(sortOrder)}`;
			const response = await fetch(url);
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {
				toast.error(data.message || 'Failed to fetch sorted products');
			}
		} catch (error) {
			console.error('Error sorting products:', error);
			toast.error('An error occurred while sorting products');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProduct = (product) => {
		setSelectedProduct(product);
		setIsUpdateModalOpen(true);
	};
	const handlesearchNFilter=(searchTerm, maxPrice)=>{
		const search = searchProducts(searchTerm);
		filterProducts(maxPrice);

	}

	const handlePurchaseProduct = (product) => {
		try {
			const productId = product._id;
			if(product.availableQuantity === 1){
				setIsSoldOut(true);
			}
			fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					availableQuantity: (product.availableQuantity) - 1,
					soldQuantity: (product.soldQuantity) + 1,
					userPurchased: sessionStorage.getItem('user'),
					soldOut: isSoldOut
				})
			});
			fetchAllProducts();
		} catch (error) {
				console.log(error);
			}
	}

	const handleCreateButtonClick = () => {
		setIsCreateModalOpen(true);
	};

	return (
		<div>
			<div className="w-11/12 max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
				{/* Search and Filter Section */}
				<div className="space-y-4">
					{/* Search Input */}
					<div>
						<label className="block text-gray-800 text-base mb-2">Search Sort and Filter</label>
						<input
							type="text"
							placeholder="Search by Product Name"
							className="w-full p-3 border bg-white text-black text-base rounded-lg focus:outline-none focus:ring-2"
							style={{borderColor: '#330577'}}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Sort by Average Rating Label and Buttons */}
					<div>
					<label className="block text-gray-800 text-base mb-2">Sort by Average Rating</label>
						<div className="flex space-x-2">
							<button
								onClick={() => sortProducts('asc')}
								className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
							>
								Ascending
							</button>
							<button
								onClick={() => sortProducts('desc')}
								className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition duration-300"
							>
								Descending
							</button>
						</div>
					</div>

					{/* Budget Slider */}
					<div className="mt-4">
						<label className="block text-gray-800 text-base mb-2">Budget</label>
						<Slider
							min={0}
							max={10000}
							defaultValue={maxPrice}
							onChange={setMaxPrice}
							trackStyle={{backgroundColor: '#330577', height: '6px'}}
							handleStyle={{borderColor: '#330577', width: '20px', height: '20px'}}
						/>
						<p className="text-base text-gray-700 mt-2">Selected budget: ${maxPrice}</p>
					</div>

					{/* Bottom Buttons - Search and Add Product */}
					<div className="flex justify-center space-x-4 mt-6">
						<button
							onClick={() => handlesearchNFilter(searchTerm, maxPrice)}
							className="w-full max-w-xs px-6 py-2 bg-[#330577] text-white text-base rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
						>
							Search
						</button>
						{['seller', 'admin'].includes(sessionStorage.getItem('role')) && (
							<button
								onClick={handleCreateButtonClick}
								className="w-full max-w-xs px-6 py-2 bg-green-500 text-white text-base rounded-lg hover:bg-green-600 transition duration-300"
							>
								Add Product
							</button>
						)}
					</div>
				</div>
			</div>
			{/*fetch all*/}
			{loading ? (
				<div className="text-center text-lg mt-8">Loading products...</div>
			) : (
				products.length > 0 && (
					<div className="w-full mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
						{products.map((product) => (
								<div key={product._id}
									 className="p-6 bg-white rounded-lg shadow-lg relative border border-gray-200"
									 style={{margin: '0 8px'}}>
									{/* Sold Out Banner */}
									{product.soldOut && (
										<div
											className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-1 font-bold rounded-t-lg">
											Sold Out
										</div>
									)}
									{/* Product Image */}
									{product.picture && (
										<img
											src={product.picture}
											alt={product.name}
											className={`w-full h-40 object-cover mb-2 rounded-lg ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
											onMouseEnter={() => setIsHovered(true)}
											onMouseLeave={() => setIsHovered(false)}
										/>
									)}
									{/* Product Details */}
									<h3 className="font-bold text-lg">{product.name}</h3>
									<p><strong>Price:</strong> ${product.price}</p>
									<p><strong>Average Rating:</strong></p>
									<div className="flex space-x-4">
										{renderStars((product.rating))}
										</div>
									</div>
									))}
								</div>
							)
						)}

		</div>
	);


};

export default ProductHomePage; // Export the ProductHomePage component as the default export