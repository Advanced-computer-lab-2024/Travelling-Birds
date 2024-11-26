import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaClock, FaMapMarkerAlt, FaRegStar, FaShareAlt, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import {AiOutlineHeart} from "react-icons/ai";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationContact from "../../Components/Locations/Location";
import {userUpdateEvent} from "../../utils/userUpdateEvent";

const ItineraryDetail = () => {
	const [loading, setLoading] = useState(true);
	const [activities, setActivities] = useState([]);
	const [itinerary, setItinerary] = useState(null);
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
	const [tourGuide, setTourGuide] = useState(null);
	const [commentTextTourGuide, setCommentTextTourGuide] = useState("");
	const [commentRatingTourGuide, setCommentRatingTourGuide] = useState(0);
	const [itineraryId, setItineraryId] = useState(useParams().id);
	const [message, setMessage] = useState('');
	const userId = sessionStorage.getItem('user id');
	const userRole = sessionStorage.getItem('role');
	const [placeholder, setPlaceHolder] = useState('');
	const [userLocation, setUserLocation] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [tourguideRating, setTourguideRating] = useState(0);

	useEffect(() => {
		const fetchItinerary = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itineraryId}`);
				const data = await res.json();
				setItinerary(data);
			} catch (err) {
				console.error('Error fetching itinerary', err);
			} finally {
				setLoading(false);
			}
		};
		const fetchActivities = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itineraryId}/activities`);
				const data = await res.json();
				const sortedActivities = data.sort((a, b) => new Date(a.date) - new Date(b.date));
				setActivities(sortedActivities);
			} catch (err) {
				console.error('Error fetching activities', err);
			}
		};

		const fetchComments = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itineraryId}/comments`);
				const data = await res.json();
				setItinerary((prev) => ({...prev, comments: data}));
			} catch (err) {
				console.error('Error fetching comments', err);
			}
		}

		const sendEmail = async () => {
			setLoading(true);
			try {
				const subject = 'Check out this itinerary!';
				const body = `Here's a link to an interesting itinerary: http://localhost:3000/museum/${itineraryId}`;

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

		const checkUserBooking = async () => {
			if (userRole !== 'tourist') {
				return;
			}
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`);
				if (!res.ok) {
					throw new Error('Failed to fetch user bookings');
				}
				const userBookings = await res.json();
				const booking = userBookings.find((booking) => booking._id === itineraryId);

				if (booking) {
					setHasBooked(true);
					const itineraryDate = new Date(booking.availableDates[0]);
					const currentDate = new Date();
					const hoursDifference = (itineraryDate - currentDate) / (1000 * 60 * 60);
					setCanCancel(hoursDifference >= 48);
					setCanComment(itineraryDate < currentDate);
				}
			} catch (err) {
				console.error('Error checking user bookings:', err);
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

		const fetchUser = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
				const data = await res.json();
				setUserEmail(data.email);
			} catch (err) {
				console.error('Error fetching user', err);
			}
		};


		fetchItinerary().then(r => {
			fetchTransportations();
			fetchActivities();
			fetchComments();
			fetchUser();
			if (userId) {
				checkUserBooking();
			}
		});
	}, [itineraryId, userId, userRole]);

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
			const subject = 'Check out this itineraries';
			const body = `Here's a link to an interesting itinerary: http://localhost:3000/itineraries/${itineraryId}`;

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
			toast.error('Only tourists can book itineraries.');
			return;
		}

		if (!cardNumber || !expiryDate || !cvv || !transportation) {
			toast.error('Please complete all fields.');
			return;
		}

		// Parse wallet amount input to a number
		const enteredAmount = parseFloat(walletAmount);

		if (enteredAmount <= 0) {
			toast.error('Please enter a valid wallet amount.');
			return;
		}

		try {
			// Fetch user to check wallet balance
			const userRes = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userRes.ok) {
				throw new Error('Failed to fetch user details');
			}

			const user = await userRes.json();
			const userDob = new Date(user.dob);
			const ageDifference = new Date().getFullYear() - userDob.getFullYear();
			const age = (new Date().getMonth() - userDob.getMonth() < 0 ||
				(new Date().getMonth() === userDob.getMonth() && new Date().getDate() < userDob.getDate()))
				? ageDifference - 1 : ageDifference;

			if (age < 18) {
				toast.error('You must be at least 18 to book.');
				return;
			}
			// Check if user has enough in wallet
			if (enteredAmount > user.wallet) {
				toast.error('Not enough balance in wallet.');
				return;
			}

			// Check for existing bookings
			const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-bookings/${userId}`);
			if (!res.ok) {
				throw new Error('Failed to fetch user bookings');
			}

			const userBookings = await res.json();
			const isAlreadyBooked = userBookings.some((booking) => booking._id === itineraryId);

			if (isAlreadyBooked) {
				toast.info('Itinerary already booked');
				closeBookingModal();
				return;
			}

			// Deduct wallet amount from user balance
			const updatedWalletBalance = user.wallet - enteredAmount;

			// Make the booking request and update wallet balance
			const bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-booking/${userId}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({itineraryId, walletAmount: enteredAmount})
			});

			if (!bookingResponse.ok) {
				throw new Error('Failed to book the itinerary');
			}

			// Update user's wallet balance
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({wallet: updatedWalletBalance})
			});

			try {
				// ... existing booking logic


			} catch (error) {
				console.error('Error during booking:', error);
				toast.error('Failed to complete booking or send confirmation email. Please try again.');
			}

			toast.success('Itinerary booked successfully');
			window.dispatchEvent(userUpdateEvent);
			window.location.reload();
			closeBookingModal();
		} catch (error) {
			console.error('Error booking itinerary:', error);
			toast.error('Failed to book the itinerary. Please try again.');
		}

		try {
			// Send a confirmation email
			if (transportation.toLowerCase() !== 'my car') {
				const emailBody = `${transportation} will take you from ${userLocation} at the appropriate time.`;
				const emailResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({email: userEmail, subject: 'Booking Confirmation', message: emailBody}),
				});

				if (!emailResponse.ok) {
					throw new Error('Failed to send booking confirmation email');
				}

				toast.success('Confirmation email sent successfully');
			}
		} catch (error) {
			console.error('Error sending confirmation email:', error);
			toast.error('Failed to send confirmation email. Please try again.');
		}
	};
	const handleShowTourGuideDetails = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND}/api/users/${itinerary?.createdBy}`;
			const response = await fetch(url);
			const data = await response.json();
			setTourGuide(data);

			let image2Base64 = null;
			if (data?.profilePicture?.data?.data && data?.profilePicture?.contentType) {
				try {
					const byteArray = new Uint8Array(data.profilePicture.data.data);
					const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
					image2Base64 = `data:${data.profilePicture.contentType};base64,${btoa(binaryString)}`;
				} catch (error) {
					console.error('Error converting image data to base64:', error);
				}
			}
			setPlaceHolder(image2Base64 || ''); // Ensure placeholder updates even if there's no image.

			//set tour guide ratingfs

		} catch (error) {
			console.error('Error fetching tour guide:', error);
			setPlaceHolder(''); // Ensure placeholder resets on error.
		}
	};

	const handleCancelBooking = async () => {
		const userConfirmed = window.confirm("Are you sure you want to cancel the booking?");
		if (!userConfirmed) {
			return;
		}
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-booking/${userId}`, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({itineraryId})
			});

			if (!response.ok) {
				throw new Error('Failed to cancel the booking');
			}

			toast.success('Booking canceled successfully');
			window.dispatchEvent(userUpdateEvent);
			setHasBooked(false);
			setCanCancel(false);
			setCanComment(false);
		} catch (error) {
			console.error('Error canceling booking:', error);
			toast.error('Failed to cancel the booking. Please try again.');
		}
	};

	const convertToBase64 = (imageDataObject) => {
		if (!imageDataObject?.data?.data || !imageDataObject?.contentType) {
			return null; // Return null if data or content type is missing
		}

		try {
			const byteArray = new Uint8Array(imageDataObject.data.data);
			const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
			return `data:${imageDataObject.contentType};base64,${btoa(binaryString)}`;
		} catch (error) {
			console.error('Error converting image data to base64:', error);
			return null; // Return null in case of error
		}
	};

	const imageBase64 = itinerary?.image?.data
		? `data:${itinerary.image.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(itinerary.image.data.data)))}`
		: '';

	// const imageBase64TourGuide = tourGuide?.profilePicture?.data?.data
	// 	? `data:${tourGuide.profilePicture.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(tourGuide.profilePicture.data.data)))}`
	// 	: '';


	const renderStars = (rating) => {
		// check rating correct
		if (isNaN(rating) || rating < 0 || rating > 5) {
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

	const handleAddComment = async () => {
		if (!commentText || commentRating === 0) {
			toast.error('Please provide a comment and a rating.');
			return;
		}
		const newComment = {
			user: sessionStorage.getItem('user id'),
			text: commentText,
			stars: commentRating,
			date: new Date().toISOString() // Ensure correct date format
		};

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/${itineraryId}/comments`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(newComment)
			});

			if (!response.ok) {
				throw new Error('Failed to add comment');
			}

			const updatedItinerary = await response.json();
			setItinerary(updatedItinerary);
			setCommentText("");
			setCommentRating(0);
			toast.success("Comment added successfully");
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Failed to add comment. Please try again.');
		}
	};
	const handleAddTourGuideComment = async () => {
		const newComment = {
			user: sessionStorage.getItem('user id'),
			text: commentTextTourGuide,
			stars: commentRatingTourGuide,
			date: new Date().toISOString() // Ensure correct date format
		};
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${itinerary.createdBy}/comments`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(newComment)
			});
			if (!response.ok) {
				throw new Error('Failed to add comment');
			}
			const updatedItinerary = await response.json();
			setItinerary(updatedItinerary);
			setCommentText("");
			setCommentRating(0);
			toast.success("Comment added successfully");
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Failed to add comment. Please try again.');
		}
	}


	if (loading) return <p>Loading...</p>;

	return (
		<div>
			<section className="px-4 py-10 bg-gray-100">
				<div className="container mx-auto">
					{/* Header Section */}
					<div className="flex items-center justify-between bg-white p-6 shadow-lg rounded-lg mb-4">
						<div className="flex flex-col">
							<h1 className="text-4xl font-bold text-gray-800 mb-1">{itinerary?.title}</h1>
							<p className="text-gray-500 text-lg">{itinerary?.duration}</p>
							<div className="flex items-center mt-2 space-x-3">
								<span className="flex items-center text-2xl">{<span
									className="flex items-center text-2xl">
									{itinerary?.comments.length > 0 ? renderStars((itinerary.comments.reduce((sum, comment) => sum + comment.stars, 0) / itinerary.comments.length).toFixed(1)) : 'No ratings'}</span>}</span>
								<p className="text-gray-600 text-sm">({itinerary?.comments?.length} reviews)</p>
							</div>
							<div className="flex items-center mt-3 text-gray-600 space-x-1">
								<FaMapMarkerAlt className="text-gray-500"/>
								<span>{itinerary?.pickupLocation}</span>
							</div>
							<p className="text-gray-700 mt-4 leading-relaxed">{itinerary?.description}</p>
						</div>
						<div className="flex flex-col items-center space-y-4">
							<button
								onClick={() => setIsBookingModalOpen(true)}
								className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
							>
								Book Itinerary
							</button>
							<button
								className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40">
								<AiOutlineHeart className="text-lg mr-2"/>
								Save
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
												value={`http://localhost:3000/itineraries/${itineraryId}`}
												readOnly
												className="w-full px-2 py-1 border rounded-lg focus:outline-none"
												onClick={(e) => e.target.select()}
											/>
											<button
												onClick={() => navigator.clipboard.writeText(`http://localhost:3000/itineraries/${itineraryId}`)
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
					<button onClick={handleShowTourGuideDetails}
					        className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#27045c]">Show Tour Guide
						Details
					</button>
					{/* Tour Guide Details */}
					{tourGuide && (
						<div className="bg-white p-6 rounded-lg shadow-lg mt-8">
							<h2 className="text-2xl font-semibold text-[#330577] mb-4">Meet Your Tour Guide</h2>
							<div className="flex items-center space-x-6">
								{placeholder && (
									<img
										src={placeholder}
										alt={`${tourGuide.firstName} ${tourGuide.lastName}`}
										className="w-24 h-24 rounded-full object-cover"
									/>
								)}
								<div>
									<p className="text-lg font-semibold">{`${tourGuide.firstName} ${tourGuide.lastName}`}</p>
									<p className="text-gray-600">Years of Experience: {tourGuide.yearsOfExperience}</p>
									<div className="flex items-center mt-1">{renderStars((tourGuide.comments.reduce((sum, comment) => sum + comment.stars, 0) / tourGuide.comments.length).toFixed(1))}</div>
								</div>
							</div>

							{/* Add Comment on Tour Guide */}
							{hasBooked && canComment && (
								<div className="mt-4">
									<h3 className="font-semibold text-lg text-[#330577]">Leave a Comment for the Tour
										Guide</h3>
									<textarea
										value={commentTextTourGuide}
										onChange={(e) => setCommentTextTourGuide(e.target.value)}
										placeholder="Write your comment here..."
										className="w-full border rounded-lg p-2 mt-2 mb-4"
									/>
									<div className="flex items-center mb-4">
										<span className="mr-2">Rating:</span>
										{[1, 2, 3, 4, 5].map(star => (
											<FaStar
												key={star}
												className={`cursor-pointer ${commentRatingTourGuide >= star ? 'text-yellow-500' : 'text-gray-300'}`}
												onClick={() => setCommentRatingTourGuide(star)}
											/>
										))}
									</div>
									<button
										onClick={handleAddTourGuideComment}
										className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#27045c]"
									>
										Submit
									</button>
								</div>
							)}
						</div>
					)}
					{/* Image Gallery */}
					{imageBase64 && (
						<div className="mt-8">
							<img src={imageBase64} alt="Itinerary"
							     className="w-full h-96 object-cover rounded-lg shadow-md"/>
						</div>
					)}
					{/* Activities Timeline */}
					{activities.length > 0 && (
						<div className="mt-8">
							<h2 className="text-2xl font-semibold text-[#330577] mb-4">Activities Timeline</h2>
							<div className="relative bg-gray-50 p-6 rounded-lg shadow-md overflow-hidden">
								{/* Vertical line for timeline */}
								<div className="absolute left-16 top-0 h-full w-1 bg-[#330577]"></div>
								<div className="space-y-8">
									{activities.map((activity, index) => {
										const activityImage = convertToBase64(activity.image);
										return (
											<div
												key={activity._id}
												className="flex items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
											>
												{/* Timeline dot */}
												<div
													className="flex-shrink-0 relative w-4 h-4 bg-[#330577] rounded-full mr-6 ml-2 border-2 border-white shadow-lg"></div>

												{/* Activity image */}
												{activityImage && (
													<div
														className="flex-shrink-0 w-48 h-48 overflow-hidden rounded-lg border border-gray-200 shadow-sm mr-4">
														<img
															src={activityImage}
															alt={`Activity ${activity.title}`}
															className="object-cover w-full h-full"
														/>
													</div>
												)}

												{/* Activity Details */}
												<div className="flex-grow">
													<p className="text-sm text-gray-500 mb-2 flex items-center">
														<FaClock
															className="mr-2 text-[#330577]"/> {new Date(activity.date).toLocaleDateString()}
													</p>
													<h3
														onClick={() => window.open(`/activities/${activity._id}`, '_blank')}
														className="text-lg font-semibold text-[#330577] mb-1 cursor-pointer hover:underline"
													>
														{activity.title}
													</h3>
													<p className="text-gray-600 mb-2">{activity.description}</p>
													<div className="mb-2">
														<LocationContact activity={activity}/>
													</div>
													<div className="flex items-center mt-2">
														<span
															className="flex text-yellow-500 text-lg">{renderStars(activity.rating)}</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}


					{/* Comments Section */}
					<div className="bg-white p-4 rounded-lg shadow-md mt-8">
						<h2 className="font-semibold text-lg text-[#330577]">Comments</h2>
						{itinerary?.comments?.length ? (
							itinerary.comments?.slice(0, 3).map((comment, index) => (
								<div key={index} className="border-b border-gray-200 pb-4 mb-4">
									<p className="font-semibold text-gray-800">{comment?.user?.username}</p>
									<p className="text-gray-600">{comment?.text}</p>
									<p className="text-sm text-gray-400">{comment?.date ? new Date(comment?.date).toLocaleDateString() : 'Date not available'}</p>
									<div className="flex items-center mt-2">
										<span
											className="flex items-center text-2xl">{comment?.stars ? renderStars(comment?.stars) : renderStars(0)}</span>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500">No comments yet.</p>
						)}

						{/* Add Comment Form */}
						{userRole === 'tourist' && hasBooked && canComment && (
							<div className="mt-4">
								<h2 className="font-semibold text-lg text-[#330577]">Add a Comment</h2>
								<textarea
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
									placeholder="Write your comment here..."
									className="w-full border rounded-lg p-2 mt-2 mb-4"
								/>
								<div className="flex items-center mb-4">
									<span className="mr-2">Rating:</span>
									{[1, 2, 3, 4, 5].map(star => (
										<FaStar
											key={star}
											className={`cursor-pointer ${commentRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
											onClick={() => setCommentRating(star)}
										/>
									))}
								</div>
								<button
									onClick={handleAddComment}
									className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#27045c]"
								>
									Submit
								</button>
							</div>
						)}
					</div>

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

					{/* Booking Modal */}
					{isBookingModalOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-6 rounded-lg shadow-lg w-96">
								<h2 className="text-2xl font-semibold mb-4">Complete Booking</h2>
								<div className="mb-4">
									<label className="block mb-2">Card Number</label>
									<input
										type="text"
										value={cardNumber}
										onChange={(e) => setCardNumber(e.target.value)}
										className="w-full border rounded-lg p-2"
										placeholder="1234 5678 9012 3456"
									/>
								</div>
								<div className="mb-4">
									<label className="block mb-2">Expiry Date</label>
									<input
										type="text"
										value={expiryDate}
										onChange={(e) => setExpiryDate(e.target.value)}
										className="w-full border rounded-lg p-2"
										placeholder="MM/YY"
									/>
								</div>
								<div className="mb-4">
									<label className="block mb-2">CVV</label>
									<input
										type="text"
										value={cvv}
										onChange={(e) => setCvv(e.target.value)}
										className="w-full border rounded-lg p-2"
										placeholder="123"
									/>
								</div>
								<div className="mb-4">
									<label className="block mb-2">Transportation</label>
									<select
										value={transportation}
										onChange={(e) => setTransportation(e.target.value)}
										className="w-full border rounded-lg p-2"
									>
										<option value="">Select</option>
										{/* Render dynamically fetched transportations */}
										{transportations.map((transport) => (
											<option key={transport._id} value={transport.name}>
												{transport.name}
											</option>
										))}
										{/* Ensure "My Car" is always an option */}
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
									<label className="block mb-2">Location</label>
									<input
										type="text"
										value={userLocation}
										onChange={(e) => setUserLocation(e.target.value)}
										className="w-full border rounded-lg p-2"
										placeholder="Enter your location"
									/>
								</div>
								<button
									onClick={handleCompleteBooking}
									className={`w-full bg-[#330577] text-white p-2 rounded-lg ${!cardNumber || !expiryDate || !cvv || !transportation ? 'opacity-85 cursor-not-allowed' : 'hover:bg-[#472393]'}`}
									disabled={!cardNumber || !expiryDate || !cvv || !transportation}
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
				</div>
			</section>
		</div>
	);
};

export default ItineraryDetail;