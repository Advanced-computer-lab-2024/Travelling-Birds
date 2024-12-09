import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaClock, FaMapMarkerAlt, FaRegStar, FaShareAlt, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationContact from "../../Components/Locations/Location";
import {userUpdateEvent} from "../../utils/userUpdateEvent";
import { CardElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import useNavigationHistory from "../../Components/useNavigationHistory";

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
	const [isSaved, setIsSaved] = useState(false);
	const stripe = useStripe();
	const elements = useElements();
	const [promoCode, setPromoCode] = useState("");
	const [ promoCodeValid, setPromoCodeValid] = useState(null);
	const { goToPreviousPage } = useNavigationHistory(); // Use the custom hook

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

		const checkIfSaved = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-itineraries/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch saved activities');
                
                const savedItinerary = await response.json();
                // Check if the activity is already in the saved activities
                const saved = savedItinerary.some(itinerary => itinerary._id === itineraryId);
                setIsSaved(saved);
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };


		fetchItinerary().then(r => {
			fetchTransportations();
			fetchActivities();
			fetchComments();
			fetchUser();
			checkIfSaved();
			if (userId) {
				checkUserBooking();
			}
		});
	}, [itineraryId, userId, userRole, email]);

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
	
		if (!transportation) {
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
			// Check if the itinerary is already booked
			if (hasBooked) {
				toast.error('Itinerary already booked.');
				return;
			}
	
			// Fetch user details
			const userRes = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userRes.ok) {
				throw new Error('Failed to fetch user details');
			}
			const user = await userRes.json();
			const userWalletBalance = user.wallet;
	
			const userDob = new Date(user.dob);
			const ageDifference = new Date().getFullYear() - userDob.getFullYear();
			const age = (new Date().getMonth() - userDob.getMonth() < 0 ||
				(new Date().getMonth() === userDob.getMonth() && new Date().getDate() < userDob.getDate()))
				? ageDifference - 1 : ageDifference;
	
			if (age < 18) {
				toast.error('You must be at least 18 to book.');
				return;
			}

            let finalprice = itinerary.price;

			if(promoCodeValid){
				finalprice *= 0.85; // Apply 25% discount
			}
				

	
			// Handle wallet-only payment if sufficient balance is available
			if (enteredAmount >= finalprice && enteredAmount <= userWalletBalance) {
				const updatedWalletBalance = userWalletBalance - enteredAmount;
	
				// Update wallet balance
				const walletUpdateResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ wallet: updatedWalletBalance }),
				});
	
				if (!walletUpdateResponse.ok) {
					const errorData = await walletUpdateResponse.json();
					console.error('Wallet update error:', errorData);
					throw new Error('Failed to update wallet balance');
				}
	
				console.log('Wallet successfully updated.');
	
				// Proceed with booking
				const bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-booking/${userId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ itineraryId }),
				});
	
				if (!bookingResponse.ok) {
					throw new Error('Failed to book the itinerary');
				}
	
				console.log('Itinerary booked successfully using wallet balance.');
	
				// Send payment receipt email
				const receiptSubject = `Payment Receipt for Itinerary: ${itinerary?.title}`;
				const receiptHtml = `
					<h1>Thank You for Your Payment!</h1>
					<p>You have successfully booked the itinerary: <strong>${itinerary?.title}</strong>.</p>
					<p><strong>Amount Paid:</strong> ${formatPriceRange(itinerary.price)}</p>
					<p>We hope you enjoy your journey!</p>
				`;
	
				await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: userEmail,
						subject: receiptSubject,
						message: '', // Plain text fallback
						htmlContent: receiptHtml,
					}),
				});
	
				toast.success('Itinerary booked successfully using wallet balance!');
				window.dispatchEvent(userUpdateEvent);
				window.location.reload();
				closeBookingModal();
				return; // Exit after successfully booking with wallet
			}
	
			// Proceed with Stripe payment if wallet is insufficient
			const cardElement = elements.getElement(CardElement);
			const { paymentMethod, error } = await stripe.createPaymentMethod({
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
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: itinerary.price * 100, // Convert to cents
					currency: 'usd',
					paymentMethodId: paymentMethod.id,
				}),
			});
	
			const paymentResult = await paymentResponse.json();
			if (!paymentResult.success) {
				toast.error(`Payment failed: ${paymentResult.error}`);
				return;
			}
	
			console.log('Stripe payment successful.');
	
			// Deduct wallet balance (if partially used)
			const updatedWalletBalance = userWalletBalance - enteredAmount;
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet: updatedWalletBalance }),
			});
	
			// Finalize booking
			const bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-booking/${userId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itineraryId }),
			});
	
			if (!bookingResponse.ok) {
				throw new Error('Failed to book the itinerary');
			}
	
			// Send payment receipt email
			const receiptSubject = `Payment Receipt for Itinerary: ${itinerary?.title}`;
			const receiptHtml = `
				<h1>Thank You for Your Payment!</h1>
				<p>You have successfully booked the itinerary: <strong>${itinerary?.title}</strong>.</p>
				<p><strong>Amount Paid:</strong> ${formatPriceRange(itinerary.price)}</p>
				<p>We hope you enjoy your journey!</p>
			`;
	
			await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: userEmail,
					subject: receiptSubject,
					message: '', // Plain text fallback
					htmlContent: receiptHtml,
				}),
			});
	
			toast.success('Itinerary booked successfully, and payment receipt email sent!');
			window.dispatchEvent(userUpdateEvent);
			window.location.reload();
			closeBookingModal();
		} catch (error) {
			console.error('Error booking itinerary:', error);
			toast.error('Failed to book the itinerary. Please try again.');
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
			// Fetch the user data to get the current wallet balance
			const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await userResponse.json();
			const userWalletBalance = userData.wallet;
	
			// Calculate the refund amount
			const refundAmount = itinerary.price;
	
			// Update the wallet balance
			const updatedWalletBalance = userWalletBalance + refundAmount;
	
			const walletUpdateResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet: updatedWalletBalance }),
			});
	
			if (!walletUpdateResponse.ok) {
				throw new Error('Failed to update wallet balance');
			}
	
			// Cancel the booking
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/itinerary-booking/${userId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itineraryId }),
			});
	
			if (!response.ok) {
				throw new Error('Failed to cancel the booking');
			}
	
			toast.success('Booking canceled successfully. Refund processed.');
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

	const saveItinerary = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-itinerary/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itineraryId })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                // Check if the activity is already saved
                if (data.message === 'Itinerary is already saved') {
                    toast.info('This Itinerary is already saved.');
                } else {
                    throw new Error(data.message || 'Failed to save the Itinerary');
                }
                return;
            }
    
            toast.success('Itinerary saved successfully');
        } catch (error) {
            console.error('Error saving Itinerary:', error);
            toast.error('Failed to save the Itinerary. Please try again.');
        }
    };

       // Unsave activity
       const unsaveItinerary = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/saved-itinerary/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itineraryId })
            });

            if (!response.ok) throw new Error('Failed to unsave the Itinerary');
            setIsSaved(false);
            toast.success('Itinerary unsaved successfully');
        } catch (error) {
            console.error('Error unsaving Itinerary:', error);
            toast.error('Failed to unsave the Itinerary. Please try again.');
        }
    };

    const toggleSave = async () => {
        if (isSaved) {
            await unsaveItinerary();
            setIsSaved(false); // Update state immediately
        } else {
			await saveItinerary();
            setIsSaved(true); // Update state immediately
        }
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
                                    onClick={toggleSave}
                                    className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
                                >
                                    {isSaved ? <AiFillHeart className="text-lg mr-2" /> : <AiOutlineHeart className="text-lg mr-2" />}
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
									<div
										className="flex items-center mt-1">{renderStars((tourGuide.comments.reduce((sum, comment) => sum + comment.stars, 0) / tourGuide.comments.length).toFixed(1))}</div>
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
                                    <label className="block mb-2">Location
                                        {/**/}
                                        <input
                                            type="text"
                                            value={userLocation}
                                            onChange={(e) => setUserLocation(e.target.value)}
                                            className="w-full border rounded-lg p-2"
                                            placeholder="Enter your location"
                                        />
                                    </label>
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
				</div>
			</section>
		</div>
	);
};

export default ItineraryDetail;