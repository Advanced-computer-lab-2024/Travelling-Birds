const HistoricalPlaceModel = require('../Models/HistoricalPlace');


//Parse time to date
const parseTimeToDate = (timeString) => {
    // Parse a time string "HH:MM:SS" into a Date object with the local date
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
};


// Add Historical Place
const addHistoricalPlace = async (req, res) => {
    const { name, description, openingHours, location, ticketPrices, tags,activities, createdBy } = req.body;

    try {
        if (!openingHours) {
            return res.status(400).json({ error: 'Invalid openingHours format. Must include startTime and endTime.' });
        }

        let parsedOpeningHours;
        try {
            parsedOpeningHours = typeof openingHours === 'string' ? JSON.parse(openingHours) : openingHours;
        } catch (error) {
            return res.status(400).json({ error: 'Invalid openingHours format. Must be a valid JSON object.' });
        }

        if (!parsedOpeningHours.startTime || !parsedOpeningHours.endTime) {
            return res.status(400).json({ error: 'Invalid openingHours format. Must include startTime and endTime.' });
        }

        parsedOpeningHours.startTime = parseTimeToDate(parsedOpeningHours.startTime);
        parsedOpeningHours.endTime = parseTimeToDate(parsedOpeningHours.endTime);

        let image = null;
        if (req.file) {
            image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const newHistoricalPlace = new HistoricalPlaceModel({
            name,
            description,
            openingHours: parsedOpeningHours,
            location,
            ticketPrices,
            tags,
            image,
            activities,
            createdBy,
        });

        await newHistoricalPlace.save();
        res.status(201).json(newHistoricalPlace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        const { id } = req.params;
        // Fetch the historical place and populate its activities
        const place = await HistoricalPlaceModel.findById(id).populate('activities');
        if (!place) {
            return res.status(404).json({ message: 'Historical place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical place', error });
    }
};

const updateHistoricalPlace = async (req, res) => {
    const { name, description, openingHours, location, ticketPrices, tags,activities, createdBy } = req.body;

    try {
        const updatedFields = {
            name,
            description,
            location,
            ticketPrices,
            tags,
            activities,
            createdBy,
        };

        if (openingHours) {
            let parsedOpeningHours;
            try {
                parsedOpeningHours = typeof openingHours === 'string' ? JSON.parse(openingHours) : openingHours;
            } catch (error) {
                return res.status(400).json({ error: 'Invalid openingHours format. Must be a valid JSON object.' });
            }

            parsedOpeningHours.startTime = parseTimeToDate(parsedOpeningHours.startTime);
            parsedOpeningHours.endTime = parseTimeToDate(parsedOpeningHours.endTime);

            updatedFields.openingHours = parsedOpeningHours;
        }

        if (req.file) {
            updatedFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const historicalPlace = await HistoricalPlaceModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!historicalPlace) {
            return res.status(404).json({ message: 'Historical place not found' });
        }
        res.status(200).json(historicalPlace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
            searchQuery.name = { $regex: new RegExp(name, 'i') }; // 'i' flag makes it case-insensitive
        }

        if (tags) {
            // Use $in with case-insensitive matching for tags
            const tagArray = tags.split(',').map(tag => new RegExp(tag.trim(), 'i')); // 'i' flag for case-insensitivity
            searchQuery.tags = { $in: tagArray };
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
		res.status(201).json(historicalPlaces)
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