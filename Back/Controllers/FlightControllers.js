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

exports.getFlightDetails = async (req, res) => {
	const { flightId } = req.params;
	const { origin, destination, departureDate } = req.params;

	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
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

// Book Flight Controller
exports.bookFlight = async (req, res) => {
	const { flightDetails, travelerDetails } = req.body;
	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: flightDetails?.itineraries[0].segments[0].departure.iataCode,
			destinationLocationCode: flightDetails?.itineraries[0].segments[flightDetails?.itineraries[0].segments.length-1].arrival.iataCode,
			departureDate: flightDetails?.itineraries[0].segments[0].departure.at.split('T')[0],
			adults: "1",
			currencyCode: "EGP",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightDetails.id);
		if (!selectedFlight) {
			return res.status(404).json({ message: "Flight not found." });
		}

		const pricingResponse = await flight.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [selectedFlight],
			},
		});

		const bookingResponse = await flight.booking.flightOrders.post({
			data: {
				type: "flight-order",
				flightOffers: pricingResponse.data.flightOffers,
				travelers: travelerDetails.map((traveler, index) => ({
					id: (index + 1).toString(),
					dateOfBirth: traveler.dateOfBirth,
					name: {
						firstName: traveler.firstName,
						lastName: traveler.lastName,
					},
					gender: traveler.gender,
					contact: {
						emailAddress: traveler.emailAddress,
						phones: [
							{
								deviceType: "MOBILE",
								countryCallingCode: "20",  // Replace with the actual country calling code
								number: traveler.phone,
							},
						],
					},
					documents: [
						{
							documentType: "PASSPORT",
							number: traveler.passportNumber,
							expiryDate: traveler.passportExpiry,
							issuanceCountry: traveler.issuanceCountry,
							nationality: traveler.nationality,
						},
					],
				})),
			},
		});

		res.status(200).json({
			message: "Booking confirmed!",
			bookingDetails: bookingResponse.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.description || "An error occurred while booking the flight." });
	}
};

