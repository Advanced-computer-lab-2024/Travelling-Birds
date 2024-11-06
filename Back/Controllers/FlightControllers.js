// Import the Amadeus flight service
const flight = require('../Services/amadeusService');
let [originGlobal, destinationGlobal, departureDateGlobal] = ["CAI", "JFK", "2025-01-01"];

exports.searchFlights = async (req, res) => {
	const { origin, destination, departureDate } = req.body;
	originGlobal = origin;
	destinationGlobal = destination;
	departureDateGlobal = departureDate;

	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: "EGP",
		});
		res.json(flightOffersResponse.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description });
	}
};

// Get Flight Details Controller
exports.getFlightDetails = async (req, res) => {
	const { flightId } = req.params;

	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: originGlobal,
			destinationLocationCode: destinationGlobal,
			departureDate: departureDateGlobal,
			adults: "1",
			currencyCode: "EGP",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightId);
		if (!selectedFlight) {
			return res.status(404).json({ message: "Flight not found." });
		}

		const response = await flight.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [selectedFlight],
			},
		}, {
			include: "credit-card-fees,detailed-fare-rules"
		});

		res.json(response.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description });
	}
};
