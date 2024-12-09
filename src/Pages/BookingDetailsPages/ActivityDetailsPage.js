import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaMapMarkerAlt, FaRegStar, FaShareAlt, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import LocationContact from "../../Components/Locations/Location";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {userUpdateEvent} from "../../utils/userUpdateEvent";
import { CardElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import useNavigationHistory from "../../Components/useNavigationHistory";


const ActivityDetail = () => {
	const [loading, setLoading] = useState(true);
	const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
	const [activity, setActivity] = useState(null);
	const [commentText, setCommentText] = useState("");
	const [commentRating, setCommentRating] = useState(0);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [hasBooked, setHasBooked] = useState(false);
	const [canCancel, setCanCancel] = useState(false);
	const [canComment, setCanComment] = useState(false);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
	const [cardNumber, setCardNumber] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [cvv, setCvv] = useState('');
	const [transportation, setTransportation] = useState('');
	const [walletAmount, setWalletAmount] = useState('');
	const [transportations, setTransportations] = useState([]);
	const activityId = useParams().id;
	const userId = sessionStorage.getItem('user id');
	const userRole = sessionStorage.getItem('role');
	const [userLocation, setUserLocation] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [message, setMessage] = useState('');
	const [isSaved, setIsSaved] = useState(false);
	const [bookingOpen, setBookingOpen] = useState(true);
	const stripe = useStripe();
	const elements = useElements();
	const [promoCode, setPromoCode] = useState("");
	const [ promoCodeValid, setPromoCodeValid] = useState(null);
	const { goToPreviousPage } = useNavigationHistory(); // Use the custom hook

	useEffect(() => {
		const fetchActivity = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/${activityId}`;
			try {
				const res = await fetch(apiUrl);
				const activityData = await res.json();
				setActivity(activityData);
				if (activityData.bookingOpen === false) {
					setBookingOpen(false);
				}
				setLoading(false);
			} catch (err) {
				console.log('Error fetching activity', err);
			}
		};

		const fetchComments = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/${activityId}/comments`;
			try {
				const res = await fetch(apiUrl);
				const comments = await res.json();
				setActivity((prev) => ({...prev, comments}));
			} catch (err) {
				console.log('Error fetching comments', err);
			}
		};

		const checkUserBooking = async () => {
			if (userRole !== 'tourist') {
				return;
			}
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`);
				if (!res.ok) {
					throw new Error('Failed to fetch user bookings');
				}
				const userBookings = await res.json();
				const booking = userBookings.find((booking) => booking._id === activityId);

				if (booking) {
					setHasBooked(true);
					const activityDate = new Date(booking.date);
					const currentDate = new Date();
					const hoursDifference = (activityDate - currentDate) / (1000 * 60 * 60);
					setCanCancel(hoursDifference >= 48);
					setCanComment(activityDate < currentDate);
				}
			} catch (err) {
				console.error('Error checking user bookings:', err);
			}
		};

		const fetchUsers = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
				const data = await response.json();
				setUserEmail(data.email);
			} catch (error) {
				console.error('Error fetching user:', error);
			}
		};

		const fetchTransportations = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/transports`);
				const data = await response.json();
				setTransportations(data);
			} catch (error) {
				console.error('Error fetching transportations:', error);
			}
		};

		const checkIfSaved = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activities/${userId}`);
				if (!response.ok) throw new Error('Failed to fetch saved activities');

				const savedActivities = await response.json();
				// Check if the activity is already in the saved activities
				const saved = savedActivities.some(activity => activity._id === activityId);
				setIsSaved(saved);
			} catch (error) {
				console.error('Error checking saved status:', error);
			}
		};
		fetchUsers();
		fetchTransportations();
		fetchActivity();
		fetchComments();
		checkIfSaved();
		if (userId) {
			checkUserBooking();
		}
	}, [activityId, userId, userRole]);

	// Convert image to base64 if exists
	let imageBase64 = null;
	if (activity?.image?.data?.data && activity.image.contentType) {
		const byteArray = new Uint8Array(activity.image.data.data);
		const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
		imageBase64 = `data:${activity.image.contentType};base64,${btoa(binaryString)}`;
	}

	const openBookingModal = () => {
		setIsBookingModalOpen(true);
	};

	const closeBookingModal = () => {
		setIsBookingModalOpen(false);
		setCardNumber('');
		setExpiryDate('');
		setCvv('');
		setTransportation('');
		setWalletAmount('');
	};


	const sendEmail = async () => {
		setLoading(true);
		try {
			const subject = 'Check out this activity';
			const body = `Here's a link to an interesting activity: http://localhost:3000/activities/${activityId}`;

			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({email, subject, message: body}),
			});

			if (response.ok) {
				alert('Email sent successfully!');
			} else {
				const errorData = await response.json();
				console.error('Server response error:', errorData);
				alert(`Failed to send email: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error sending email:', error);
			alert('Failed to send email.');
		} finally {
			setLoading(false);
		}
	};

	const handleCompleteBooking = async () => {
		if (userRole !== 'tourist') {
			toast.error('Only tourists can book activities.');
			return;
		}

		if (!transportation) {
			toast.error('Please complete all fields.');
			return;
		}

		// Parse the wallet input amount
		const enteredWalletAmount = parseFloat(walletAmount);
		if (enteredWalletAmount < 0) {
			toast.error('Please enter a valid wallet amount.');
			return;
		}

		try {
			if (hasBooked) {
				toast.error('Activity already booked.');
				return;
			}

			// Fetch user data to get the wallet balance
			const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await userResponse.json();
			const userWalletBalance = userData.wallet;

			const userDob = new Date(userData.dob);
			const ageDifference = new Date().getFullYear() - userDob.getFullYear();
			const age = (new Date().getMonth() - userDob.getMonth() < 0 ||
				(new Date().getMonth() === userDob.getMonth() && new Date().getDate() < userDob.getDate()))
				? ageDifference - 1 : ageDifference;

			if (age < 18) {
				toast.error('You must be at least 18 to book.');
				return;
			}

			let finalPrice = activity.price;
			if (promoCodeValid) {
				finalPrice *= 0.85; // Apply 25% discount
			}


			// Check if the wallet balance is sufficient to cover the full price
			if (enteredWalletAmount >= finalPrice && enteredWalletAmount <= userWalletBalance) {
				// Deduct wallet balance and skip Stripe payment
				const updatedWalletBalance = userWalletBalance - enteredWalletAmount;

				const walletUpdateResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({wallet: updatedWalletBalance}),
				});

				if (!walletUpdateResponse.ok) {
					const errorData = await walletUpdateResponse.json();
					console.error('Wallet update error:', errorData);
					throw new Error('Failed to update wallet balance');
				}

				console.log('Wallet successfully updated');

				// Proceed with booking
				const bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-booking/${userId}`, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({activityId}),
				});

				if (!bookingResponse.ok) {
					throw new Error('Failed to book the activity');
				}

				console.log('Activity booked successfully using wallet balance.');

				// Send payment receipt email
				const receiptSubject = `Payment Receipt for ${activity?.title}`;
				const receiptHtml = `
					<h1>Thank You for Your Payment!</h1>
					<p>You have successfully booked the activity: <strong>${activity?.title}</strong>.</p>
					<p><strong>Amount Paid:</strong> ${formatPriceRange(activity.price)}</p>
					<p>Thank you for choosing our service. Have a great experience!</p>
				`;

				await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						email: userEmail,
						subject: receiptSubject,
						message: '', // Optional plain text message
						htmlContent: receiptHtml, // HTML content for the email
					}),
				});

				toast.success('Activity booked successfully using wallet balance!');
				window.dispatchEvent(userUpdateEvent);
				window.location.reload();
				closeBookingModal();
				return; // Exit after successfully booking with wallet
			}

			// If wallet is insufficient, proceed with Stripe payment
			const cardElement = elements.getElement(CardElement);
			const {paymentMethod, error} = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
			});

			if (error) {
				toast.error(`Payment failed: ${error.message}`);
				return;
			}

			// Call backend to handle payment
			const paymentResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/payments`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					amount: activity.price * 100, // Convert to cents
					currency: 'usd',
					paymentMethodId: paymentMethod.id,
				}),
			});

			const paymentResult = await paymentResponse.json();
			if (!paymentResult.success) {
				toast.error(`Payment failed: ${paymentResult.error}`);
				return;
			}

			// Deduct wallet balance (if any amount is used) and finalize booking
			const updatedWalletBalance = userWalletBalance - enteredWalletAmount;
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({wallet: updatedWalletBalance}),
			});

			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-booking/${userId}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({activityId}),
			});

			if (!response.ok) {
				throw new Error('Failed to book the activity');
			}

			// Send payment receipt email
			const receiptSubject = `Payment Receipt for ${activity?.title}`;
			const receiptHtml = `
				<h1>Thank You for Your Payment!</h1>
				<p>You have successfully booked the activity: <strong>${activity?.title}</strong>.</p>
				<p><strong>Amount Paid:</strong> ${formatPriceRange(activity.price)}</p>
				<p>Thank you for choosing our service. Have a great experience!</p>
			`;

			await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: userEmail,
					subject: receiptSubject,
					message: '', // Optional plain text message
					htmlContent: receiptHtml, // HTML content for the email
				}),
			});

			toast.success('Activity booked successfully, and payment receipt email sent!');
			window.dispatchEvent(userUpdateEvent);
			window.location.reload();
			closeBookingModal();
		} catch (error) {
			console.error('Error booking activity:', error);
			toast.error('Failed to book the activity. Please try again.');
		}
	};

	const handleCancelBooking = async () => {
		const userConfirmed = window.confirm("Are you sure you want to cancel the booking?");
		if (!userConfirmed) {
			return; // Do nothing if the user cancels the confirmation dialog
		}
		try {
			// Fetch user data to get the wallet balance
			const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await userResponse.json();
			const userWalletBalance = userData.wallet;

			// Calculate the updated wallet balance
			const updatedWalletBalance = userWalletBalance + activity.price;

			// Update wallet balance in the database
			const walletUpdateResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({wallet: updatedWalletBalance}),
			});

			if (!walletUpdateResponse.ok) {
				throw new Error('Failed to update wallet balance');
			}

			// Proceed to cancel the booking
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-booking/${userId}`, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({activityId}),
			});

			if (!response.ok) {
				throw new Error('Failed to cancel the booking');
			}

			toast.success('Booking canceled successfully. The amount has been refunded to your wallet.');
			window.dispatchEvent(userUpdateEvent);
			setHasBooked(false); // Update state to reflect cancellation
			setCanCancel(false);
			setCanComment(false);
		} catch (error) {
			console.error('Error canceling booking:', error);
			toast.error('Failed to cancel the booking. Please try again.');
		}
	};

	// Handle submitting a new comment
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
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/${activityId}/comments`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(newComment)
			});

			if (!response.ok) {
				throw new Error('Failed to add comment');
			}

			toast.success("Comment added successfully");

			// Update local state with new comment
			setActivity((prev) => ({
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
					<FaStar key={i} style={{color: '#330577'}}/>
				))}
				{halfStars && <FaStarHalfAlt style={{color: '#330577'}}/>}
				{[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} style={{color: '#330577'}}/>
				))}
			</>
		);
	};


	// Helper function to format price range based on currency
	const formatPriceRange = (price) => {
		const currency = sessionStorage.getItem('currency') || 'EGP';
		if (currency === 'USD') {
			return `$${(price / 49.3).toFixed(2)} USD`;
		} else if (currency === 'EUR') {
			return `€${(price / 49.3 * 0.93).toFixed(2)} EUR`;
		} else {
			return `${price.toFixed(2)} EGP`; // Default to EGP
		}
	};

	const saveActivity = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activity/${userId}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({activityId})
			});

			const data = await response.json();

			if (!response.ok) {
				// Check if the activity is already saved
				if (data.message === 'Activity is already saved') {
					toast.info('This activity is already saved.');
				} else {
					throw new Error(data.message || 'Failed to save the activity');
				}
				return;
			}

			toast.success('Activity saved successfully');
		} catch (error) {
			console.error('Error saving activity:', error);
			toast.error('Failed to save the activity. Please try again.');
		}
	};

	// Unsave activity
	const unsaveActivity = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-activity/${userId}`, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({activityId})
			});

			if (!response.ok) throw new Error('Failed to unsave the activity');
			setIsSaved(false);
			toast.success('Activity unsaved successfully');
		} catch (error) {
			console.error('Error unsaving activity:', error);
			toast.error('Failed to unsave the activity. Please try again.');
		}
	};

	const toggleSave = async () => {
		if (isSaved) {
			await unsaveActivity();
			setIsSaved(false); // Update state immediately
		} else {
			await saveActivity();
			setIsSaved(true); // Update state immediately
		}
	};

	const handlePromoCodeChange = async (e) => {
		const code = e.target.value;
		setPromoCode(code);

		if (!code) {
		  setPromoCodeValid(null);
		  return;
		}

		try {
		  const response = await fetch(
			`${process.env.REACT_APP_BACKEND}/api/promotions/check/${code}`
		  );
		  if (response.ok) {
			const data = await response.json();
			setPromoCodeValid(true);

		  } else {
			setPromoCodeValid(false);
		  }
		} catch (error) {
		  console.error("Error validating promo code:", error);
		  setPromoCodeValid(false);
		}
	  };


	if (loading) return <p>Loading...</p>;

	return (
		<div>
		{/* Back Button */}
		    <div className="p-4">
                <button
                    onClick={goToPreviousPage}
                    className="bg-[#330577] text-white px-4 py-2 rounded-lg shadow hover:bg-[#472393]"
                >
                    Back
                </button>
            </div>

			<section className="px-4 py-10 bg-gray-100">
				<div className="container-xl lg:container m-auto">
					<div className="flex items-center justify-between bg-white p-6 shadow-lg rounded-lg mb-4">
						<div className="flex flex-col">
							<h1 className="text-4xl font-bold text-gray-800 mb-1">{activity?.title}</h1>
							<p className="text-gray-500 text-lg">{activity?.rank}</p>
							<div className="flex items-center mt-2 space-x-3">
                                <span className="flex items-center text-2xl text-yellow-500">
                                    {renderStars(activity?.rating)}
                                </span>
								<p className="text-gray-600 text-sm">({activity?.reviewsCount} reviews)</p>
							</div>
							<div className="flex items-center mt-3 text-gray-600 space-x-1">
								<FaMapMarkerAlt className="text-gray-500"/>
								<span>{activity?.location?.address}</span>
							</div>
							<p className="text-gray-700 mt-4 leading-relaxed">{activity?.description}</p>
						</div>
						<div className="flex flex-col items-center space-y-4">
							<button
								onClick={() => {
									if (bookingOpen === false) {
										toast.error('Booking not open yet.');
										return;
									}
									openBookingModal();
								}}


								className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
							>
								Book Activity
							</button>
							<button
								onClick={toggleSave}
								className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
							>
								{isSaved ? <AiFillHeart className="text-lg mr-2"/> :
									<AiOutlineHeart className="text-lg mr-2"/>}
								{isSaved ? 'Unsave' : 'Save'}
							</button>
							<div className="relative">
								<button
									onClick={() => setIsShareOpen(!isShareOpen)}
									className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
								>
									<FaShareAlt className="mr-2"/> Share
								</button>
								{isShareOpen && (
									<div className="absolute mt-2 bg-white p-4 shadow-md rounded-lg w-72 -left-20">
										<p className="mb-2 font-semibold text-gray-700">Share this link:</p>
										<div className="flex items-center space-x-2 mb-4">
											<input
												type="text"
												value={`http://localhost:3000/activities/${activityId}`}
												readOnly
												className="w-full px-2 py-1 border rounded-lg focus:outline-none"
												onClick={(e) => e.target.select()}
											/>
											<button
												onClick={() => navigator.clipboard.writeText(`http://localhost:3000/activities/${activityId}`)
													.then(() => toast.success('Link copied to clipboard'))
													.catch(() => toast.error('Failed to copy link to clipboard'))

												}
												className="bg-[#330577] text-white px-3 py-1 rounded-lg hover:bg-[#27045c]"
											>
												Copy
											</button>
										</div>
										<p className="mb-2 font-semibold text-gray-700">Send via Email:</p>
										<div className="flex items-center space-x-2">
											<input
												type="email"
												placeholder="Enter email address"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full px-2 py-1 border rounded-lg focus:outline-none"
											/>
											<button
												onClick={sendEmail}
												className="bg-[#330577] text-white px-3 py-1 rounded-lg hover:bg-[#27045c] disabled:opacity-50"
												disabled={!email || loading}
											>
												{loading ? 'Sending...' : 'Send'}
											</button>
											{message && <p>{message}</p>}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{isBookingModalOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-6 rounded-lg shadow-lg w-96">
								<h2 className="text-2xl font-semibold mb-4">Complete Booking</h2>
								<div className="mb-4">
									<label className="block mb-2">Payment Information</label>
									<div className="w-full border rounded-lg p-2">
										<CardElement />
									</div>
								</div>
								<div className="mb-4">
									<label className="block mb-2">Transportation</label>
									<select
										value={transportation}
										onChange={(e) => setTransportation(e.target.value)}
										className="w-full border rounded-lg p-2"
									>
										<option value="">Select</option>
										{transportations.map((transport) => (
											<option key={transport._id} value={transport.name}>
												{transport.name}
											</option>
										))}
										<option value="my car">My Car</option>
									</select>
								</div>
								<div className="mb-4">
									<label className="block mb-2">Wallet Amount</label>
									<input
										type="text"
										value={walletAmount}
										onChange={(e) => setWalletAmount(e.target.value)}
										className="w-full border rounded-lg p-2"
										placeholder="Enter amount"
									/>
								</div>
								<div className="mb-4">
									<label className="block mb-2">Promo Code (Optional)</label>
									<input
										type="text"
										value={promoCode}
										onChange={handlePromoCodeChange}
										className={`w-full border rounded-lg p-2 ${
										promoCodeValid === true
											? "border-green-500"
											: promoCodeValid === false
											? "border-red-500"
											: "border-gray-300"
										}`}
										placeholder="Enter promo code"
									/>
									{promoCodeValid === false && (
										<p className="text-red-500 text-sm">Invalid promo code</p>
									)}
									</div>
								<button
									onClick={handleCompleteBooking}
									className="w-full bg-[#330577] text-white p-2 rounded-lg hover:bg-[#472393]"
								>
									Book
								</button>
								<button
									onClick={closeBookingModal}
									className="mt-4 w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{/* Image Gallery */}
					<div className="mt-8">
						<img src={imageBase64} alt="Activity"
						     className="w-full h-96 object-cover rounded-lg shadow-md"/>
					</div>

					{/* Ratings, Details, and Location Sections */}
					<div className="grid grid-cols-3 gap-8 mt-8">
						{/* Ratings & Reviews */}
						<div className="bg-white p-4 rounded-lg shadow-md">
							<h2 className="font-semibold text-lg text-[#330577]">Ratings and reviews</h2>
							<p className="text-gray-800 text-xl font-bold mt-2">{activity?.rating} ★</p>
							<p className="text-gray-500 text-sm">{activity?.reviewCount} reviews</p>
							<div className="mt-4 space-y-2">
								{activity?.comments?.slice(0, 3).map((review, index) => (
									<div key={index} className="border-b border-gray-200 pb-2">
										<p className="text-gray-800">{review.user?.username}</p>
										<p className="text-gray-600">{review.text}</p>
										<p className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
										<span className="flex">{renderStars(review.stars)}</span>
									</div>
								))}
							</div>
						</div>

						{/* Details Section */}
						<div className="bg-white p-4 rounded-lg shadow-md">
							<h2 className="font-semibold text-lg text-[#330577]">Details</h2>
							<p className="text-gray-700 mt-2">Price
								range: {activity?.priceRange ? `${formatPriceRange(activity.priceRange.lwBound)}  - ${formatPriceRange(activity.priceRange.hiBound)}` : 'N/A'}</p>
							<p className="text-gray-700">Category: {activity?.category}</p>
							<p className="text-gray-700">Special discounts: {activity?.specialDiscounts}</p>
							<p className="text-gray-700">Features: {activity?.features?.join(', ')}</p>
						</div>

						{/* Location & Contact */}
						<LocationContact activity={activity}/>
					</div>

					{/* Comments Section */}
					<div className="mt-8 bg-white shadow-md rounded-lg p-6">
						<h2 className="font-semibold text-lg mb-4 text-[#330577]">All Reviews</h2>
						{activity?.comments?.length ? (
							activity.comments.slice(0, visibleCommentsCount).map((comment, index) => (
								<div key={index} className="border-b border-gray-200 pb-4 mb-4">
									<p className="font-semibold text-gray-800">{comment?.user?.username}</p>
									<p className="text-gray-600">{comment?.text}</p>
									<p className="text-sm text-gray-400">{new Date(comment?.date).toLocaleDateString()}</p>
									<div className="flex items-center mt-2">
                                            <span className="flex items-center text-2xl">
                                                {renderStars(comment?.stars)}
                                            </span>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500">No reviews yet.</p>
						)}
						{activity?.comments?.length > visibleCommentsCount && (
							<button
								onClick={() => setVisibleCommentsCount(visibleCommentsCount + 3)}
								className="mt-4 px-4 py-2 bg-transparent text-black border border-gray-300 rounded-lg hover:bg-black hover:text-white transition"
							>
								Show More Comments
							</button>
						)}
					</div>

					{/* Add Comment Form */}
					{userRole === 'tourist' && hasBooked && canComment && (
						<div className="mt-8 bg-white shadow-md rounded-lg p-6">
							<h2 className="font-semibold text-lg text-[#330577] mb-4">Add a Review</h2>
							<textarea
								placeholder="Write your review here..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								className="w-full border rounded-lg p-2 mb-4"
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
								className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#27045c]"
							>
								Submit Review
							</button>
						</div>
					)}

					{/* Cancel Booking Button */}
					{userRole === 'tourist' && hasBooked && canCancel && (
						<div className="mt-8">
							<button
								onClick={handleCancelBooking}
								className="bg-[#330577] text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 flex items-center justify-center w-full"
							>
								Cancel Booking
							</button>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default ActivityDetail;