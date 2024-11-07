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
		console.log(hotelIds[0]);
		const rating = await hotel.eReputation.hotelSentiments.get({
			hotelIds: hotelIds.slice(0,3).join(','),
		});
		console.log(rating);
		//find hotel with rating by hotelId
		//const hotelOffers = hotelOffersResponse.data.find(hotel => hotel.hotel.rating === rating.data.overallRating);

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
	const {hotelId, travelerDetails, checkInDate, checkOutDate} = req.body;

	try {
		const hotelOffersResponse = await hotel.shopping.hotelOffersSearch.get({
			hotelIds: hotelId,
			checkInDate: checkInDate,
			checkOutDate: checkOutDate,
			adults: 1,
			currencyCode: "EGP"
		});
		const response = await hotel.booking.hotelOrders.post({
			data: {
				type: "hotel-order",
				guests: [
					{
						tid: 1,
						title: "MR",
						firstName: travelerDetails.firstName,
						lastName: travelerDetails.lastName,
						phone: travelerDetails.phone,
						email: travelerDetails.email,
					},
				],
				travelAgent: {
					contact: {
						email: travelerDetails.email,
					},
				},
				roomAssociations: [
					{
						guestReferences: [
							{
								guestReference: "1",
							},
						],
						hotelOfferId: hotelOffersResponse.data[0].offers[0].id,
					},
				],
				payment: {
					method: "CREDIT_CARD",
					paymentCard: {
						paymentCardInfo: {
							vendorCode: "VI",
							cardNumber: travelerDetails.creditCard.number,
							expiryDate: travelerDetails.creditCard.expiryDate,
							holderName: travelerDetails.creditCard.cvc,
						},
					},
				},
			},
		});

		res.status(200).json({
			message: "Hotel booked successfully!",
			bookingDetails: response.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description || "An error occurred during booking." });
	}
};
