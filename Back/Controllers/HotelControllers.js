const hotel = require('../Services/amadeusService');

exports.searchHotels = async (req, res) => {
	const { cityCode, checkInDate, checkOutDate, adults } = req.body;
	try {
		const hotelCitySearchResponse = await hotel.referenceData.locations.hotels.byCity.get({
			cityCode: cityCode
		});
		const hotelIds = hotelCitySearchResponse.data.map(hotel => hotel.hotelId).slice(0,50);
		if (hotelIds.length === 0) {
			return res.status(404).json({ message: "No hotels found for the specified city." });
		}
		const hotelOffersResponse = await hotel.shopping.hotelOffersSearch.get({
			hotelIds: hotelIds.join(','),
			checkInDate: checkInDate,
			checkOutDate: checkOutDate,
			adults: adults,
			currencyCode: "EGP"
		});
		res.json(hotelOffersResponse.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description });
	}
};
exports.getHotelDetails = async (req, res) => {
	const {hotelId , checkInDate, checkOutDate, adults} = req.params;
	try {
		const hotelOffersResponse = await hotel.shopping.hotelOffersSearch.get({
			hotelIds: hotelId,
			checkInDate: checkInDate,
			checkOutDate: checkOutDate,
			adults: adults,
			currencyCode: "EGP"
		});
		const rating = await hotel.eReputation.hotelSentiments.get({
			hotelIds: hotelId
		});
		console.log(rating.data);
		res.json(hotelOffersResponse.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description });
	}
}

exports.bookHotel = async (req, res) => {
	const { offerId, travelerDetails } = req.body;

	try {
		const bookingResponse = await hotel.booking.hotelBookings.post({
			data: {
				offerId,
				guests: travelerDetails.map((traveler, index) => ({
					id: (index + 1).toString(),
					name: {
						firstName: traveler.firstName,
						lastName: traveler.lastName,
					},
					contact: {
						phone: traveler.phone,
						email: traveler.emailAddress,
					},
				})),
				paymentMethod: {
					type: "creditCard", // Placeholder; replace with actual payment details
					card: {
						number: travelerDetails[0].creditCard.number,
						expiryDate: travelerDetails[0].creditCard.expiryDate,
						securityCode: travelerDetails[0].creditCard.cvc,
					},
				},
			},
		});

		res.status(200).json({
			message: "Hotel booked successfully!",
			bookingDetails: bookingResponse.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description || "An error occurred during booking." });
	}
};
