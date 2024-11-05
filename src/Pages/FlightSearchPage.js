import React, {useEffect, useState} from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaRegClock, FaRegMoneyBillAlt } from 'react-icons/fa';

function FlightSearchPage() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [departureDate, setDepartureDate] = useState("");
	const [flights, setFlights] = useState([]);
		const fetchFlights = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/flights/f`;
			try {
				const res = await fetch(apiUrl);
				const flightsData = await res.json();
				setFlights(extractFlightInfo(flightsData)); // parse flights immediately after fetching
			} catch (err) {
				console.log('Error fetching flights', err);
			}
		}
	const handleSearch = async () => {
		const flights = await fetchFlights(origin, destination , departureDate);
		setFlights(flights);
	};

	// Function to parse and extract necessary flight information
	function extractFlightInfo(flightData) {
		return flightData.map(flight => ({
			id: flight.id,
			originDestinationId: flight.originDestinationId,
			duration: flight.duration,
			segments: flight.segments.map(segment => ({
				departureIataCode: segment.departure.iataCode,
				departureTime: segment.departure.at,
				arrivalIataCode: segment.arrival.iataCode,
				arrivalTime: segment.arrival.at,
				carrierCode: segment.carrierCode,
				flightNumber: segment.number,
				numberOfStops: segment.numberOfStops,
				aircraftCode: segment.aircraft.code,
				availabilityClasses: segment.availabilityClasses.map(availClass => ({
					class: availClass.class,
					numberOfBookableSeats: availClass.numberOfBookableSeats
				}))
			})),
		}));
	}
	function formatDuration(duration) {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match[1] ? match[1].replace('H', '') : '0';
		const minutes = match[2] ? match[2].replace('M', '') : '0';
		return `${hours}h ${minutes}m`;
	}

	return (
		<div className="bg-gray-100 min-h-screen w-full">

			{/* Search Bar */}
			<div className="flex space-x-4 items-center bg-white p-4 rounded-lg shadow-md mb-6">
				<h1 className="text-2xl font-bold mb-6">Search Flights</h1>
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
						type="text"
						placeholder="Departure Date"
						value={departureDate}
						onChange={(e) =>setDepartureDate(e.target.value)}
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
				{/* Sidebar Filters */}
				<aside className="w-1/4 pr-4">
					<h2 className="text-lg font-semibold text-[#330577] mb-4">Filters</h2>
					<div className="mb-4">
						<label className="block text-gray-600 mb-2">Price Range</label>
						<input type="range" min="50" max="500" className="w-full" />
					</div>
					<div className="mb-4">
						<label className="block text-gray-600 mb-2">Airlines</label>
						<select className="w-full border rounded p-2">
							<option>Any Airline</option>
							{/* Add specific airline options here */}
						</select>
					</div>
				</aside>

				{/* Main Content for Flight Listings */}
				<main className="w-3/4 bg-white p-6 rounded-lg shadow">
					{/* Header Controls */}
					<div className="flex justify-between items-center mb-6">
						<div>
							<h1 className="text-2xl font-bold text-[#330577]">Flights from Cairo to Rome</h1>
							<p className="text-gray-600">1847 flights</p>
						</div>
						<button className="bg-[#330577] text-white px-4 py-2 rounded-lg">Search</button>
					</div>

					{/* Sort Options */}
					<div className="flex items-center mb-4">
						<label className="text-gray-600 mr-2">Sort by:</label>
						<select className="border rounded px-3 py-1">
							<option>Best Value</option>
							<option>Lowest Price</option>
							<option>Shortest Duration</option>
						</select>
					</div>

					{/* Flight Listings */}
					{flights.length > 0 ? (
						flights.map((flight, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 mb-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition"
							>
								<div className="flex items-center">
									<img
										src={`airline-logos/${flight.segments[0].carrierCode?.toLowerCase()}.png`}
										className="w-12 h-12 mr-4"
										alt={`${flight.segments[0].carrierCode} logo`}
									/>
									<div>
										<h3 className="font-semibold text-[#330577] flex items-center">
											<FaPlaneDeparture className="mr-2" /> {new Date(flight.segments[0].departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											<span className="mx-2">-</span>
											<FaPlaneArrival className="mr-2" /> {new Date(flight.segments[0].arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</h3>
										<p className="text-gray-600 flex items-center mt-1">
											<p className="text-gray-600 flex items-center mt-1">
												<FaRegClock className="mr-2" /> {formatDuration(flight.duration)} • {flight.segments[0].numberOfStops} stops
											</p>

										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xl font-bold text-gray-800 flex items-center">
										<FaRegMoneyBillAlt className="mr-1" /> {flight.price}
									</p>
									<p className="text-sm text-gray-500">{flight.deals}</p>
									<button className="mt-2 bg-[#FFC107] text-white px-3 py-1 rounded-lg">View Deal</button>
								</div>
							</div>
						))
					) : (
						<p>Loading flights...</p>
					)}
				</main>
			</section>
		</div>
	);
}

export default FlightSearchPage;
