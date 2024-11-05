const flight = require('../Services/amadeusService');

// Flight Search Controller
exports.searchFlights = async (req, res) => {
	const { origin, destination, departureDate } = req.body;
	try {
		const flightOffersResponse= await flight.shopping.flightOffersSearch.get({
			originLocationCode: "MAD",
			destinationLocationCode: "ATH",
			departureDate: "2025-07-01",
			adults: "1",
		});
		const response = await flight.shopping.flightOffers.pricing.post(
			{
				data: {
					type: "flight-offers-pricing",
					flightOffers: [flightOffersResponse.data[0]],
				},
			},
			{ include: "credit-card-fees,detailed-fare-rules" }
		);
		res.json(response.data);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.description });
	}
};