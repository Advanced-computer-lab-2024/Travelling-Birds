import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaCity, FaCalendarAlt, FaUser, FaInfoCircle } from 'react-icons/fa';

function HotelSearchPage() {
	const [hotels, setHotels] = useState([]);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		cityCode: '',
		checkInDate: '',
		checkOutDate: '',
		adults: 1,
	});

	const handleSearch = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hotels/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			setHotels(data || []); // Adjusted to account for nested data structure
		} catch (error) {
			console.error('Error fetching hotels:', error);
		}
	};

	return (
		<div className="px-4 py-10 bg-gray-100">
			<h2 className="text-4xl font-extrabold mb-8 text-center text-[#330577]">Search Hotels</h2>
			<div className="bg-white shadow-md rounded-lg p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div className="relative">
						<FaCity className="absolute left-3 top-3 text-gray-500" />
						<input
							type="text"
							placeholder="City Code (e.g., CAI)"
							className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
							value={formData.cityCode}
							onChange={(e) => setFormData({ ...formData, cityCode: e.target.value })}
						/>
					</div>
					<div className="relative">
						<FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
						<input
							type="date"
							className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
							value={formData.checkInDate}
							onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
						/>
					</div>
					<div className="relative">
						<FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
						<input
							type="date"
							className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
							value={formData.checkOutDate}
							onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
						/>
					</div>
					<div className="relative">
						<FaUser className="absolute left-3 top-3 text-gray-500" />
						<input
							type="number"
							placeholder="Adults"
							className="border rounded-lg pl-10 p-2 focus:ring-2 focus:ring-[#330577] w-full"
							min="1"
							value={formData.adults}
							onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
						/>
					</div>
				</div>
				<button
					className="bg-[#330577] hover:bg-[#27045c] text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
					onClick={handleSearch}
				>
					Search
				</button>
			</div>

			{hotels.length > 0 ? (
				<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
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
									className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
									onClick={() => navigate(`/hotels/${hotel.hotel.hotelId}/${hotel.offers[0].checkInDate}/${hotel.offers[0].checkOutDate}`)}
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