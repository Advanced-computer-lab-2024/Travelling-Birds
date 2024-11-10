import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import ProductDisplay from '../Components/Models/Displays/ProductsDisplay';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);
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
                       <ProductDisplay product={product} />
                    </div>
                ))
            )}
        </div>
    );
};

export default MyPurchases;