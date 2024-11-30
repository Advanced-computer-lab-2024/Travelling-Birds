import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from "react-toastify";

function HotelDetails() {
	const {hotelId, checkInDate, checkOutDate} = useParams();
	const currencyCode = sessionStorage.getItem('currency') || 'EGP';
	const [hotel, setHotel] = useState(null);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [travelerDetails, setTravelerDetails] = useState({
		firstName: '',
		lastName: '',
		email: '',
		dateOfBirth: '',
		phone: '',
		creditCard: {number: '4151289722471370', expiryDate: '2026-08', cvc: ''},
	});

	useEffect(() => {
		async function fetchHotelDetails() {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/${hotelId}/${checkInDate}/${checkOutDate}/${currencyCode}`);
			const data = await response.json();
			setHotel(data[0]);
		}

		fetchHotelDetails();
	}, [hotelId, checkInDate, checkOutDate, currencyCode]);

	const handleBooking = async () => {
		if (new Date().getFullYear() - new Date(travelerDetails.dateOfBirth).getFullYear() < 18) {
			toast.error('You must be 18 years or older to book a hotel.');
			return;
		}
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/book`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({hotelId, travelerDetails, checkInDate, checkOutDate}),
			});
			const data = await response.json();
			if (data.message.includes('successfully')) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error booking hotel:', error);
			toast.error('Failed to book hotel');
		}
	};

	const handleChange = (e) => {
		const {name, value} = e.target;
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
			return {...prev, [name]: value};
		});
	};

	if (!hotel) return <p className="text-center mt-12 text-gray-500">Loading...</p>;

	return (
		<div className="px-4 py-10 bg-gray-100">
			{/* Hotel Details */}
			<div className="bg-white shadow rounded-lg p-6 mb-6">
				<h2 className="text-4xl font-bold mb-4 text-[#330577] flex items-center">
					<i className="fas fa-hotel mr-2"></i> {hotel?.hotel?.name}
				</h2>
				<p className="text-gray-600 mb-2">Rating: {hotel?.hotel?.rating || 'N/A'}</p>
				<p className="text-gray-600 mb-6">
					{hotel?.offers[0]?.price ? (
						<>Price: {hotel.offers[0].price.total} {hotel.offers[0].price.currency}</>
					) : (
						'Price information not available'
					)}
				</p>
				<button
					className="bg-[#330577] hover:bg-[#27045c] text-white px-4 py-2 rounded-lg shadow-lg transition duration-300 flex items-center"
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
							<label className="label">
								<span className="label-text">First Name</span>
							</label>
							<input
								type="text"
								name="firstName"
								placeholder="First Name"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.firstName}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">Last Name</span>
							</label>
							<input
								type="text"
								name="lastName"
								placeholder="Last Name"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.lastName}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								name="email"
								placeholder="Email"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.email}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">Date of Birth</span>
							</label>
							<input
								type="date"
								name="dateOfBirth"
								placeholder="Date of Birth (YYYY-MM-DD)"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.dateOfBirth}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">Phone</span>
							</label>
							<input
								type="tel"
								name="phone"
								placeholder="Phone"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.phone}
								onChange={handleChange}
							/>
						</div>

						{/* Payment Fields */}
						<div className="relative">
							<label className="label">
								<span className="label-text">Credit Card Number</span>
							</label>
							<input
								type="text"
								name="creditCard.number"
								placeholder="Credit Card Number"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.creditCard.number}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">Expiry Date</span>
							</label>
							<input
								type="text"
								name="creditCard.expiryDate"
								placeholder="Expiry Date (YYYY-MM)"
								className="input input-bordered pl-10 w-full"
								value={travelerDetails.creditCard.expiryDate}
								onChange={handleChange}
							/>
						</div>
						<div className="relative">
							<label className="label">
								<span className="label-text">CVC</span>
							</label>
							<input
								type="text"
								name="creditCard.cvc"
								placeholder="CVC"
								className="input input-bordered pl-10 w-full"
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