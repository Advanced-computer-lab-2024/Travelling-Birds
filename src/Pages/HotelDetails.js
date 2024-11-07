import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCreditCard, FaHotel } from 'react-icons/fa';

function HotelDetails() {
	const { hotelId, checkInDate, checkOutDate } = useParams();
	const [hotel, setHotel] = useState(null);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [travelerDetails, setTravelerDetails] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		creditCard: { number: '', expiryDate: '', cvc: '' },
	});

	useEffect(() => {
		async function fetchHotelDetails() {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/${hotelId}/${checkInDate}/${checkOutDate}`);
			const data = await response.json();
			setHotel(data[0]);
		}
		fetchHotelDetails();
	}, [hotelId, checkInDate, checkOutDate]);

	const handleBooking = async () => {
		await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/book`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ hotelId, travelerDetails }),
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTravelerDetails((prev) => {
			if (name.startsWith('creditCard.')) {
				const key = name.replace('creditCard.', '');
				return {
					...prev,
					creditCard: {
						...prev.creditCard,
						[key]: value
					}
				};
			}
			return { ...prev, [name]: value };
		});
	};

	if (!hotel) return <p className="text-center mt-12 text-gray-500">Loading...</p>;

	return (
		<div className="px-4 py-10 bg-gray-100">
			{/* Hotel Details */}
			<div className="bg-white shadow rounded-lg p-6 mb-6">
				<h2 className="text-4xl font-bold mb-4 text-[#330577] flex items-center">
					<FaHotel className="mr-2" /> {hotel?.hotel?.name}
				</h2>
				<p className="text-gray-600 mb-2">Rating: {hotel?.hotel?.rating || 'N/A'}</p>
				<p className="text-gray-600 mb-6">
					{hotel?.offers && hotel.offers[0]?.price ? (
						<>Price: {hotel.offers[0].price.total} {hotel.offers[0].price.currency}</>
					) : (
						'Price information not available'
					)}
				</p>
				<button
					className="bg-[#330577] hover:bg-[#27045c] text-white px-4 py-2 rounded-lg shadow-lg transition duration-300"
					onClick={() => setShowBookingForm(!showBookingForm)}
				>
					{showBookingForm ? 'Close Booking Form' : 'Book This Hotel'}
				</button>
			</div>

			{/* Booking Form */}
			{showBookingForm && (
				<div className="bg-white shadow-md rounded-lg p-6 mt-6">
					<h3 className="text-2xl font-semibold mb-4">Booking Information</h3>
					<div className="grid gap-4">
						<div className="relative">
							<FaUser className="absolute left-3 top-3 text-gray-500" />
							<input
								type="text"
								name="firstName"
								placeholder="First Name"
								className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.firstName}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<FaUser className="absolute left-3 top-3 text-gray-500" />
							<input
								type="text"
								name="lastName"
								placeholder="Last Name"
								className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.lastName}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<FaEnvelope className="absolute left-3 top-3 text-gray-500" />
							<input
								type="email"
								name="email"
								placeholder="Email"
								className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.email}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<FaPhone className="absolute left-3 top-3 text-gray-500" />
							<input
								type="tel"
								name="phone"
								placeholder="Phone"
								className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.phone}
								onChange={handleChange}
							/>
						</div>

						{/* Payment Fields */}
						<div className="relative">
							<FaCreditCard className="absolute left-3 top-3 text-gray-500" />
							<input
								type="text"
								name="creditCard.number"
								placeholder="Credit Card Number"
								className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.creditCard.number}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<input
								type="text"
								name="creditCard.expiryDate"
								placeholder="Expiry Date (MM/YY)"
								className="border rounded-lg p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.creditCard.expiryDate}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<input
								type="text"
								name="creditCard.cvc"
								placeholder="CVC"
								className="border rounded-lg p-2 focus:ring-2 focus:ring-[#330577] w-full"
								value={travelerDetails.creditCard.cvc}
								onChange={handleChange}
							/>
						</div>
					</div>

					<button
						onClick={handleBooking}
						className="bg-[#330577] hover:bg-[#27045c] text-white px-4 py-2 mt-4 rounded-lg shadow-lg transition duration-300"
					>
						Confirm Booking
					</button>
					<button
						className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg ml-4"
						onClick={() => setShowBookingForm(false)}
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	);
}

export default HotelDetails;