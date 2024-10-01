const HistoricalPlaceModel = require('../models/HistoricalPlace');

//create Historical Place
const addHistoricalPlace = async (req, res) => {
	const {name, description, pictures, location, openingHours, ticketPrices, tags,createdBy} = req.body;
	try {
		const newHistoricalPlace = new HistoricalPlaceModel(
			{
				name,
				description,
				pictures,
				location,
				openingHours,
				ticketPrices,
				tags,
				createdBy
			});
		await newHistoricalPlace.save();
		res.status(201).json({message: 'Historical Place added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// Get all historical places
const getAllHistoricalPlaces = async (req, res) => {
	try {
		const historicalPlaces = await HistoricalPlaceModel.find();
		res.status(201).json({historicalPlaces})
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update Historical Place
const updateHistoricalPlace = async (req, res) => {
		try {
			await HistoricalPlaceModel.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
			res.status(201).json({msg: "Historical Place updated successfully"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
}

// Delete Historical Place
const deleteHistoricalPlace = async (req, res) => {
		try {
			await HistoricalPlaceModel.findByIdAndDelete(req.params.id);
			res.status(201).json({msg: "Historical Place deleted successfully"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
}
// search for a specific HistoricalPlace by it's name or category or tag
const SearchForHistoricalPlace = async (req, res) => {
	try {
		const {name, category, tag} = req.query;
		let query = {};

		if (name) query.name = name;
		if (category) query.category = category;
		if (tag) query.tag = tag;

		const historicalPlace = await HistoricalPlaceModel.findOne(query);

		if (!historicalPlace) {
			return res.status(404).json({message: 'Historical place not found'});
		}

		res.status(200).json(historicalPlace);
	} catch (error) {
		res.status(500).json({message: error.message});
	}

}


// get all upcoming historical places
const getUpcomingHistoricalPlaces = async (req, res) => {
	try {
		const historicalPlaces = await HistoricalPlaceModel.find({upcoming: true});
		if (!historicalPlaces) {
			return res.status(404).json({message: 'No upcoming historical places found'});
		}
		res.status(200).json(historicalPlaces);
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}


//filter historical places by tag
const filterHistoricalPlaces = async (req, res) => {
	try {
		const {tag} = req.query;
		let query = {};

		if (tag) query.tag = tag;

		const historicalPlaces = await HistoricalPlaceModel.find(query);

		if (!historicalPlaces) {
			return res.status(404).json({message: 'No historical places found'});
		}

		res.status(200).json(historicalPlaces);
	} catch (error) {
		res.status(500).json({message: error.message});
	}

}
// Get all created historical places
const getAllCreatedHistoricalPlaces = async (req, res) => {
	try {
		const historicalPlaces = await HistoricalPlaceModel.find({createdBy: req.params.id});
		res.status(201).json({historicalPlaces})
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addHistoricalPlace,
	getAllHistoricalPlaces,
	updateHistoricalPlace,
	deleteHistoricalPlace,
	SearchForHistoricalPlace,
	getUpcomingHistoricalPlaces,
	filterHistoricalPlaces,
	getAllCreatedHistoricalPlaces
}