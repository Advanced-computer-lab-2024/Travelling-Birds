import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import { AiOutlineHeart } from "react-icons/ai";
import LocationContact from "../Components/Locations/Location";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {userUpdateEvent} from "../utils/userUpdateEvent";


const ActivityDetail = () => {
    const [loading, setLoading] = useState(true);
    const [showAllComments, setShowAllComments] = useState(false);
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
    const currencyCode = sessionStorage.getItem('currency') || 'EGP';
    const activityId = useParams().id;
    const userId = sessionStorage.getItem('user id');
    const userRole = sessionStorage.getItem('role');
    const [userLocation, setUserLocation] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchActivity = async () => {
            const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/${activityId}`;
            try {
                const res = await fetch(apiUrl);
                const activityData = await res.json();
                setActivity(activityData);
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
                setActivity((prev) => ({ ...prev, comments }));
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
            }
            catch (error) {
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
        fetchUsers();
        fetchTransportations();
        fetchActivity();
        fetchComments();
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
                body: JSON.stringify({ email, subject, message: body }),
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
    
        if (!cardNumber || !expiryDate || !cvv || !transportation) {
            toast.error('Please complete all fields.');
            return;
        }
    
        // Parse the wallet input amount
        const enteredWalletAmount = parseFloat(walletAmount);
        if (enteredWalletAmount <= 0) {
            toast.error('Please enter a valid wallet amount.');
            return;
        }
    
        try {
            // Fetch user data to get the wallet balance
            const userResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userResponse.json();
            const userWalletBalance = userData.wallet;
    
            // Check if there is enough balance in the wallet
            if (enteredWalletAmount > userWalletBalance) {
                toast.error('Not enough in wallet.');
                return;
            }
    
            // Proceed with booking
            const userBookingsResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`);
            if (!userBookingsResponse.ok) {
                throw new Error('Failed to fetch user bookings');
            }
    
            const userBookings = await userBookingsResponse.json();
            const isAlreadyBooked = userBookings.some((booking) => booking._id === activityId);
    
            if (isAlreadyBooked) {
                toast.info('Activity already booked');
                closeBookingModal();
                return;
            }
    
            // Deduct wallet balance
            const updatedWalletBalance = userWalletBalance - enteredWalletAmount;
            await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}/wallet`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet: updatedWalletBalance })
            });
    
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-booking/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activityId })
            });
    
            if (!response.ok) {
                throw new Error('Failed to book the activity');
            }
            if (transportation.toLowerCase() !== 'my car') {
                const emailBody = `${transportation} will take you from ${userLocation} at the appropriate time.`;
                const emailResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/mail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail, subject: 'Booking Confirmation', message: emailBody }),
                });

                if (!emailResponse.ok) {
                    throw new Error('Failed to send booking confirmation email');
                }

                toast.success('Confirmation email sent successfully');
            }
         
    
            toast.success('Activity booked successfully');
            window.dispatchEvent(userUpdateEvent);
            closeBookingModal();
        } catch (error) {
            console.error('Error booking activity:', error);
            toast.error('Failed to book the activity. Please try again.');
        }
    };

     // Function to handle canceling the booking
     const handleCancelBooking = async () => {
        const userConfirmed = window.confirm("Are you sure you want to cancel the booking?");
        if (!userConfirmed) {
            return; // Do nothing if the user cancels the confirmation dialog
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/activity-booking/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activityId })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel the booking');
            }

            toast.success('Booking canceled successfully');
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
                headers: { 'Content-Type': 'application/json' },
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
                    <FaStar key={i} style={{ color: '#330577' }} />
                ))}
                {halfStars && <FaStarHalfAlt style={{ color: '#330577' }} />}
                {[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
                    <FaRegStar key={i + fullStars} style={{ color: '#330577' }} />
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
 


    if (loading) return <p>Loading...</p>;

    return (
        <div>
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
                                <FaMapMarkerAlt className="text-gray-500" />
                                <span>{activity?.location?.address}</span>
                            </div>
                            <p className="text-gray-700 mt-4 leading-relaxed">{activity?.description}</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <button
                                onClick={openBookingModal}
                                className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
                            >
                                Book Activity
                            </button>
                            <button
                                className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
                            >
                                <AiOutlineHeart className="text-lg mr-2" />
                                Save
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsShareOpen(!isShareOpen)}
                                    className="p-3 px-6 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center justify-center w-40"
                                >
                                    <FaShareAlt className="mr-2" /> Share
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
                                    className={`w-full bg-[#330577] text-white p-2 rounded-lg ${!cardNumber || !expiryDate || !cvv || !transportation ? 'opacity-85 cursor-not-allowed' : 'hover:bg-[#330577]'}`}
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
                      {/* Image Gallery */}
                      <div className="mt-8">
                        <img src={imageBase64} alt="Activity" className="w-full h-96 object-cover rounded-lg shadow-md" />
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
                                        <p className="text-gray-800">{review.user}</p>
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
                            <p className="text-gray-700 mt-2">Price range: {activity?.priceRange ? `${formatPriceRange(activity.priceRange.lwBound)}  - ${formatPriceRange(activity.priceRange.hiBound)}` : 'N/A'}</p>
                            <p className="text-gray-700">Category: {activity?.category}</p>
                            <p className="text-gray-700">Special discounts: {activity?.specialDiscounts}</p>
                            <p className="text-gray-700">Features: {activity?.features?.join(', ')}</p>
                        </div>

                        {/* Location & Contact */}
                        <LocationContact activity={activity} />
                    </div>

                    {/* Comments Section */}
                        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                            <h2 className="font-semibold text-lg mb-4 text-[#330577]">All Reviews</h2>
                            {activity?.comments?.length ? (
                                activity.comments.slice(0, visibleCommentsCount).map((comment, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                                        <p className="font-semibold text-gray-800">{comment.user}</p>
                                        <p className="text-gray-600">{comment.text}</p>
                                        <p className="text-sm text-gray-400">{new Date(comment.date).toLocaleDateString()}</p>
                                        <div className="flex items-center mt-2">
                                            <span className="flex items-center text-2xl">
                                                {renderStars(comment.stars)}
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
                                        style={{ color: commentRating >= star ? '#330577' : 'lightgray' }}
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