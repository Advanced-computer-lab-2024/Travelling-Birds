import React, { useState, useEffect } from 'react';
import ProductDisplay from '../../Components/Models/Displays/ProductsDisplay';
import { toast } from 'react-toastify';

const ProductCart = () => {
    const [cart, setCart] = useState([]);
    const userId = sessionStorage.getItem('user id');
    const userRole = sessionStorage.getItem('role');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductCart = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-cart/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    const productsWithImages = data.map(product => {
                        let imageBase64 = null;
                        if (product.picture?.data && product.picture.contentType) {
                            try {
                                const byteArray = new Uint8Array(product.picture.data.data); // Ensure data access structure is correct
                                const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
                                imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
                            } catch (error) {
                                console.error('Error converting image data to base64:', error);
                            }
                        }
                        // Return the product with the base64 image URL
                        return {
                            ...product,
                            picture: imageBase64 // Set the picture to the base64 string
                        };
                    });

                    setCart(productsWithImages); // Update state with products and base64 images
                } else {
                    toast.error(data.message || 'Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('An error occurred while fetching products');
            } finally {
                setLoading(false);
            }
        };
        if (userRole === 'tourist') {
            fetchProductCart();
        }
    }, [userId, userRole]);

    // Calculate total price
    const totalPrice = cart.reduce((total, product) => total + product.price, 0);

    if (loading) {
        return (
            <div className="text-[#330577] p-6">
                <h1 className="text-3xl font-bold mb-6">My Cart</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="text-[#330577] p-6">
            {/* Header section with title */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Cart</h1>
            </div>

            {/* Cart content */}
            {cart.length === 0 ? (
                <p>No Products found.</p>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {/* Product cards */}
                    {cart.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white text-[#330577] p-4 rounded-lg shadow-md w-full md:w-1/3 lg:w-1/4"
                        >
                            <ProductDisplay product={product} />
                        </div>
                    ))}

                    {/* Summary card */}
                    <div className="bg-white text-[#330577] p-4 rounded-lg shadow-md w-full md:w-1/3 lg:w-1/4">
                        <div className="text-xl font-bold mb-4">Order Summary</div>
                        {cart.map((product) => (
                            <div key={product._id} className="flex justify-between mb-2">
                                <span>{product.name}</span>
                                <span>${product.price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="w-full mt-4 bg-[#330577] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#472393] text-sm font-medium transition-all"
                        >
                            Check Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCart;