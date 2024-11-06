const flight = require('../Services/amadeusService');

// Flight Search Controller
exports.searchFlights = async (req, res) => {
	const { origin, destination, departureDate } = req.body;
	try {
		const flightOffersResponse= await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: "EGP",
		});
		res.json(flightOffersResponse.data);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.description });
	}
};
// returns specific flight details based on the flight id
exports.getFlightDetails = async (req, res) => {
	const { flightId } = req.params;
	try {
		const flightDetails = await flight.shopping.flightOffersSearch.get({
			id: flightId,
		});
		const response = await flight.shopping.flightOffers.pricing.post(
			{
				data: {
					type: "flight-offers-pricing",
					flightOffers: [flightDetails.data[0]],
				},
			},
			{ include: "credit-card-fees,detailed-fare-rules" }
		);
		response.json(flightDetails.data);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.description });
	}
};
