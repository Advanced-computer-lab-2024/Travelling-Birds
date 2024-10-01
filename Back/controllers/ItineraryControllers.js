const ItineraryModel = require('../Models/Itinerary.js');

// create a new itinerary
const createItinerary = async (req, res) => {
	const { activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, createdBy } = req.body;
	try {
		const itinerary = new ItineraryModel({ activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, createdBy});
		await itinerary.save();
		res.status(201).json(itinerary);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
// update an existing itinerary
const updateItinerary = async (req, res) => {
	const { activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, createdBy } = req.body;
	try {
		const itinerary =  await ItineraryModel.findByIdAndUpdate(req.params.id, { activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, createdBy }, { new: true });
		if (!itinerary) {
			return res.status(404).json({ message: 'itinerary not found' });
		}
		res.status(200).json(itinerary);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

}
//display an existing itinerary
const displayItinerary = async (req, res) => {
	try {
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({ message: 'itinerary not found' });
		}
		res.status(200).json(itinerary);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}
// search for a specific Intinerary by it's name or category or tag
const searchForItinerary = async (req, res) => {
	try {
		const { name, category, tag } = req.query;
		let query = {};

		if (name) query.name = name;
		if (category) query.category = category;
		if (tag) query.tag = tag;

		const itinerary = await itineraryModel.findOne(query);

		if (!itinerary) {
			return res.status(404).json({ message: 'itinerary not found' });
		}

		res.status(200).json(itinerary);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}

}

// get all upcoming itineraries
const getUpcomingItineraries = async (req, res) => {
	try {
		const itineraries = await ItineraryModel.find({ date: { $gte: new Date() } });

		if (!itineraries) {
			return res.status(404).json({ message: 'No upcoming itineraries found' });
		}

		res.status(200).json(itineraries);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}



//sort all itineraries based on price or ratings
const sortItineraries = async (req, res) => {
	try {
		const { sortBy } = req.query;
		let sortCriteria = {};

		if (sortBy === 'price') {
			sortCriteria.price = 1; // ascending order
		} else if (sortBy === 'ratings') {
			sortCriteria.ratings = -1; // descending order
		} else {
			return res.status(400).json({ message: 'Invalid sort criteria' });
		}

		const itineraries = await itineraryModel.find().sort(sortCriteria);

		if (!itineraries) {
			return res.status(404).json({ message: 'No itineraries found' });
		}

		res.status(200).json(itineraries);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

// Filter all available/upcoming itineraries based on budget, date, preferences and language
const filterItineraries = async (req, res) => {
	try {
		const { budget, date, preferences, language } = req.query;
		let query = {};

		if (budget) query.price = { $lte: budget };
		if (date) query.date = { $gte: new Date(date) };
		if (preferences) query.preferences = preferences;
		if (language) query.language = language;

		const itineraries = await ItineraryModel.find(query);

		if (!itineraries) {
			return res.status(404).json({ message: 'No itineraries found' });
		}

		res.status(200).json(itineraries);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

// Get all created itineraries
const getAllCreatedItineraries = async (req, res) => {
	//no reference to logged-in user
	try{
		const itineraries =  ItineraryModel.find();
		res.status(201).json({itineraries})
	}
	catch (error){
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	createItinerary,
	updateItinerary,
	displayItinerary,
	getUpcomingItineraries,
	searchForItinerary,
	sortItineraries,
	filterItineraries,
	getAllCreatedItineraries
};