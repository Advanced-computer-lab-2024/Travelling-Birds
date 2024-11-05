import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';

function FlightSearchPage() {
	const flights = [
		{
			airline: "Air Cairo",
			departTime: "11:00 AM",
			arriveTime: "2:00 PM",
			duration: "4h 0m",
			price: "$296",
			stops: "Nonstop",
			deals: "6 deals",
		},
		{
			airline: "Alitalia",
			departTime: "9:55 PM",
			arriveTime: "2:10 AM",
			duration: "3h 15m",
			price: "$300",
			stops: "Nonstop",
			deals: "6 deals",
		},
		// Add more flights here...
	];

	return (
		<div>
			<section className="px-4 py-10 bg-gray-100 h-screen w-full">
				<div className="container-xl lg:container m-auto">
			{/* Sidebar Filters */}
			{/* Main Content for Flight Listings */}
			<main className="w-3/4 p-6">
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
				{flights.map((flight, index) => (
					<div key={index} className="flex items-center justify-between p-4 mb-4 border rounded-lg shadow-md bg-white">
						<div className="flex items-center">
							<img src={`airline-logos/${flight.airline.toLowerCase()}.png`} alt={flight.airline} className="w-12 h-12 mr-4" />
							<div>
								<h3 className="font-semibold text-[#330577] flex items-center">
									<FaPlaneDeparture className="mr-2" /> {flight.departTime}
									<span className="mx-2">-</span>
									<FaPlaneArrival className="mr-2" /> {flight.arriveTime}
								</h3>
								<p className="text-gray-600">{flight.duration} • {flight.stops}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-xl font-bold text-gray-800">{flight.price}</p>
							<p className="text-sm text-gray-500">{flight.deals}</p>
							<button className="mt-2 bg-[#FFC107] text-white px-3 py-1 rounded-lg">View Deal</button>
						</div>
					</div>
				))}
			</main>
				</div>
			</section>
		</div>
	);
}

export default FlightSearchPage;
