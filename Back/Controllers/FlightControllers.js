// Import the Amadeus flight service
const flight = require('../Services/amadeusService');

exports.searchFlights = async (req, res) => {
	const {origin, destination, departureDate, currencyCode} = req.body;
	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: currencyCode || "EGP",
		});
		res.json(flightOffersResponse.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: error.description});
	}
};

exports.getFlightDetails = async (req, res) => {
	const {flightId} = req.params;
	const {origin, destination, departureDate, currencyCode} = req.params;

	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: currencyCode || "EGP",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightId);
		if (!selectedFlight) {
			return res.status(404).json({message: "Flight not found."});
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
		res.status(500).json({message: error.description});
	}
};

// Book Flight Controller
exports.bookFlight = async (req, res) => {
	const {flightDetails, travelerInfo} = req.body;
	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: flightDetails?.itineraries[0].segments[0].departure.iataCode,
			destinationLocationCode: flightDetails?.itineraries[0].segments[flightDetails?.itineraries[0].segments.length - 1].arrival.iataCode,
			departureDate: flightDetails?.itineraries[0].segments[0].departure.at.split('T')[0],
			adults: "1",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightDetails.id);
		if (!selectedFlight) {
			return res.status(404).json({message: "Flight not found."});
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
				flightOffers: [pricingResponse.data.flightOffers[0]],
				travelers: [
					{
						id: "1",
						dateOfBirth: travelerInfo.dateOfBirth,
						name: {
							firstName: travelerInfo.name.firstName,
							lastName: travelerInfo.name.lastName
						},
						gender: travelerInfo.gender,
						contact: {
							emailAddress: travelerInfo.contact.emailAddress,
							phones: [
								{
									deviceType: "MOBILE",
									countryCallingCode: "20",
									number: travelerInfo.contact.phones[0].number
								}
							]
						},
						documents: [
							{
								documentType: "PASSPORT",
								birthPlace: travelerInfo.documents[0].birthPlace,
								issuanceLocation: travelerInfo.documents[0].issuanceLocation,
								issuanceDate: travelerInfo.documents[0].issuanceDate,
								number: travelerInfo.documents[0].number,
								expiryDate: travelerInfo.documents[0].expiryDate,
								issuanceCountry: travelerInfo.documents[0].issuanceCountry,
								validityCountry: travelerInfo.documents[0].validityCountry,
								nationality: travelerInfo.documents[0].nationality,
								holder: true
							}
						]
					}
				]
			},
		});
		res.status(200).json({
			message: "Booking confirmed!",
			bookingDetails: bookingResponse.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({message: error.description || "An error occurred while booking the flight."});
	}
};

