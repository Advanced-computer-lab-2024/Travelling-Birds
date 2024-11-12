import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";
import {AiOutlineHeart} from "react-icons/ai";

const ProductsDetailsPage = () => {
	const productId = useParams();
	const [visibleProductComments, setVisibleProductComments] = useState(3);
	const [product, setProduct] = useState("");
	const [purchased, setPurchased] = useState(false);
	const [loading, setLoading] = useState(true);
	const userId = sessionStorage.getItem('user id');
	const [commentText, setCommentText] = useState('');
	const [commentRating, setCommentRating] = useState(0);
	const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
	const [cardNumber, setCardNumber] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [cvv, setCvv] = useState('');
	const [walletAmount, setWalletAmount] = useState('');
	const [availableQuantity, setAvailableQuantity] = useState(0);
	const [soldQuantity, setSoldQuantity] = useState(0);

	useEffect(() => {
		const fetchProduct = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/products/${productId}`;

			try {
				const res = await fetch(apiUrl);
				const product = await res.json();
				setProduct(product);
				setAvailableQuantity(product.availableQuantity);
				setSoldQuantity(product.soldQuantity);
			} catch (err) {
				console.log('Error fetching product', err);
			} finally {
				setLoading(false);
			}
		};

		const fetchComments = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/products/${productId}/comments`;
			try {
				const res = await fetch(apiUrl);
				const comments = await res.json();
				setProduct((prev) => ({...prev, comments}));
			} catch (err) {
				console.log('Error fetching comments', err);
			}
		};

		const checkIfPurchased = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/users/product-purchases/${userId}`;
			try {
				const res = await fetch(apiUrl);
				const purchases = await res.json();
				const purchased = purchases.some((purchase) => purchase._id === productId);
				setPurchased(purchased);

			} catch (err) {
				console.log('Error fetching purchases', err);
			}
		};

		fetchProduct();
		fetchComments();
		if (userId) {
			checkIfPurchased();
		}
	}, [productId]);

	let imageBase64 = null;
	if (product?.picture?.data?.data && product.picture.contentType) {
		const byteArray = new Uint8Array(product.picture.data.data);
		const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
		imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
	}

	const handleAddComment = async () => {
		if (!commentText || commentRating === 0) {
			toast.error('Please provide a comment and a rating.');
			return;
		}
		const newComment = {
			user: sessionStorage.getItem('user id'),
			text: commentText,
			date: new Date().toISOString(),
			stars: commentRating
		};

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}/comments`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(newComment)
			});

			if (!response.ok) {
				throw new Error('Failed to add comment');
			}

			toast.success("Comment added successfully");
			setProduct((prev) => ({
				...prev,
				comments: [newComment, ...(prev.comments || [])]
			}));
			setCommentText("");
			setCommentRating(0);
		} catch (err) {
			console.error("Error adding comment:", err);
			toast.error("Failed to add comment. Please try again.");
		}
	};

	const openPurchaseModal = () => {
		setIsPurchaseModalOpen(true);
	};

	const closePurchaseModal = () => {
		setIsPurchaseModalOpen(false);
		setCardNumber('');
		setExpiryDate('');
		setCvv('');
		setWalletAmount('');
	};

	const handleCompletePurchase = async () => {
		if (!cardNumber || !expiryDate || !cvv) {
			toast.error('Please complete all fields.');
			return;
		}
		const enteredWalletAmount = parseFloat(walletAmount);
		if (enteredWalletAmount <= 0) {
			toast.error('Please enter a valid wallet amount.');
			return;
		}
		try {
			const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await userResponse.json();
			const userWalletBalance = userData.wallet;

			if (enteredWalletAmount > userWalletBalance) {
				toast.error('Not enough in wallet.');
				return;
			}
			if (purchased) {
				toast.info('Product already purchased');
				closePurchaseModal();
				return;
			}
			if(!(userWalletBalance === null)) {
			const updatedWalletBalance = userWalletBalance - enteredWalletAmount;
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}/wallet`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({wallet: updatedWalletBalance})
			});}

			const product =await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					availableQuantity:availableQuantity-1 ,
					soldQuantity: soldQuantity+1
				})
			});

			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-purchase/${userId}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({productId})
			});
			if (!response.ok) {
				throw new Error('Failed to purchase the product');
			}
			toast.success('Product purchased successfully');
			closePurchaseModal();
		} catch (error) {
			console.error('Error purchasing product:', error);
			toast.error('Failed to purchase the product. Please try again.');
		}
	};

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
					<FaStar key={i} style={{color: '#330577'}}/>
				))}
				{halfStars && <FaStarHalfAlt style={{color: '#330577'}}/>}
				{[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} style={{color: '#330577'}}/>
				))}
			</>
		);
	};

	//const calculateAvgRating = (rating) => {
		{/*if (!ratings || ratings.length === 0)
			return 0;*/}
		//const total = rating.reduce((acc, rating) => acc + rating, 0);
		//const average = total / rating.length;
		//return average.toFixed(1);
	//};


	const formatPriceRange = (price) => {
		const currency = sessionStorage.getItem('currency') || 'EGP';
		if (currency === 'USD') {
			return `$${(price / 49.3).toFixed(2)} USD`;
		} else if (currency === 'EUR') {
			return `€${(price / 49.3 * 0.93).toFixed(2)} EUR`;
		} else {
			return `${price.toFixed(2)} EGP`;
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen py-10">
			<section className="px-4 py-10 max-w-7xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="flex flex-col md:flex-row">
						{/* Image on Top-Left */}
						<div className="md:w-1/3 mb-4 md:mb-0">
							{imageBase64 && (
								<img
									src={imageBase64}
									alt="Product"
									className="w-full h-60 object-contain rounded-lg shadow-md"
								/>
							)}
						</div>
						{/* Purchase and Save Buttons on the Right */}
						<div className="md:w-2/3 flex flex-col md:flex-row justify-between ml-0 md:ml-6">
							<div className="mb-4 md:mb-0">
								<h1 className="text-3xl font-bold text-[#330577] mb-2">{product?.name}</h1>
								<div className="flex items-center mt-2 space-x-3">
									<span className="flex items-center text-lg text-yellow-500">
										{renderStars(product?.rating)}
									</span>
									<p className="text-gray-600 text-sm">({product?.reviewsCount} reviews)</p>
								</div>
							</div>
							<div className="mt-3">
								<p className="text-gray-700 text-base">
									{product?.description}
								</p>
							</div>
							<div className="flex flex-col space-y-4 mt-4 md:mt-0">
								<button
									onClick={openPurchaseModal}
									className="px-10 p-4 bg-[#330577] text-white rounded-lg shadow hover:bg-[#280466] transition duration-150"
								>
									Purchase Now
								</button>
								<button
									className="p-3 bg-[#330577] text-white rounded-lg shadow hover:bg-[#280466] transition duration-150 flex items-center justify-center space-x-2"
								>
									<span className="flex items-center">
										<AiOutlineHeart className="text-lg"/>
										<span className="ml-2">Save</span>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{isPurchaseModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
							<h2 className="text-xl font-semibold mb-4">Complete Purchase</h2>
							<div className="mb-4">
								<label className="block mb-1 text-gray-700">Card Number</label>
								<input
									type="text"
									value={cardNumber}
									onChange={(e) => setCardNumber(e.target.value)}
									className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#330577]"
									placeholder="1234 5678 9012 3456"
								/>
							</div>
							<div className="mb-4">
								<label className="block mb-1 text-gray-700">Expiry Date</label>
								<input
									type="text"
									value={expiryDate}
									onChange={(e) => setExpiryDate(e.target.value)}
									className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#330577]"
									placeholder="MM/YY"
								/>
							</div>
							<div className="mb-4">
								<label className="block mb-1 text-gray-700">CVV</label>
								<input
									type="text"
									value={cvv}
									onChange={(e) => setCvv(e.target.value)}
									className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#330577]"
									placeholder="123"
								/>
							</div>
							<div className="mb-4">
								<label className="block mb-1 text-gray-700">Wallet Amount</label>
								<input
									type="text"
									value={walletAmount}
									onChange={(e) => setWalletAmount(e.target.value)}
									className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#330577]"
									placeholder="Enter amount"
								/>
							</div>
							<button
								onClick={handleCompletePurchase}
								className={`w-full bg-[#330577] text-white p-3 rounded-lg ${!cardNumber || !expiryDate || !cvv ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#280466] transition duration-150'}`}
								disabled={!cardNumber || !expiryDate || !cvv}
							>
								Complete Purchase
							</button>
							<button
								onClick={closePurchaseModal}
								className="mt-4 w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-150"
							>
								Cancel
							</button>
						</div>
					</div>
				)}

				{/* Ratings, Details, and Reviews Sections */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
					{/* Ratings & Reviews */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-lg font-semibold text-[#330577] mb-4">Ratings and Reviews</h2>
						<p className="text-xl text-[#330577] font-bold">{(product?.rating)} ★</p>
						<p className="text-sm text-gray-500">{product?.reviewCount} reviews</p>
						<div className="mt-4 space-y-2">
							{product?.comments?.length ? (
								product.comments.slice(0, visibleProductComments).map((comment, index) => (
									<div key={index} className="border-b border-gray-200 pb-2">
										<p className="text-gray-800 font-semibold">{comment.user.username}</p>
										<p className="text-gray-600">{comment.text}</p>
										<p className="text-sm text-gray-400">{new Date(comment.date).toLocaleDateString()}</p>
										<span className="flex">{renderStars(comment.stars)}</span>
									</div>
								))
							) : (
								<p className="text-gray-500">No reviews yet.</p>
							)}
						</div>
						{product?.comments?.length > visibleProductComments && (
							<button
								onClick={() => setVisibleProductComments(visibleProductComments + 3)}
								className="mt-4 px-4 py-2 bg-transparent text-black border border-gray-300 rounded-lg hover:bg-black hover:text-white transition"
							>
								Show More Comments
							</button>
						)}
					</div>

					{/* Product Details */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-lg font-semibold text-[#330577] mb-4">Product Details</h2>
						<p className="text-gray-700">Price
							Range: {product?.price ? formatPriceRange(product.price) : 'N/A'}</p>
					</div>
				</div>

				{/* Comments Section */}
				{purchased && (
					<div className="mt-8 bg-white shadow-lg rounded-lg p-6">
						<h2 className="text-lg font-semibold text-[#330577] mb-4">Add a Review</h2>
						<textarea
							placeholder="Write your review here..."
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#330577]"
						></textarea>
						<div className="flex items-center mb-4">
							<span className="mr-2">Rating:</span>
							{[1, 2, 3, 4, 5].map((star) => (
								<FaStar
									key={star}
									className="cursor-pointer"
									style={{color: commentRating >= star ? '#330577' : 'lightgray'}}
									onClick={() => setCommentRating(star)}
								/>
							))}
						</div>
						<button
							onClick={handleAddComment}
							className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#280466] transition duration-150"
						>
							Submit Review
						</button>
					</div>
				)}
			</section>
		</div>
	);
};

export default ProductsDetailsPage;