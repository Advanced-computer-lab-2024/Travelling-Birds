import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { FaPlaneArrival, FaPlaneDeparture, FaRegClock, FaRegMoneyBillAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function FlightSearchPage() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [departureDate, setDepartureDate] = useState("");
	const [flights, setFlights] = useState([]);
	const currencyCode = sessionStorage.getItem('currency');
	const navigate = useNavigate();

	// Joyride state
	const [runTour, setRunTour] = useState(false); // Default is false
	const steps = [
		{
			target: '.search-bar',
			content: 'Enter your origin, destination, and departure date here to search for flights.',
			placement: 'bottom',
		},
		{
			target: '.search-button',
			content: 'Click this button to start searching for available flights.',
			placement: 'left',
		},
		{
			target: '.flight-listings',
			content: 'Here you can view the list of available flights based on your search criteria.',
			placement: 'top',
		},
		{
			target: '.view-deal-button',
			content: 'Click "View Deal" to see more details and proceed to book the flight.',
			placement: 'left',
		},
	];

	// Fetch flights data from the API
	const fetchFlights = async () => {
		const apiUrl = `${process.env.REACT_APP_BACKEND}/api/flights/f`;
		try {
			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ origin, destination, departureDate, currencyCode }),
			});
			const flightsData = await res.json();
			setFlights(extractFlightInfo(flightsData));
		} catch (err) {
			console.error('Error fetching flights', err);
		}
	};

	const handleSearch = async () => {
		await fetchFlights();
	};

	// Extract flight information
	function extractFlightInfo(flightOffers) {
		return flightOffers.map((flight) => ({
			id: flight.id,
			price: flight.price.grandTotal,
			currency: flight.price.currency,
			itineraries: flight.itineraries.map((itinerary) => ({
				segments: itinerary.segments.map((segment) => ({
					departureIataCode: segment.departure.iataCode,
					arrivalIataCode: segment.arrival.iataCode,
					duration: segment.duration,
					numberOfStops: segment.numberOfStops,
				})),
			})),
		}));
	}

	// Format flight duration
	function formatDuration(duration) {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match[1] ? match[1].replace('H', '') : '0';
		const minutes = match[2] ? match[2].replace('M', '') : '0';
		return `${hours}h ${minutes}m`;
	}

	// Check and set walkthrough session flag
	useEffect(() => {
		const hasSeenWalkthrough = sessionStorage.getItem('walkthrough.flights');
		if (hasSeenWalkthrough === "false" || hasSeenWalkthrough === null) {
			setRunTour(true); // Start Joyride walkthrough
			sessionStorage.setItem('walkthrough.flights', 'true'); // Set flag
		}
	}, []);

	return (
		<div className="bg-gray-100 min-h-screen w-full p-8">
			{/* Joyride Walkthrough */}
			<Joyride
				steps={steps}
				run={runTour}
				continuous={true}
				showSkipButton={true}
				styles={{
					options: {
						arrowColor: '#fff',
						backgroundColor: '#333',
						overlayColor: 'rgba(0, 0, 0, 0.5)',
						textColor: '#fff',
						zIndex: 1000,
					},
				}}
			/>

			{/* Search Bar */}
			<div className="search-bar flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md mb-8">
				<h1 className="text-3xl font-bold text-[#330577] mb-4 md:mb-0 md:mr-4">Search Flights</h1>
				<div className="flex flex-col mb-4 md:mb-0 md:mr-4">
					<label className="text-gray-600">From</label>
					<input
						type="text"
						placeholder="Origin (e.g., CAI)"
						value={origin}
						onChange={(e) => setOrigin(e.target.value)}
						className="border-b-2 focus:border-[#330577] p-2 outline-none transition"
					/>
				</div>
				<FaPlaneDeparture className="text-gray-500 hidden md:inline-block mx-2" size={24} />
				<div className="flex flex-col mb-4 md:mb-0 md:mr-4">
					<label className="text-gray-600">To</label>
					<input
						type="text"
						placeholder="Destination (e.g., DXB)"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						className="border-b-2 focus:border-[#330577] p-2 outline-none transition"
					/>
				</div>
				<FaPlaneArrival className="text-gray-500 hidden md:inline-block mx-2" size={24} />
				<div className="flex flex-col mb-4 md:mb-0 md:mr-4">
					<label className="text-gray-600">On</label>
					<input
						type="date"
						value={departureDate}
						onChange={(e) => setDepartureDate(e.target.value)}
						className="border-b-2 focus:border-[#330577] p-2 outline-none transition"
					/>
				</div>
				<button
					onClick={handleSearch}
					className="search-button bg-[#330577] hover:bg-[#27045c] text-white px-6 py-3 rounded-lg ml-4 transition duration-300"
				>
					Search
				</button>
			</div>

			{/* Flight Listings */}
			<section className="flight-listings w-full bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-[#330577] mb-6">
					{flights.length > 0
						? `Flight From ${flights[0]?.itineraries[0].segments[0].departureIataCode} to ${flights[0]?.itineraries[0].segments[flights[0]?.itineraries[0].segments.length - 1].arrivalIataCode}`
						: 'Available Flights'}
				</h2>
				{flights?.length > 0 ? (
					flights.map((flight) => (
						<div
							key={flight.id}
							className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
						>
							<div className="flex items-center mb-4 md:mb-0">
								<div>
									<h3 className="font-semibold text-[#330577]">
										{flight.itineraries[0].segments[0].departureIataCode} - {flight.itineraries[0].segments[0].arrivalIataCode}
									</h3>
									<p className="text-gray-600 mt-1 flex items-center">
										<FaRegClock className="mr-2" />
										{formatDuration(flight.itineraries[0].segments[0].duration)} • {flight.itineraries[0].segments[0].numberOfStops} stop(s)
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-xl font-bold text-gray-800 flex items-center justify-end">
									<FaRegMoneyBillAlt className="mr-1" /> {flight.price} {flight.currency}
								</p>
								<button
									onClick={() => navigate(`/flights/${flight.id}/${origin}/${destination}/${departureDate}`)}
									className="view-deal-button mt-2 bg-[#FFC107] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#e6a700]"
								>
									View Deal
								</button>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-gray-600">No flights found. Try a different search.</p>
				)}
			</section>
		</div>
	);
}

export default FlightSearchPage;