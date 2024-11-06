import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from "react-toastify";

function FlightDetails() {
	const {flightId} = useParams();
	const {origin, destination, departureDate} = useParams();
	const [flightDetails, setFlightDetails] = useState(null);
	const [loading, setLoading] = useState(true);
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

	const setTest = () => {
		setTravelerInfo({
			firstName: "PAUL",
			lastName: "SMITH",
			dateOfBirth: "2024-11-20",
			gender: "MALE",
			emailAddress: "PAULSMITH@OUTLOOK.COM",
			phone: "1234567890",
			passportNumber: "1234567890",
			passportExpiry: "2026-11-21",
			birthPlace: "FRANCE",
			issuanceLocation: "FRANCE",
			issuanceDate: "2024-11-22",
			issuanceCountry: "FR",
			validityCountry: "FR",
			nationality: "FR"
		});
	}

	useEffect(() => {
		async function fetchFlight() {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/${flightId}/${origin}/${destination}/${departureDate}`, {
					method: 'GET',
					headers: {'Content-Type': 'application/json'}
				});
				if (!response.ok) {
					throw new Error('Failed to fetch flight details');
				}
				const data = await response.json();
				setFlightDetails(data.flightOffers[0]);
			} catch (error) {
				console.error('Error fetching flight details:', error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchFlight().then(r => r);
	}, [flightId]);

// Handle booking submission
	const handleBookingSubmit = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/book`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					flightDetails,
					travelerDetails: [
						{
							id: "1",
							dateOfBirth: travelerInfo.dateOfBirth,
							name: {firstName: travelerInfo.firstName, lastName: travelerInfo.lastName},
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
				toast.success('Booking confirmed!');
				console.log('Booking Data:', bookingData);
			} else {
				toast.error('Booking failed. Please try again.');
				console.error('Booking Error:', bookingData);
			}
		} catch (error) {
			console.error('Error booking flightDetails:', error);
			alert('Booking failed. Please try again.');
		}
	};

// Update traveler info on form change
	const handleChange = (e) => {
		const {name, value} = e.target;
		setTravelerInfo((prevInfo) => ({...prevInfo, [name]: value}));
		console.log(travelerInfo);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="min-h-screen w-full bg-gray-100 p-8">
			<div className="mb-6">
				<h2 className="text-3xl text-[#330577] font-bold mb-4">Flight Details</h2>
			</div>

			{/* Flight Information Card */}
			<div className="bg-white shadow rounded-lg p-6 mb-6 card">
				<h3 className="text-xl font-bold mb-4 text-primary">
					{flightDetails.itineraries[0].segments[0].carrierCode} Flight {flightDetails.itineraries[0].segments[0].number}
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">From</span>
						<span
							className="badge badge-outline badge-primary">{flightDetails.itineraries[0].segments[0].departure.iataCode}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">To</span>
						<span
							className="badge badge-outline badge-secondary">{flightDetails.itineraries[0].segments[0].arrival.iataCode}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Departure</span>
						<span>{new Date(flightDetails.itineraries[0].segments[0].departure.at).toLocaleString()}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Arrival</span>
						<span>{new Date(flightDetails.itineraries[0].segments[0].arrival.at).toLocaleString()}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Duration</span>
						<span>{flightDetails.itineraries[0].segments[0].duration}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Price</span>
						<span>{flightDetails.price.grandTotal} {flightDetails.price.currency}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Last Ticketing Date</span>
						<span>{flightDetails.lastTicketingDate}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-gray-500">Validating Airline</span>
						<span>{flightDetails.validatingAirlineCodes.join(', ')}</span>
					</div>
				</div>
			</div>

			{/* Segment Information Card */}
			<div className="bg-white shadow rounded-lg p-6 card">
				<h3 className="text-xl font-bold mb-4 text-primary">Segments</h3>
				<div className="space-y-4">
					{flightDetails.itineraries[0].segments.map((segment, index) => (
						<div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
							<h4 className="font-semibold mb-2 text-secondary">Segment {index + 1}</h4>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Carrier</span>
									<span>{segment.carrierCode}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Flight Number</span>
									<span>{segment.number}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Departure</span>
									<span>{segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Arrival</span>
									<span>{segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Duration</span>
									<span>{segment.duration}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Aircraft</span>
									<span>{segment.aircraft.code}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">Number of Stops</span>
									<span>{segment.numberOfStops}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium text-gray-500">CO2 Emissions</span>
									<span>{segment.co2Emissions[0].weight} {segment.co2Emissions[0].weightUnit}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Traveler Information Form */}
			{
				showBookingForm ? (
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
								name="gender"
								placeholder="gender"
								value={travelerInfo.gender}
								onChange={handleChange}
								className="p-2 rounded border"
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
								name="nationality"
								placeholder="Nationality"
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
						<button className='mt-4 bg-[#330577] text-white px-4 py-2 rounded ml-4' onClick={setTest}>
							Set Test
						</button>
					</div>
				) : (
					<button
						className="mt-6 bg-[#330577] text-white px-4 py-2 rounded"
						onClick={() => setShowBookingForm(true)}
					>
						Book This Flight
					</button>
				)
			}
		</div>
	)
		;
}

export default FlightDetails;
