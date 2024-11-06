import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaRegClock, FaRegMoneyBillAlt } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";
import md5 from "md5";
function FlightSearchPage() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [departureDate, setDepartureDate] = useState("");
	const [flights, setFlights] = useState([]);
	const navigate = useNavigate();
	const generateHash = (airlineCode) => {
		const url = airlineCode + "_s_" + process.env.REACT_APP_AIRHEX_API_KEY;
		console.log(url);
		return md5(url);
	}
	const fetchFlights = async () => {
		const apiUrl = `${process.env.REACT_APP_BACKEND}/api/flights/f`;
		try {
			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ origin, destination, departureDate })
			});
			const flightsData = await res.json();
			setFlights(extractFlightInfo(flightsData));
			console.log('Flights:', flights);
		} catch (err) {
			console.log('Error fetching flights', err);
		}
	};

	const handleSearch = async () => {
		await fetchFlights();
	};

	// Function to parse and extract necessary flight information
	function extractFlightInfo(flightOffers) {
		return flightOffers.map(flight => ({
			id: flight.id,
			price: flight.price.grandTotal,
			currency: flight.price.currency,
			numberOfBookableSeats: flight.numberOfBookableSeats,
			lastTicketingDate: flight.lastTicketingDate,
			itineraries: flight.itineraries.map(itinerary => ({
				duration: itinerary.duration,
				segments: itinerary.segments.map(segment => ({
					departureIataCode: segment.departure.iataCode,
					departureTerminal: segment.departure.terminal,
					departureTime: segment.departure.at,
					arrivalIataCode: segment.arrival.iataCode,
					arrivalTerminal: segment.arrival.terminal,
					arrivalTime: segment.arrival.at,
					carrierCode: segment.carrierCode,
					flightNumber: segment.number,
					numberOfStops: segment.numberOfStops,
					duration: segment.duration,
					aircraftCode: segment.aircraft.code,
					blacklistedInEU: segment.blacklistedInEU
				}))
			})),
			travelerPricings: flight.travelerPricings.map(traveler => ({
				travelerType: traveler.travelerType,
				price: {
					total: traveler.price.total,
					base: traveler.price.base,
					currency: traveler.price.currency
				},
				fareDetailsBySegment: traveler.fareDetailsBySegment.map(fareDetail => ({
					segmentId: fareDetail.segmentId,
					cabin: fareDetail.cabin,
					brandedFare: fareDetail.brandedFare,
					brandedFareLabel: fareDetail.brandedFareLabel,
					class: fareDetail.class,
					includedCheckedBags: fareDetail.includedCheckedBags?.quantity
				}))
			}))
		}));
	}

	function formatDuration(duration) {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match[1] ? match[1].replace('H', '') : '0';
		const minutes = match[2] ? match[2].replace('M', '') : '0';
		return `${hours}h ${minutes}m`;
	}

	return (
		<div className="bg-gray-100 min-h-screen w-full p-8">
			{process.env.REACT_APP_AIRHEX_API_KEY}
			{generateHash("SU")}
			{/* Search Bar */}
			<div className="flex space-x-4 items-center bg-white p-6 rounded-lg shadow-md mb-8">
				<h1 className="text-2xl font-bold">Search Flights</h1>
				<div className="flex flex-col">
					<label className="text-gray-600">From</label>
					<input
						type="text"
						placeholder="Origin (e.g., CAI)"
						value={origin}
						onChange={(e) => setOrigin(e.target.value)}
						className="border-b-2 focus:border-blue-500 p-2 outline-none"
					/>
				</div>
				<FaPlaneDeparture className="text-gray-500" />
				<div className="flex flex-col">
					<label className="text-gray-600">To</label>
					<input
						type="text"
						placeholder="Destination (e.g., DXB)"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						className="border-b-2 focus:border-blue-500 p-2 outline-none"
					/>
				</div>
				<FaPlaneArrival className="text-gray-500" />
				<div className="flex flex-col">
					<label className="text-gray-600">On</label>
					<input
						type="date"
						value={departureDate}
						onChange={(e) => setDepartureDate(e.target.value)}
						className="border-b-2 focus:border-blue-500 p-2 outline-none"
					/>
				</div>
				<button
					onClick={handleSearch}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4 hover:bg-blue-600"
				>
					Search
				</button>
			</div>

			<section className="container mx-auto px-4 py-10 flex">
				{/* Main Content for Flight Listings */}
				<main className="w-full bg-white p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-[#330577] mb-6">Flight From {flights[0]?.itineraries[0].segments[0].departureIataCode} to {flights[0]?.itineraries[0].segments[flights[0]?.itineraries[0].segments.length-1].arrivalIataCode}</h2>
					{flights?.length > 0 ? (
						flights.map((flight) => (
							<div
								key={flight.id}
								className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition"
							>
								<div className="flex items-center">
									<img
										//src={`https://content.airhex.com/content/logos/airlines_${flight.itineraries[0].segments[0].carrierCode}_s.svg?md5apikey=${generateHash(flight.itineraries[0].segments[0].carrierCode)}`}
										src={require(`../Assets/Square/${flight.itineraries[0].segments[0].carrierCode}.png`)}
										className="w-12 h-12 mr-4"
										alt={`${flight.itineraries[0].segments[0].carrierCode} logo`}
									/>
									<div>
										<h3 className="font-semibold text-[#330577] flex items-center">
											<FaPlaneDeparture className="mr-2" />

											{new Date(flight.itineraries[0].segments[0].departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											<span className="mx-2">-</span>
											<FaPlaneArrival className="mr-2" />
											{new Date(flight.itineraries[0].segments[0].arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</h3>
										<p className="text-gray-600 flex items-center mt-1">
											<FaRegClock className="mr-2" /> {formatDuration(flight.itineraries[0].segments[0].duration)} • {flight.itineraries[0].segments[0].numberOfStops} stops
										</p>
										<p className="text-sm text-gray-500 mt-1">
											CO₂ Emissions: {flight.itineraries[0].segments[0].co2Emissions} {flight.itineraries[0].segments[0].co2Unit}
										</p>
									</div>
								</div>
								<div className="text-right mt-4 md:mt-0">
									<p className="text-xl font-bold text-gray-800 flex items-center">
										<FaRegMoneyBillAlt className="mr-1" /> {flight.price} {flight.currency}
									</p>
									<button onClick={() => navigate(`/flights/${flight.id}`)}
										className="mt-2 bg-[#FFC107] text-white px-3 py-1 rounded-lg">View Deal</button>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-600">Loading flights...</p>
					)}
				</main>
			</section>
		</div>
	);
}

export default FlightSearchPage;
