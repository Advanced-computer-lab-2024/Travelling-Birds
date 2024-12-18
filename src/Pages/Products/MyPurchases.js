import React, {useEffect, useState} from 'react';
import {FaRegStar, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import ProductDisplay from '../../Components/Models/Displays/ProductsDisplay';
import {toast} from 'react-toastify';

const MyPurchases = () => {
	const [purchases, setPurchases] = useState([]);
	const userId = sessionStorage.getItem('user id');
	const userRole = sessionStorage.getItem('role');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllProducts = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-purchases/${userId}`);
				const purchases = await response.json();

				if (response.ok) {
					const productsWithImages = purchases.map(purchase => {
						let imageBase64 = null;
						if (purchase.product.picture?.data && purchase.product.picture.contentType) {
							try {
								const byteArray = new Uint8Array(purchase.product.picture.data.data); // Ensure data access structure is correct
								const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
								imageBase64 = `data:${purchase.product.picture.contentType};base64,${btoa(binaryString)}`;
							} catch (error) {
								console.error('Error converting image data to base64:', error);
							}
						}
						// Return the product with the base64 image URL
						return {
							...purchase,
							product: {
								...purchase.product,
								picture: imageBase64,
							},
						};
					});

					setPurchases(productsWithImages); // Update state with products and base64 images
				} else {
					toast.error(purchases.message || 'Failed to fetch products');
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				toast.error('An error occurred while fetching products');
			} finally {
				setLoading(false);
			}
		};

		if (userRole === 'tourist') {
			fetchAllProducts();
			console.log(purchases);
		}
	}, [userId, userRole]);

	// Cancel Purchase Function
	const cancelPurchase = async (productId) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-status/${userId}/${productId}`);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message || 'Failed to fetch product status');
				return;
			}

			const data = await response.json();
			if (data.status === 'Delivered') {
				toast.error('Cannot cancel a delivered product');
				return;
			}

			// Proceed with the cancellation logic if the product is not delivered
			toast.success('Product status allows cancellation. Proceeding...');
		} catch (error) {
			console.error('Error fetching product status:', error);
			toast.error('An error occurred while checking product status.');
		}

		const userConfirmed = window.confirm("Are you sure you want to cancel the product?");
		if (!userConfirmed) {
			return; // Do nothing if the user cancels the confirmation dialog
		}
		try {
			const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await userResponse.json();
			const userWalletBalance = userData.wallet;

			// Calculate the updated wallet balance
			const updatedWalletBalance = userWalletBalance + purchases.find(purchase => purchase.product._id === productId).itemPrice;

			// Update wallet balance in the database
			const walletUpdateResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({wallet: updatedWalletBalance}),
			});

			if (!walletUpdateResponse.ok) {
				throw new Error('Failed to update wallet balance');
			}
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-purchase/${userId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({productId}),
			});

			const data = await response.json();
			if (response.ok) {
				toast.success('Purchase cancelled successfully');
				setPurchases(purchases.filter(purchase => purchase.product._id !== productId));
			} else {
				toast.error(data.message || 'Failed to cancel purchase');
			}
		} catch (error) {
			console.error('Error canceling purchase:', error);
			toast.error('An error occurred while canceling the purchase');
		}
	};

	// View Product Status Function
	const viewProductStatus = async (productId) => {
		const userId = sessionStorage.getItem('user id');
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-status/${userId}/${productId}`);
			const data = await response.json();
			if (response.ok) {
				toast.success(`Product status: ${data.status}`);  // Assuming status is returned
			} else {
				toast.error(data.message || 'Failed to fetch product status');
			}
		} catch (error) {
			console.error('Error fetching product status:', error);
			toast.error('An error occurred while fetching product status');
		}
	};

	if (loading) {
		return (
			<div className="text-[#330577] p-6">
				<h1 className="text-3xl font-bold mb-6">My Purchases</h1>
				<p>Loading...</p>
			</div>
		);
	}

	// Render Stars
	const renderStars = (rating) => {
		if (typeof rating !== 'number' || isNaN(rating) || rating < 0) {
			rating = 0;
		}
		const totalStars = 5;
		const fullStars = Math.min(Math.floor(rating), totalStars);
		const halfStars = rating % 1 !== 0 && fullStars < totalStars;

		return (
			<>
				{[...Array(fullStars)].map((_, i) => <FaStar key={i} className="text-yellow-500"/>)}
				{halfStars && <FaStarHalfAlt className="text-yellow-500"/>}
				{[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => <FaRegStar key={i + fullStars}
				                                                                                   className="text-yellow-500"/>)}
			</>
		);
	};

	return (
		<div className="text-[#330577] p-6">
			<h1 className="text-3xl font-bold mb-6">My Purchases</h1>
			{/* Buttons to toggle between current and past orders */}
			<div className="mb-6">
				<button
					className={`bg-blue-500 text-white p-2 rounded }`}
					onClick={() => setPurchases(purchases.filter(purchase => {
						const purchaseDate = new Date(purchase.datePurchased);
						const currentDate = new Date();

						// Calculate the difference in milliseconds
						const differenceInMilliseconds = currentDate - purchaseDate;

						// Check if the difference is less than or equal to 3 days (in milliseconds)
						return differenceInMilliseconds <= 3 * 24 * 60 * 60 * 1000;
					}))}

				>
					View Current Orders
				</button>
				<button
					className={`bg-blue-500 text-white p-2 rounded ml-4 }`}
					onClick={() => setPurchases(purchases.filter(purchase => {
						const purchaseDate = new Date(purchase.datePurchased);
						const currentDate = new Date();

						// Calculate the difference in milliseconds
						const differenceInMilliseconds = currentDate - purchaseDate;

						// or more than 3 days old
						return differenceInMilliseconds > 3 * 24 * 60 * 60 * 1000;
					}))}
				>
					View Past Orders
				</button>
			</div>

			{purchases.length === 0 ? (
				<p>No purchases found.</p>
			) : (
				<div className="flex flex-wrap gap-4">
					{purchases.map((purchase) => (
						<div key={purchase.product._id}
						     className="bg-white text-[#330577] p-4 rounded-lg shadow-md w-full md:w-1/3 lg:w-1/4">
							<ProductDisplay product={purchase.product}/>
							{/* Cancel Order Button */}
							<button
								className="bg-red-500 text-white p-2 rounded mt-4"
								onClick={() => cancelPurchase(purchase.product._id)}
							>
								Cancel Order
							</button>
							{/* View Product Status Button */}
							<button
								className="bg-blue-500 text-white p-2 rounded mt-4 ml-2"
								onClick={() => viewProductStatus(purchase.product._id)}
							>
								View Product status
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MyPurchases;
