import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function FlightDetails() {
	const { flightId } = useParams();
	const [flight, setFlight] = useState(null);

	useEffect(() => {
		async function fetchFlight() {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/flights/${flightId}`);
			const data = await response.json();
			setFlight(data);
			console.log('Flight Details:', data);
		}
		fetchFlight();
	}, [flightId]);
	function formatDuration(duration) {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match[1] ? match[1].replace('H', '') : '0';
		const minutes = match[2] ? match[2].replace('M', '') : '0';
		return `${hours}h ${minutes}m`;
	}

	if (!flight) return <p>Loading...</p>;
	const handleBooking = (flight) => {
		console.log('Booking flight:', flight);

	}

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-bold mb-4">Flight Details</h2>

			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-xl font-semibold mb-2">{flight.segments[0].carrierCode} Flight {flight.segments[0].flightNumber}</h3>
				<p>From: {flight.segments[0].departure.iataCode}</p>
				<p>To: {flight.segments[0].arrival.iataCode}</p>
				<p>Departure: {new Date(flight.segments[0].departure.at).toLocaleString()}</p>
				<p>Arrival: {new Date(flight.segments[0].arrival.at).toLocaleString()}</p>
				<p>Duration: {formatDuration(flight.duration)}</p>
				<p>Price: {flight.price.grandTotal} {flight.price.currency}</p>
			</div>

			{/* Display additional details for each segment */}
			{flight.segments.map((segment, index) => (
				<div key={index} className="my-4 p-4 bg-gray-100 rounded">
					<h4 className="font-semibold">Segment {index + 1}</h4>
					<p>Airline: {segment.carrierCode}</p>
					<p>Flight Number: {segment.number}</p>
					<p>Departure: {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
					<p>Arrival: {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
					<p>Duration: {formatDuration(segment.duration)}</p>
				</div>
			))}

			{/* Booking Button */}
			<button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleBooking(flight)}>
				Book This Flight
			</button>
		</div>
	);
}

export default FlightDetails;
