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
			birthPlace: "CAIRO",
			dateOfBirth: "2004-02-18",
			emailAddress: "alyserry@outlook.com",
			firstName: "Aly",
			gender: "MALE",
			issuanceCountry: "EG",
			issuanceDate: "2015-04-14",
			issuanceLocation: "CAIRO",
			lastName: "Serry",
			nationality: "EG",
			passportExpiry: "2025-04-14",
			passportNumber: "00000000",
			phone: "+201018833175",
			validityCountry: "EG"
		});
	}

	useEffect(() => {
		async function fetchFlight() {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/${flightId}/${origin}/${destination}/${departureDate}/${sessionStorage.getItem('currency') || 'EGP'}`, {
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
	}, [flightId, origin, destination, departureDate]);

// Handle booking submission
	const handleBookingSubmit = async () => {
		try {
			if (new Date().getFullYear() - new Date(travelerInfo.dateOfBirth).getFullYear() < 18) {
				toast.error('Traveler must be at least 18 years old.');
				return;
			}

			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/book`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					flightDetails,
					travelerInfo:
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
				})
			});
			const bookingData = await response.json();
			if (response.ok) {
				toast.success('Booking confirmed!');
			} else {
				toast.error('Booking failed. Please try again.');
				console.error('Booking Error:', bookingData);
			}
		} catch (error) {
			console.error('Error booking flightDetails:', error);
			alert('Booking failed. Please try again.');
		}
	};

	const handleChange = (e) => {
		const {name, value} = e.target;
		setTravelerInfo((prevInfo) => ({...prevInfo, [name]: value}));
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
							{[
								{label: 'First Name', name: 'firstName', type: 'text'},
								{label: 'Last Name', name: 'lastName', type: 'text'},
								{label: 'Date of Birth', name: 'dateOfBirth', type: 'date'},
								{label: 'Gender', name: 'gender', type: 'text'},
								{label: 'Email Address', name: 'emailAddress', type: 'email'},
								{label: 'Phone Number', name: 'phone', type: 'text'},
								{label: 'Passport Number', name: 'passportNumber', type: 'text'},
								{label: 'Passport Expiry', name: 'passportExpiry', type: 'date'},
								{label: 'Birth Place', name: 'birthPlace', type: 'text'},
								{label: 'Issuance Location', name: 'issuanceLocation', type: 'text'},
								{label: 'Issuance Date', name: 'issuanceDate', type: 'date'},
								{label: 'Issuance Country', name: 'issuanceCountry', type: 'text'},
								{label: 'Validity Country', name: 'validityCountry', type: 'text'},
								{label: 'Nationality', name: 'nationality', type: 'text'}
							].map((input) => (
								<div key={input.name} className="form-control">
									<label className="label">
										<span className="label-text">{input.label}</span>
									</label>
									<input
										type={input.type}
										name={input.name}
										placeholder={input.label}
										value={travelerInfo[input.name]}
										onChange={handleChange}
										className="input input-bordered"
									/>
								</div>
							))}
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
