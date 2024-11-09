import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import { AiOutlineHeart } from "react-icons/ai";
import LocationContact from "../Components/Locations/Location";

const ActivityDetail = () => {
	const [loading, setLoading] = useState(true);
	const [activity, setActivity] = useState(null);
	const [commentText, setCommentText] = useState("");
	const [commentRating, setCommentRating] = useState(0);
	const [isShareOpen, setIsShareOpen] = useState(false); // State to control share dropdown visibility
	const [email, setEmail] = useState(''); // State to store email input
	const activityId = useParams().id;

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
		fetchActivity();
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
		fetchComments();
	}, [activityId]);

	// Convert image to base64 if exists
	let imageBase64 = null;
	if (activity?.image?.data?.data && activity.image.contentType) {
		const byteArray = new Uint8Array(activity.image.data.data);
		const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
		imageBase64 = `data:${activity.image.contentType};base64,${btoa(binaryString)}`;
	}

	if (loading) return <p>Loading...</p>;

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
		const currency = sessionStorage.getItem('currency') || 'USD';
		if (currency === 'EGP') {
			return `${(price * 49.3).toFixed(2)} EGP`;
		} else if (currency === 'EUR') {
			return `€${(price * 0.93).toFixed(2)}`;
		} else {
			return `$${price.toFixed(2)}`; // Default to USD
		}
	};

	// Handle copying the link to clipboard
	const handleCopyLink = () => {
		const link = `http://localhost:3000/activities/${activityId}`;
		navigator.clipboard.writeText(link).then(() => {
			alert('Link copied to clipboard!');
			setIsShareOpen(false); // Close the dropdown menu after copying
		});
	};

	// Handle sending the link via email
	const handleSendEmail = () => {
		if (!email) {
			alert('Please enter a valid email address.');
			return;
		}

		const link = `http://localhost:3000/activities/${activityId}`;
		window.open(`mailto:${email}?subject=Check out this activity&body=Here's a link to an interesting activity: ${link}`, '_blank');
		setEmail(''); // Clear email input
		setIsShareOpen(false); // Close the dropdown
	};

	// Handle submitting a new comment
    const handleAddComment = async () => {
        if (!commentText || commentRating === 0) {
            alert("Please provide a comment and a rating.");
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

            // Update local state with new comment
            setActivity((prev) => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])]
            }));
            setCommentText("");
            setCommentRating(0);
        } catch (err) {
            console.error("Error adding comment:", err);
            alert("Failed to add comment. Please try again.");
        }
    };


	return (
		<div>
			<section className="px-4 py-10 bg-gray-100">
				<div className="container-xl lg:container m-auto">
					{/* Title, Description, and Buttons */}
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
							<button className="p-2 px-4 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center space-x-2">
								<AiOutlineHeart className="text-lg" />
								<span>Save</span>
							</button>
							<div className="relative">
								<button
									onClick={() => setIsShareOpen(!isShareOpen)}
									className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#472393] flex items-center"
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
												onClick={handleCopyLink}
												className="bg-[#330577] text-white px-3 py-1 rounded-lg hover:bg-[#27045c]"
											>
												Copy
											</button>
										</div>
										{/* Email Sharing */}
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
												onClick={handleSendEmail}
												className="bg-[#330577] text-white px-3 py-1 rounded-lg hover:bg-[#27045c]"
											>
												Send
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

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
										<p className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</p>
										<span className="flex">{renderStars(review.stars)}</span>
									</div>
								))}
							</div>
						</div>

						{/* Details Section */}
						<div className="bg-white p-4 rounded-lg shadow-md">
							<h2 className="font-semibold text-lg text-[#330577]">Details</h2>
							<p className="text-gray-700 mt-2">Price range: {activity?.priceRange ? `${formatPriceRange(activity.priceRange.lwBound)} - ${formatPriceRange(activity.priceRange.hiBound)}` : 'N/A'}</p>
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
							activity.comments.map((comment, index) => (
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
					</div>

					{/* Add Comment Form */}
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
				</div>
			</section>
		</div>
	);
};

export default ActivityDetail;