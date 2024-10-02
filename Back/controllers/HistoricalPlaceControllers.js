const HistoricalPlaceModel = require('../models/HistoricalPlace');
const ActivityModel = require('../Models/Activity');

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

        // Search for activities related to historicalplaces
        const activities = await ActivityModel.find(activityQuery).populate('historicalPlace'); // Populate museum info

        // Filter out activities that don't have a related historicalplaces
        const historicalplaces = activities
            .filter(activity => activity.historicalPlace) // Ensure activity is connected to a historicalplace
            .map(activity => activity.historicalPlace); // Extract historicalplace from activities

        // If filtering by name, apply that condition on the historicalPlace objects
        const filteredhistoricalPlace = historicalplaces.filter(historicalPlace =>
            name ? historicalPlace.name.toLowerCase().includes(name.toLowerCase()) : true
        );

        if (filteredhistoricalPlace.length === 0) {
            return res.status(404).json({ message: 'No historical place found matching your search criteria' });
        }

        res.status(200).json(filteredhistoricalPlace); // Return the matching historical place
    } catch (error) {
        res.status(500).json({ message: 'Error searching for  historical place', error });
    }



}


// get all upcoming historical places
const getUpcomingHistoricalPlaces = async (req, res) => {
	try {
        const currentDate = new Date();

        // Find all activities that are associated with historical places and have an upcoming date
        const upcomingActivities = await ActivityModel.find({
            date: { $gte: currentDate }, // Only include activities with dates in the future
            historicalPlace: { $exists: true } // Ensure the activity is linked to a historical place
        }).populate('historicalPlace'); // Populate the historical place information

        // Extract unique historical places from the upcoming activities
        const upcomingHistoricalPlaces = upcomingActivities
            .map(activity => activity.historicalPlace)
            .filter((place, index, self) => self.findIndex(p => p._id.equals(place._id)) === index); // Ensure uniqueness

        if (upcomingHistoricalPlaces.length === 0) {
            return res.status(404).json({ message: 'No upcoming historical places found' });
        }

        res.status(200).json(upcomingHistoricalPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming historical places', error });
    }

}


//filter historical places by tag
const filterHistoricalPlaces = async (req, res) => {
	try {
        const { tag } = req.query; // Extract tag from the query parameters

        // Check if tag is provided, return a bad request if not
        if (!tag) {
            return res.status(400).json({ message: 'Tag is required for filtering' });
        }

        // Find historical places that have the specified tag in their tags array
        const historicalPlaces = await HistoricalPlaceModel.find({
            tags: { $in: [tag] } // Match any historical place that has the tag in its tags array
        });

        // If no places are found, return a 404 response
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found with the specified tag' });
        }

        // Return the matching historical places
        res.status(200).json(historicalPlaces);
    } catch (error) {
        // Handle any errors during the filtering process
        res.status(500).json({ message: 'Error filtering historical places', error });
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