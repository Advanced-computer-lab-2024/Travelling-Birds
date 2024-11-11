// src/Components/Product Page/ProductHomePage.js

import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import Slider from "rc-slider";
import ProductDisplay from "../Models/Displays/ProductsDisplay"

import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

const ProductHomePage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [maxPrice, setMaxPrice] = useState();


	useEffect(() => {

		const fetchAllProducts = async () => {
			
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products`);
				let data = await response.json();

				if (response.ok) {
					data = data.filter(product => !product.isArchived);
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
		fetchAllProducts();
	}, []);

	 const convertProductImages = (products) => {
		return products.map(product => {
			let imageBase64 = null;
			if (product.picture?.data && product.picture.contentType) {
				try {
					const byteArray = new Uint8Array(product.picture.data.data);
					const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
					imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
				} catch (error) {
					console.error('Error converting image data to base64:', error);
				}
			}
			return {
				...product,
				picture: imageBase64 // Assign the base64 image string to the picture property
			};
		});
	};
	

	const filterProducts = async (maxPrice) => {
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products/filter?maxPrice=${encodeURIComponent(maxPrice)}`;
			const response = await fetch(url);
			const data = await response.json();
	
			if (response.ok) {
				const productsWithImages = convertProductImages(data); // Convert images
				setProducts(productsWithImages);
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

	const searchProducts = async (searchTerm) => {
		setLoading(true);
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${encodeURIComponent(searchTerm)}`;
			const response = await fetch(url);
			const data = await response.json();
	
			if (response.ok) {
				const productsWithImages = convertProductImages(data); // Convert images
				setProducts(productsWithImages);
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
				const productsWithImages = convertProductImages(data); // Convert images
				setProducts(productsWithImages);
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

	const handleSearchFilterAndSort = async (searchTerm, maxPrice, sortOrder = 'asc') => {
		setLoading(true);
		try {
			// Step 1: Search products by name
			let url = `${process.env.REACT_APP_BACKEND}/api/products/search?name=${encodeURIComponent(searchTerm)}`;
			let response = await fetch(url);
			let data = await response.json();
	
			if (!response.ok) {
				throw new Error(data.message || 'Failed to fetch search results');
			}
	
			// Step 2: Filter the searched products by max price
			if (maxPrice) {
				data = data.filter(product => product.price <= maxPrice);
			}
	
			// Step 3: Sort the filtered products
			if (sortOrder === 'asc') {
				data.sort((a, b) => a.rating - b.rating);
			} else if (sortOrder === 'desc') {
				data.sort((a, b) => b.rating - a.rating);
			}
	
			// Convert images before setting state
			const productsWithImages = convertProductImages(data);
			setProducts(productsWithImages);
		} catch (error) {
			console.error('Error during search, filter, and sort:', error);
			toast.error('An error occurred while processing your request');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<div>
			<div className="w-11/12 max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
				{/* Search and Filter Section */}
				<div className="space-y-4">
					{/* Search Input */}
					<div>
						<label className="block text-gray-800 text-base mb-2">Search, Filter, and Sort</label>
						<input
							type="text"
							placeholder="Search by Product Name"
							className="w-full p-3 border bg-white text-black text-base rounded-lg focus:outline-none focus:ring-2"
							style={{ borderColor: '#330577' }}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
	
					{/* Budget Slider */}
					<div className="mt-4">
						<label className="block text-gray-800 text-base mb-2">Budget</label>
						<Slider
							min={0}
							max={10000}
							defaultValue={maxPrice}
							onChange={setMaxPrice}
							trackStyle={{ backgroundColor: '#330577', height: '6px' }}
							handleStyle={{ borderColor: '#330577', width: '20px', height: '20px' }}
						/>
						<p className="text-base text-gray-700 mt-2">Selected budget: EGP{maxPrice}</p>
					</div>
	
					{/* Sort by Average Rating Buttons */}
					<div className="flex space-x-2 mt-4">
						<button
							onClick={() => handleSearchFilterAndSort(searchTerm, maxPrice, 'asc')}
							className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
						>
							Ascending
						</button>
						<button
							onClick={() => handleSearchFilterAndSort(searchTerm, maxPrice, 'desc')}
							className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition duration-300"
						>
							Descending
						</button>
					</div>
	
					{/* Consolidated Button */}
					<div className="flex justify-center space-x-4 mt-6">
						<button
							onClick={() => handleSearchFilterAndSort(searchTerm, maxPrice)}
							className="w-full max-w-xs px-6 py-2 bg-[#330577] text-white text-base rounded-lg transition hover:bg-[#4a078c] focus:outline-none focus:ring-2"
						>
							Search, Filter, and Sort
						</button>
					</div>
				</div>
			</div>
	
			{/* Display Products */}
			{loading ? (
				<div className="text-center text-lg mt-8">Loading products...</div>
			) : (
				products.length > 0 && (
					<div className="w-full mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
						{products.map((product) => (
							<ProductDisplay key={product._id} product={product} />
						))}
					</div>
				)
			)}
		</div>
	);


};

export default ProductHomePage; // Export the ProductHomePage component as the default export