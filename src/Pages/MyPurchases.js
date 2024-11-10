import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commentRating, setCommentRating] = useState(0);
    const userId = sessionStorage.getItem('user id');
    const userRole = sessionStorage.getItem('role');

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-purchases/${userId}`);
                //const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/products`);
                
                if (!res.ok) {
                    throw new Error('Failed to fetch product purchases');
                }
                const data = await res.json();
                setPurchases(data);
            } catch (err) {
                console.error('Error fetching product purchases:', err);
            }
        };

        if (userRole === 'tourist') {
            fetchPurchases();
        }
    }, [userId, userRole]);

    const handleAddComment = async (productId) => {
        if (!commentText || commentRating === 0) {
            toast.error('Please provide a comment and a rating.');
            return;
        }

        const newComment = {
            user: userId,
            text: commentText,
            stars: commentRating,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            // Optimistically update state
            setPurchases((prevPurchases) =>
                prevPurchases.map((product) =>
                    product._id === productId
                        ? { ...product, reviews: [...product.reviews, commentText], ratings: [...product.ratings, commentRating] }
                        : product
                )
            );

            setCommentText("");
            setCommentRating(0);
            toast.success('Comment added successfully');
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Failed to add comment. Please try again.');
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
                {[...Array(fullStars)].map((_, i) => <FaStar key={i} className="text-yellow-500" />)}
                {halfStars && <FaStarHalfAlt className="text-yellow-500" />}
                {[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => <FaRegStar key={i + fullStars} className="text-yellow-500" />)}
            </>
        );
    };

    return (
        <div className="bg-[#330577] text-white p-6">
            <h1 className="text-3xl font-bold mb-6">My Purchases</h1>
            {purchases.length === 0 ? (
                <p>No purchases found.</p>
            ) : (
                purchases.map((product) => (
                    <div key={product._id} className="bg-white text-[#330577] p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold">{product.name}</h2>
                        <p className="mt-2">{product.description}</p>
                        <p className="mt-2 font-bold">Price: ${product.price}</p>

                        {/* Comment Section */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg">Add a Review</h3>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your review here..."
                                className="w-full border border-[#330577] rounded-lg p-2 mt-2 mb-4"
                            />
                            <div className="flex items-center mb-4">
                                <span className="mr-2">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`cursor-pointer ${commentRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                        onClick={() => setCommentRating(star)}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => handleAddComment(product._id)}
                                className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#472393]"
                            >
                                Submit Review
                            </button>
                        </div>

                        {/* View Ratings Button */}
                        <button
                            onClick={() => setExpandedProductId(expandedProductId === product._id ? null : product._id)}
                            className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#472393] mt-4"
                        >
                            {expandedProductId === product._id ? 'Hide Ratings & Reviews' : 'View Ratings & Reviews'}
                        </button>

                        {/* Expanded Ratings and Reviews Section */}
                        {expandedProductId === product._id && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-lg mb-2">Ratings & Reviews</h3>
                                {product.ratings?.length > 0 ? (
                                    product.ratings.map((rating, index) => (
                                        <div key={index} className="border-b border-[#330577] pb-2 mb-2">
                                            <p className="text-sm text-[#330577]">{product.reviews[index]}</p>
                                            <div className="flex items-center mt-1">
                                                {renderStars(rating)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyPurchases;