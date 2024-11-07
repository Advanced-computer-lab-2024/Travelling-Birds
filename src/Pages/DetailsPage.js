import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Header from "../Components/Header";
import LocationContact from "../Components/Location";

const ActivityDetail = () => {
	const [loading, setLoading] = useState(true);
	const [activity, setActivity] = useState(null);
	const [commentText, setCommentText] = useState("");
	const [commentRating, setCommentRating] = useState(0);
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
		}
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
		const fullStars = Math.floor(rating);
		const halfStars = rating % 1 !== 0;
		return (
			<>
				{[...Array(fullStars)].map((_, i) => (
					<FaStar key={i} className="text-yellow-500" />
				))}
				{halfStars && <FaStarHalfAlt className="text-yellow-500" />}
				{[...Array(5 - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} className="text-yellow-500" />
				))}
			</>
		);
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
					{/* Header Section */}
					<Header activity={activity} />
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
							<p className="text-gray-700 mt-2">Price range: ${activity?.priceRange?.lwBound} - ${activity?.priceRange?.hiBound}</p>
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
									className={`cursor-pointer ${commentRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
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