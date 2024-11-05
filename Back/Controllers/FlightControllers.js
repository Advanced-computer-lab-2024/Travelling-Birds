const flight = require('../Services/amadeusService');

// Flight Search Controller
exports.searchFlights = async (req, res) => {
	const { origin, destination, departureDate } = req.body;
	try {
		const response = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate,
			adults: 1,
		});
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ message: error.description });
	}
};