import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCheckout = () => {
	const [cart, setCart] = useState([]);
	const [defaultAddress, setDefaultAddress] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
	const userId = sessionStorage.getItem('user id');
	const userRole = sessionStorage.getItem('role');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchProductCart = async () => {
		try {
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
					};
				});
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

	const fetchDefaultAddress = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/address/${userId}/default`);

			if (!response.ok) {
				throw new Error('Failed to fetch default address');
			}

			const data = await response.json();
			setDefaultAddress(data.addresses[0]);
		} catch (error) {
			console.error('Error fetching address:', error);
			toast.error('An error occurred while fetching the address');
		}
	};

	const placeOrder = async () => {
		if (!defaultAddress) {
			toast.error('Please select a shipping address.');
			return;
		}

		try {
			// Parallel API calls for all cart items
			const purchasePromises = cart.map((product) => {
				const purchaseData = {
					productId: product._id,
					quantity:1,
					itemPrice: product.price,
					discount: 0,
				};

				return fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-purchase/${userId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(purchaseData),
				});
			});

			const results = await Promise.all(purchasePromises);

			// Check for failed requests
			const failedRequests = results.filter((res) => !res.ok);
			if (failedRequests.length > 0) {
				toast.error('Some items could not be purchased. Please try again.');
			} else {
				toast.success('Order placed successfully!');
			}

			// Clear cart after purchase
			await Promise.all(
				cart.map((product) =>
					fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-cart/${userId}`, {
						method: 'DELETE',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ productId: product._id }),
					})
				)
			);

			navigate('/my-purchases');
		} catch (error) {
			console.error('Error placing order:', error);
			toast.error('An unexpected error occurred. Please try again.');
		}
	};



	useEffect(() => {
		if (userRole === 'tourist') {
			fetchProductCart();
			fetchDefaultAddress();
		}
	}, [userId, userRole]);

	const totalPrice = cart.reduce((total, product) => total + product.price, 0);

	if (loading) {
		return (
			<div className="text-[#330577] p-6">
				<h1 className="text-3xl font-bold mb-6"> Checkout </h1>
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="text-[#330577] p-6 bg-gray-100 min-h-screen">
			<h2 className="text-4xl font-extrabold mb-4 text-center">CheckOut</h2>

			{/* Shipping Address */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h1 className="text-2xl font-bold mb-4">Shipping Address</h1>
				{defaultAddress ? (
					<ul>
						<li key={defaultAddress._id} className="border-b pb-4 mb-4">
							{defaultAddress.isDefault && (
								<span className="text-green-500 font-bold">Default Address</span>
							)}
							<p><strong>{defaultAddress.street}, {defaultAddress.city}, {defaultAddress.country}</strong></p>
							<p>{defaultAddress.type} - Postal Code: {defaultAddress.postalCode}</p>
							<p>Floor: {defaultAddress.floorNumber} - Apartment: {defaultAddress.apartmentNumber}</p>
						</li>
					</ul>
				) : (
					<div>Loading your address...</div>
				)}
			</div>

			{/* Cart Items */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h1 className="text-2xl font-bold mb-4">My Cart</h1>
				{cart.map((product) => (
					<div key={product._id} className="border-b pb-4 mb-4 flex items-center">
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
						<p className="text-lg font-bold">EGP {product.price}</p>
					</div>
				))}
			</div>

			{/* Payment Methods */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-2xl font-bold mb-4">Payment method</h2>
				<div className="mb-6">
					<label className="flex items-center gap-2">
						<input type="radio" name="paymentMethod" value="wallet" />
						Pay by wallet
					</label>
					<p className="text-sm mt-1">The amount will be subtracted from your wallet.</p>
				</div>
				<div className="mb-6">
					<label className="flex items-center gap-2">
						<input type="radio" name="paymentMethod" value="Card" />
						Pay By Card
					</label>
					<p className="text-sm mt-1">Using Stripe</p>
				</div>
				<div className="mb-6">
					<label className="flex items-center gap-2">
						<input type="radio" name="paymentMethod" value="cash" />
						Cash on Delivery (COD)
					</label>
					<p className="text-sm mt-1">Pay by cash on delivery.</p>
				</div>
			</div>

			{/* Place Order Button */}
			<div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Total Price: EGP {totalPrice}</h2>
				<button
					onClick={placeOrder}
					className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
				>
					Place Order
				</button>
			</div>
		</div>
	);
};

export default ProductCheckout;
