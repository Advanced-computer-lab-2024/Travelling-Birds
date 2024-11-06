// Import the Amadeus flight service
const flight = require('../Services/amadeusService');
let [originGlobal, destinationGlobal, departureDateGlobal] = ["CAI", "JFK", "2025-01-01"];

// Flight Search Controller
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
		// Search for flights using previously stored globals
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: originGlobal,
			destinationLocationCode: destinationGlobal,
			departureDate: departureDateGlobal,
			adults: "1",
			currencyCode: "EGP",
		});

		// Find the specific flight offer that matches flightId
		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightId);
		if (!selectedFlight) {
			return res.status(404).json({ message: "Flight not found." });
		}

		// Perform the pricing step on the selected flight
		const response = await flight.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [selectedFlight],
			},
		}, {
			include: "credit-card-fees,detailed-fare-rules"
		});

		// Send the response back to the client
		res.json(response.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description });
	}
};
