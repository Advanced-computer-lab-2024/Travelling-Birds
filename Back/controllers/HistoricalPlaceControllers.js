const HistoricalPlaceModel = require('../Models/HistoricalPlace');


// Add Historical Place
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
		res.status(201).json(newHistoricalPlace);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all historical places
const getAllHistoricalPlaces = async (req, res) => {
	try {
		const historicalPlaces = await HistoricalPlaceModel.find();
		res.status(200).json(historicalPlaces)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific historical place
const getHistoricalPlace = async (req, res) => {
	try {
		const historicalPlace = await HistoricalPlaceModel.findById(req.params.id);
		if (!historicalPlace) {
			return res.status(404).json({message: 'Historical Place not found'});
		}
		res.status(200).json(historicalPlace);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update Historical Place
const updateHistoricalPlace = async (req, res) => {
		try {
			const historicalPlace = await HistoricalPlaceModel.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
			res.status(200).json(historicalPlace);
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

// search for a specific HistoricalPlace by its name or tag
const SearchForHistoricalPlace = async (req, res) => {
	try {
        const { name, tags } = req.query; // Extract name and tags from query parameters

        if (!name && !tags) {
            return res.status(400).json({ message: 'Name or tags are required to search for historical places.' });
        }

        // Create a search query object
        const searchQuery = {};

        if (name) {
            // Use a case-insensitive regular expression for name search
            searchQuery.name = name;
        }

        if (tags) {
            // Use $in to find historical places where any of the provided tags match
            searchQuery.tags = { $in: tags.split(',') };
        }

        // Find historical places matching the search criteria
        const historicalPlaces = await HistoricalPlaceModel.find(searchQuery);

        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found matching the search criteria.' });
        }

        return res.status(200).json(historicalPlaces);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while searching for historical places.', error });
    }



}

//filter historical places by tag
const filterHistoricalPlaces = async (req, res) => {
    try {
        const { tag } = req.query; // Extract tag from the query parameters

        if (!tag) {
            return res.status(400).json({ message: 'Tag is required to filter historical places.' });
        }

        // Find historical places where the tags array contains the given tag
        const historicalPlaces = await HistoricalPlaceModel.find({ tags: tag });

        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found with the given tag.' });
        }

        return res.status(200).json(historicalPlaces);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while filtering historical places.', error });
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
	getHistoricalPlace,
	updateHistoricalPlace,
	deleteHistoricalPlace,
	SearchForHistoricalPlace,
	filterHistoricalPlaces,
	getAllCreatedHistoricalPlaces
}