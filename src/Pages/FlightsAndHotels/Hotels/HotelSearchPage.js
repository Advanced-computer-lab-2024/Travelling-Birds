import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCity, FaInfoCircle, FaUser } from 'react-icons/fa';

function HotelSearchPage() {
	const [hotels, setHotels] = useState([]);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		cityCode: '',
		checkInDate: '',
		checkOutDate: '',
		adults: 1,
		currencyCode: sessionStorage.getItem('currency') || 'EGP',
	});

	// Joyride state
	const [runTour, setRunTour] = useState(false); // Default is false
	const steps = [
		{
			target: '.search-form',
			content: 'Fill in the city code, check-in date, check-out date, and the number of adults to search for hotels.',
			placement: 'bottom',
		},
		{
			target: '.search-button',
			content: 'Click this button to search for available hotels.',
			placement: 'left',
		},
		{
			target: '.hotel-listings',
			content: 'Here you can view the list of available hotels based on your search criteria.',
			placement: 'top',
		},
		{
			target: '.view-details-button',
			content: 'Click "View Details" to see more information about the hotel and proceed with booking.',
			placement: 'left',
		},
	];

	// Fetch hotel data from the API
	const handleSearch = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			setHotels(data || []);
		} catch (error) {
			console.error('Error fetching hotels:', error);
		}
	};

	// Check and set walkthrough session flag
	useEffect(() => {
		const hasSeenWalkthrough = sessionStorage.getItem('walkthrough.hotels');
		if (hasSeenWalkthrough === "false" || hasSeenWalkthrough === null) {
			setRunTour(true); // Start Joyride walkthrough
			sessionStorage.setItem('walkthrough.hotels', 'true'); // Set flag
		}
	}, []);

	return (
		<div className="px-4 py-10 bg-gray-100">
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

			<h2 className="text-4xl font-extrabold mb-8 text-center text-[#330577]">Search Hotels</h2>
			<div className="search-form bg-white shadow-md rounded-lg p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div className="form-control">
						<label className="label">
							<span className="label-text">City Code (e.g., CAI)</span>
						</label>
						<div className="relative">
							<FaCity className="absolute left-3 top-3 text-gray-500" />
							<input
								type="text"
								placeholder="City Code (e.g., CAI)"
								className="input input-bordered pl-10 w-full"
								value={formData.cityCode}
								onChange={(e) => setFormData({ ...formData, cityCode: e.target.value })}
							/>
						</div>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Check-In Date</span>
						</label>
						<div className="relative">
							<FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
							<input
								type="date"
								className="input input-bordered pl-10 w-full"
								value={formData.checkInDate}
								onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
							/>
						</div>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Check-Out Date</span>
						</label>
						<div className="relative">
							<FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
							<input
								type="date"
								className="input input-bordered pl-10 w-full"
								value={formData.checkOutDate}
								onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
							/>
						</div>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Adults</span>
						</label>
						<div className="relative">
							<FaUser className="absolute left-3 top-3 text-gray-500" />
							<input
								type="number"
								placeholder="Adults"
								className="input input-bordered pl-10 w-full"
								min="1"
								value={formData.adults}
								onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
							/>
						</div>
					</div>
				</div>
				<button
					className="search-button bg-[#330577] hover:bg-[#27045c] text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
					onClick={handleSearch}
				>
					Search
				</button>
			</div>

			{hotels.length > 0 ? (
				<div className="hotel-listings grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
					{hotels.map((hotel) => (
						<div key={hotel.hotel.hotelId} className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="p-6">
								<h3 className="text-2xl font-bold mb-2 text-[#330577]">{hotel.hotel.name}</h3>
								<p className="text-gray-600 mb-2">Rating: {hotel.hotel.rating || 'N/A'}</p>
								<p className="text-gray-600 mb-2">
									Price: {hotel.offers[0].price.total} {hotel.offers[0].price.currency}
								</p>
								<p className="text-gray-600 mb-4">
									Check-in: {hotel.offers[0].checkInDate} | Check-out: {hotel.offers[0].checkOutDate}
								</p>
								<button
									className="view-details-button bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
									onClick={() =>
										navigate(`/hotels/${hotel.hotel.hotelId}/${hotel.offers[0].checkInDate}/${hotel.offers[0].checkOutDate}`)
									}
								>
									View Details <FaInfoCircle className="inline-block ml-2" />
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center mt-12 text-gray-500">
					{hotels.length === 0 ? 'No hotels found. Try adjusting your search.' : 'Loading...'}
				</div>
			)}
		</div>
	);
}

export default HotelSearchPage;