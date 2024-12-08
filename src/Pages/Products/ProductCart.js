import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {useNavigate} from "react-router-dom";

const ProductCart = () => {
	const [cart, setCart] = useState([]);
	const userId = sessionStorage.getItem('user id');
	const userRole = sessionStorage.getItem('role');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProductCart = async () => {
			try {
				console.log('fetchin');
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-cart/${userId}`);
				const data = await response.json();

				if (response.ok) {
					const productsWithImages = data.map((product) => {
						let imageBase64 = null;
						if (product.picture?.data && product.picture.contentType) {
							try {
								const byteArray = new Uint8Array(product.picture.data.data);
								const binaryString = Array.from(byteArray)
									.map((byte) => String.fromCharCode(byte))
									.join('');
								imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
							} catch (error) {
								console.error('Error converting image data to base64:', error);
							}
						}
						return {
							...product,
							picture: imageBase64,
							quantity: 1,
						};
					});
					console.log('done');
					setCart(productsWithImages);
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

	const totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);

	if (loading) {
		return (
			<div className="text-[#330577] p-6">
				<h1 className="text-3xl font-bold mb-6">My Cart</h1>
				<p>Loading...</p>
			</div>
		);
	}

	const removeProduct = async (productId) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-cart/${userId}`, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({productId}),
			});

			if (response.ok) {
				setCart(cart.filter((product) => product._id !== productId));
				toast.success('Product removed from cart.');
			} else {
				toast.error('Failed to remove product.');
			}
		} catch (error) {
			console.error('Error removing product:', error);
			toast.error('An error occurred.');
		}
	};

	const updateQuantity = async (productId, change) => {
		const productIndex = cart.findIndex(product => product._id === productId);
		if (productIndex === -1) return;  // Exit if product not found

		const product = cart[productIndex];
		const oldQuantity = product.quantity;
		const newQuantity = oldQuantity + change;

		if (newQuantity < 1) {
			await removeProduct(productId);
			return;
		}

		// Check if the new quantity exceeds the available stock
		if (newQuantity > product.availableQuantity) {
			toast.error('Cannot exceed available stock.');
			return;
		}

		// Update the local cart
		const updatedCart = [...cart];
		updatedCart[productIndex] = {...product, quantity: newQuantity};
		setCart(updatedCart);

		// Calculate how much the available stock should be adjusted
		const quantityChange = newQuantity - oldQuantity;

		// Update server with new available quantity
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/${productId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({productId, change: -quantityChange}),  // Subtracting the difference from the available stock
			});

			if (!response.ok) throw new Error('Failed to update available stock on the server');
		} catch (error) {
			console.error('Error updating stock:', error);
			toast.error('An error occurred while updating stock.');
			setCart(cart);
		}
	};


	return (
		<div className="text-[#330577] p-6 bg-gray-100 min-h-screen">
			<h1 className="text-4xl font-extrabold mb-8 text-center">My Shopping Cart</h1>
			<div className="bg-white rounded-lg shadow-md p-6">
				{/* Cart Header */}
				<div className="flex border-b pb-4">
					<div className="w-2/5 text-lg font-semibold">Description</div>
					<div className="w-1/5 text-center text-lg font-semibold">Quantity</div>
					<div className="w-1/5 text-center text-lg font-semibold">Remove</div>
					<div className="w-1/5 text-right text-lg font-semibold">Price</div>
				</div>

				{/* Cart Items */}
				{cart.map((product) => (
					<div key={product._id} className="flex items-center border-b py-4">
						{/* Description */}
						<div className="w-2/5 flex items-center">
							<img
								src={product.picture}
								alt={product.name}
								className="w-16 h-16 rounded mr-4 cursor-pointer"
								onClick={() => navigate(`/products/${product._id}`)}
							/>
							<div>
								<p className="font-medium">{product.name}</p>
								<p className="text-sm text-gray-500">Product Code: {product._id.slice(0, 8)}</p>
							</div>
						</div>

						{/* Quantity */}
						<div className="w-1/5 flex items-center justify-center">
							<button
								className="px-3 py-1 bg-gray-200 border rounded hover:bg-gray-300"
								onClick={() => updateQuantity(product._id, -1)}
								disabled={product.quantity <= 1}
							>
								-
							</button>
							<input
								type="number"
								value={product.quantity}
								readOnly
								className="w-12 text-center border rounded mx-2"
							/>
							<button
								className="px-3 py-1 bg-gray-200 border rounded hover:bg-gray-300"
								onClick={() => {
									updateQuantity(product._id, 1)
								}}
								disabled={product.quantity >= product.availableQuantity}
							>

								+
							</button>
						</div>

						{/* Remove */}
						<div className="w-1/5 flex justify-center">
							<button
								onClick={() => removeProduct(product._id)}
								className="text-red-500 hover:text-red-700 text-3xl"
							>
								✕
							</button>
						</div>

						{/* Price */}
						<div className="w-1/5 text-right font-semibold">
							{product.price.toFixed(2)} EGP
						</div>
					</div>
				))}

				{/* Order Summary */}
				<div className="mt-6 flex justify-between items-center border-t pt-4">
					<p className="text-lg font-bold">Total</p>
					<p className="text-lg font-bold">{totalPrice.toFixed(2)} EGP</p>
				</div>

				{/* Buttons */}
				<div className="mt-6 flex justify-between">
					<button
						onClick={() => navigate("/products")}
						className="bg-gray-200 text-black py-2 px-6 rounded hover:bg-gray-300"
					>
						Continue Shopping
					</button>
					<button
                    onClick={() => navigate("/Checkout")}
						className="bg-[#330577] text-white py-2 px-6 rounded hover:bg-[#472393]">
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCart;