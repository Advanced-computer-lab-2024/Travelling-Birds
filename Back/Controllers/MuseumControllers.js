const MuseumModel = require('../Models/Museum');


//create museum
const addMuseum = async (req, res) => {
    const { name, description, location, openingHours, ticketPrices, tags, createdBy } = req.body;

    try {
        // Parse `ticketPrices` if it's passed as a JSON string or an improperly formatted object
        let parsedTicketPrices;
        if (typeof ticketPrices === 'string') {
            parsedTicketPrices = JSON.parse(ticketPrices);
        } else if (typeof ticketPrices === 'object' && !Array.isArray(ticketPrices)) {
            parsedTicketPrices = ticketPrices;
        } else {
            return res.status(400).json({ error: 'Invalid ticketPrices format' });
        }

        let image = null;
        if (req.file) {
            image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const newMuseum = new MuseumModel({
            name,
            description,
            location,
            openingHours,
            ticketPrices: parsedTicketPrices,
            tags,
            image,
            createdBy
        });

        await newMuseum.save();
        res.status(201).json(newMuseum);
    } catch (error) {
        console.error('Error occurred during museum creation:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all  museums
const getAllMuseums = async (req, res) => {
	try {
		const museums = await MuseumModel.find();
		res.status(200).json(museums)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific museum
const getMuseum = async (req, res) => {
	try {
		const museum = await MuseumModel.findById(req.params.id);
		if (!museum) {
			return res.status(404).json({message: 'Museum not found'});
		}
		res.status(200).json(museum);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update Museum
const updateMuseum = async (req, res) => {
    const { name, description,location, openingHours, ticketPrices, tags, createdBy } = req.body;

    try {
        const updatedFields = {
            name,
            description,
            location,
            openingHours,
            tags,
            createdBy
        };

        // Parse `ticketPrices` if it's passed as a string or an improperly formatted object
        if (ticketPrices) {
            let parsedTicketPrices;
            if (typeof ticketPrices === 'string') {
                parsedTicketPrices = JSON.parse(ticketPrices);
            } else if (typeof ticketPrices === 'object' && !Array.isArray(ticketPrices)) {
                parsedTicketPrices = ticketPrices;
            } else {
                return res.status(400).json({ error: 'Invalid ticketPrices format' });
            }
            updatedFields.ticketPrices = parsedTicketPrices;
        }

        // Update image data if a new file is uploaded
        if (req.file) {
            updatedFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const museum = await MuseumModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!museum) {
            return res.status(404).json({ message: 'Museum not found' });
        }
        res.status(200).json(museum);
    } catch (error) {
        console.error('Error occurred during museum update:', error);
        res.status(500).json({ error: error.message });
    }
};
// Delete Museum
const deleteMuseum = async (req, res) => {
	try {
		await MuseumModel.findByIdAndDelete(req.params.id);
		res.status(201).json({msg: "Museum deleted successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// search for a specific Museum by it's name or tag
const SearchForMuseums = async (req, res) => {
	try {
		const {name, tags} = req.query; // Extract name and tags from query parameters

		if (!name && !tags) {
			return res.status(400).json({message: 'Name or tags are required to search for museums.'});
		}

		// Create a search query object
		const searchQuery = {};

		if (name) {
			// Use a case-insensitive regular expression for name search
			searchQuery.name = {$regex: name, $options: 'i'};
		}

		if (tags) {
			// Use $in to find museums where any of the provided tags match
			searchQuery.tags = {$in: tags.split(',')};
		}

		// Find museums matching the search criteria
		const museums = await MuseumModel.find(searchQuery);

		if (museums.length === 0) {
			return res.status(404).json({message: 'No museums found matching the search criteria.'});
		}

		return res.status(200).json(museums);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while searching for museums.', error});
	}
}


//filter museums by tag
const filterMuseums = async (req, res) => {
	try {
		const {tag} = req.query; // Extract tag from the query parameters

		if (!tag) {
			return res.status(400).json({message: 'Tag is required to filter museums.'});
		}

		// Find museums where the tags array contains the given tag
		const museums = await MuseumModel.find({tags: tag});

		if (museums.length === 0) {
			return res.status(404).json({message: 'No museums found with the given tag.'});
		}

		return res.status(200).json(museums);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while filtering museums.', error});
	}
}

// Get all created museums
const getAllCreatedMuseums = async (req, res) => {
	try {
		const museums = await MuseumModel.find({createdBy: req.params.id});
		res.status(201).json(museums)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addMuseum,
	getAllMuseums,
	getMuseum,
	updateMuseum,
	deleteMuseum,
	SearchForMuseums,
	filterMuseums,
	getAllCreatedMuseums
}