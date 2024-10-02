const MuseumModel = require('../models/Museum');
const Activity = require('../Models/Activity.js');


//create museum
const addMuseum = async (req, res) => {
	const {name, description, pictures, location, openingHours, ticketPrices, tags, createdBy} = req.body;
	try {
		const newMuseum = new MuseumModel({
			name, description, pictures, location, openingHours, ticketPrices, tags, createdBy
		});
		await newMuseum.save();
		res.status(201).json({message: 'Museum added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all  museums
const getMuseums = async (req, res) => {
	try {
		const museums =  await MuseumModel.find();
		res.status(201).json({museums})
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update Museum
const updateMuseum = async (req, res) => {
	try {
		await MuseumModel.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
		res.status(201).json({msg: "Museum updated successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Delete Museum
const deleteMuseum = async (req, res) => {
	try {
		await MuseumModel.findByIdAndDelete(req.params.id);
		res.status(201).json({msg: "Museum deleted successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// search for a specific Museum by it's name or category or tag
const SearchForMuseums = async (req, res) => {
	try {
        const { name, category, tags } = req.query; // Extract search filters from query string

        // Build activity query
        let activityQuery = {};

        // If category is provided, search for activities with matching category
        if (category) {
            activityQuery.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive partial match
        }

        // If tags are provided, search for activities with matching tags
        if (tags) {
            activityQuery.tags = { $in: tags.split(',') };
        }

        // Search for activities related to museums
        const activities = await Activity.find(activityQuery).populate('museum'); // Populate museum info

        // Filter out activities that don't have a related museum
        const museums = activities
            .filter(activity => activity.museum) // Ensure activity is connected to a museum
            .map(activity => activity.museum); // Extract museums from activities

        // If filtering by name, apply that condition on the museum objects
        const filteredMuseums = museums.filter(museum =>
            name ? museum.name.toLowerCase().includes(name.toLowerCase()) : true
        );

        if (filteredMuseums.length === 0) {
            return res.status(404).json({ message: 'No museums found matching your search criteria' });
        }

        res.status(200).json(filteredMuseums); // Return the matching museums
    } catch (error) {
        res.status(500).json({ message: 'Error searching for museums', error });
    }

}

// get all upcoming museums
const getUpcomingMuseums = async (req, res) => {
	try {
        const currentDate = new Date(); // Get the current date

        // Find activities with future dates and associated museums
        const upcomingActivities = await Activity.find({ date: { $gte: currentDate } })
            .populate('museum'); // Populate museum details

        // Extract unique museums from upcoming activities
        const upcomingMuseums = upcomingActivities
            .map(activity => activity.museum)
            .filter((museum, index, self) => museum && self.findIndex(m => m._id.equals(museum._id)) === index);

        if (upcomingMuseums.length === 0) {
            return res.status(404).json({ message: 'No upcoming museums found' });
        }

        res.status(200).json(upcomingMuseums); // Return the list of upcoming museums
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming museums', error });
    }
}


//filter museums by tag
const filterMuseums = async (req, res) => {
	try {
        const { tag } = req.query; // Extract tag from the query parameters

        // Check if tag is provided, return a bad request if not
        if (!tag) {
            return res.status(400).json({ message: 'Tag is required for filtering' });
        }

        // Find Museums that have the specified tag in their tags array
        const museums = await MuseumModel.find({
            tags: { $in: [tag] } // Match any Museum that has the tag in its tags array
        });

        // If no museums are found, return a 404 response
        if (museums.length === 0) {
            return res.status(404).json({ message: 'No museums found with the specified tag' });
        }

        // Return the matching historical places
        res.status(200).json(museums);
    } catch (error) {
        // Handle any errors during the filtering process
        res.status(500).json({ message: 'Error filtering museums', error });
    }
}

// Get all created museums
const getAllCreatedMuseums = async (req, res) => {
	try {
		const museums = await MuseumModel.find({createdBy: req.params.id});
		res.status(201).json({museums})
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addMuseum, getMuseums, updateMuseum, deleteMuseum, SearchForMuseums, getUpcomingMuseums, filterMuseums, getAllCreatedMuseums
}