import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function FlightDetails() {
	const { flightId } = useParams();
	const [flight, setFlight] = useState(null);
	const fakeFlight = {
		id: '1',
		price: { grandTotal: 100, currency: 'USD' },
		duration: 'PT5H30M',
		segments: [
			{
				departure: { iataCode: 'JFK', at: '2021-08-01T08:00:00' },
				arrival: { iataCode: 'LAX', at: '2021-08-01T11:30:00' },
				carrierCode: 'AA',
				flightNumber: '123',
				duration: 'PT5H30M'
			}
		]
	};
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [travelerInfo, setTravelerInfo] = useState({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		gender: '',
		emailAddress: '',
		phone: '',
		passportNumber: '',
		passportExpiry: '',
		birthPlace: '',
		issuanceLocation: '',
		issuanceDate: '',
		issuanceCountry: '',
		validityCountry: '',
		nationality: ''
	});

	useEffect(() => {
		// async function fetchFlight() {
		// 	try {
		// 		const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/${flightId}`);
		// 		if (!response.ok) {
		// 			throw new Error('Failed to fetch flight details');
		// 		}
		// 		const data = await response.json();
		// 		setFlight(fakeFlight);
		// 	} catch (error) {
		// 		console.error('Error fetching flight details:', error);
		// 		setError(error.message);
		// 	} finally {
		// 		setLoading(false);
		// 	}
		// }
		// fetchFlight();
		setFlight(fakeFlight);
	}, [flightId]);

	// Handle booking submission
	const handleBookingSubmit = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/book`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					flightOffer: flight,
					travelerDetails: [
						{
							id: "1",
							dateOfBirth: travelerInfo.dateOfBirth,
							name: { firstName: travelerInfo.firstName, lastName: travelerInfo.lastName },
							gender: travelerInfo.gender,
							contact: {
								emailAddress: travelerInfo.emailAddress,
								phones: [
									{
										deviceType: "MOBILE",
										countryCallingCode: "1",
										number: travelerInfo.phone
									}
								]
							},
							documents: [
								{
									documentType: "PASSPORT",
									birthPlace: travelerInfo.birthPlace,
									issuanceLocation: travelerInfo.issuanceLocation,
									issuanceDate: travelerInfo.issuanceDate,
									number: travelerInfo.passportNumber,
									expiryDate: travelerInfo.passportExpiry,
									issuanceCountry: travelerInfo.issuanceCountry,
									validityCountry: travelerInfo.validityCountry,
									nationality: travelerInfo.nationality,
									holder: true
								}
							]
						}
					]
				})
			});
			const bookingData = await response.json();
			if (response.ok) {
				alert('Booking confirmed!');
				console.log('Booking Data:', bookingData);
			} else {
				alert('Booking failed. Please try again.');
				console.error('Booking Error:', bookingData);
			}
		} catch (error) {
			console.error('Error booking flight:', error);
			alert('Booking failed. Please try again.');
		}
	};

	// Update traveler info on form change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setTravelerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="bg-gray-100 min-h-screen w-full p-8">
			<h2 className="text-3xl text-[#330577] font-bold mb-4">Flight Details</h2>

			{/* Flight Information */}
			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-xl font-semibold mb-2">
					{flight?.segments[0].carrierCode} Flight {flight?.segments[0].flightNumber}
				</h3>
				<p>From: {flight?.segments[0].departure.iataCode}</p>
				<p>To: {flight?.segments[0].arrival.iataCode}</p>
				<p>Departure: {new Date(flight?.segments[0].departure.at).toLocaleString()}</p>
				<p>Arrival: {new Date(flight?.segments[0].arrival.at).toLocaleString()}</p>
				<p>Duration: {flight?.duration}</p>
				<p>Price: {flight?.price?.grandTotal} {flight?.price?.currency}</p>
			</div>

			{/* Booking Form */}
			{showBookingForm ? (
				<div className="my-4 p-4 bg-white rounded">
					<h4 className="font-semibold text-xl text-[#330577]  mb-4">Enter Traveler Information</h4>
					<div className="grid grid-cols-2 gap-4">
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							value={travelerInfo.firstName}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="lastName"
							placeholder="Last Name"
							value={travelerInfo.lastName}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="date"
							name="dateOfBirth"
							placeholder="Date of Birth"
							value={travelerInfo.dateOfBirth}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name = "gender"
							placeholder = "gender"
							value = {travelerInfo.gender}
							onChange = {handleChange}
							className = "p-2 rounded border"
						/>
						<input
							type="email"
							name="emailAddress"
							placeholder="Email Address"
							value={travelerInfo.emailAddress}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="phone"
							placeholder="Phone Number"
							value={travelerInfo.phone}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="passportNumber"
							placeholder="Passport Number"
							value={travelerInfo.passportNumber}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="date"
							name="passportExpiry"
							placeholder="Passport Expiry"
							value={travelerInfo.passportExpiry}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="birthPlace"
							placeholder="Birth Place"
							value={travelerInfo.birthPlace}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="issuanceLocation"
							placeholder="Issuance Location"
							value={travelerInfo.issuanceLocation}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="date"
							name="issuanceDate"
							placeholder="Issuance Date"
							value={travelerInfo.issuanceDate}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="issuanceCountry"
							placeholder="Issuance Country"
							value={travelerInfo.issuanceCountry}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name="validityCountry"
							placeholder="Validity Country"
							value={travelerInfo.validityCountry}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
						<input
							type="text"
							name = "nationality"
							placeholder = "Nationality"
							value={travelerInfo.nationality}
							onChange={handleChange}
							className="p-2 rounded border"
						/>
					</div>
					<button
						className="mt-4 bg-[#330577] text-white px-4 py-2 rounded"
						onClick={handleBookingSubmit}
					>
						Confirm Booking
					</button>
					<button
						className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-4"
						onClick={() => setShowBookingForm(false)}
						>
						Cancel
					</button>
				</div>
			) : (
				<button
					className="mt-6 bg-[#330577] text-white px-4 py-2 rounded"
					onClick={() => setShowBookingForm(true)}
				>
					Book This Flight
				</button>
			)}
		</div>
	);
}

export default FlightDetails;
