const ItineraryModel = require('../Models/Itinerary.js');
const ActivityModel = require('../Models/Activity.js');
const UserModel = require('../Models/User.js');
const CommentModel = require('../Models/Comments.js');

// Add itinerary
const addItinerary = async (req, res) => {
	const {
		title,
		description,
		activities,
		locations,
		duration,
		language,
		price,
		availableDates,
		accessibility,
		pickupLocation,
		dropoffLocation,
		createdBy
	} = req.body;
	try {
		let image = null;
        if (req.file) {
            image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
		const itinerary = new ItineraryModel({
			title,
			description,
			activities,
			locations,
			duration,
			language,
			price,
			availableDates,
			accessibility,
			pickupLocation,
			dropoffLocation,
			image,
			createdBy
		});
		await itinerary.save();
		res.status(201).json(itinerary);
	} catch (error) {
		res.status(400).json({message: error.message});
	}
}

// Get all itineraries
const getAllItineraries = async (req, res) => {
	try {
		const itineraries = await ItineraryModel.find();
		res.status(200).json(itineraries);
	} catch (error) {
		res.status(400).json({message: error.message});
	}
}

// Get specific itinerary
const getItinerary = async (req, res) => {
	try {
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({message: 'itinerary not found'});
		}
		res.status(200).json(itinerary);
	} catch (error) {
		res.status(400).json({message: error.message});
	}
}

// Update itinerary
const updateItinerary = async (req, res) => {
    const {
		title,
	    description,
        activities,
        locations,
        duration,
        language,
        price,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation,
        createdBy
    } = req.body;

    try {
        const updatedFields = {
			title,
	        description,
            activities,
            locations,
            duration,
            language,
            price,
            availableDates,
            accessibility,
            pickupLocation,
            dropoffLocation,
            createdBy
        };

        // Handle image upload
        if (req.file) {
            updatedFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const itinerary = await ItineraryModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete itinerary
const deleteItinerary = async (req, res) => {
	try {
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({message: 'itinerary not found'});
		}
		if (itinerary.isBooked) {
			return res.status(400).json({message: 'Cannot delete a booked itinerary'});
		}
		await ItineraryModel.findByIdAndDelete(req.params.id);
		res.status(200).json({message: 'itinerary deleted successfully'});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
}

// search for a specific Intinerary by it's name or category or tag
const SearchForItinerary = async (req, res) => {
	try {
		const {category, tags} = req.query; // Extract category and tags from the query string

		// Build the query for activities
		let activityQuery = {};

		// If category is provided, search for activities with a matching category (case-insensitive partial match)
		if (category) {
			activityQuery.category = category // Partial match and case-insensitive
		}

		// If tags are provided, search for activities with matching tags (any of the tags in the array)
		if (tags) {
			activityQuery.tags = {$in: tags.split(',')}; // Find activities where any of the provided tags match
		}

		// Find itineraries where any of the activities match the category or tags query
		const itineraries = await ItineraryModel.find()
			.populate({
				path: 'activities', // Populate the activities field
				match: activityQuery // Apply the activity query filter
			});

		// Filter out itineraries that have no matching activities
		const filteredItineraries = itineraries.filter(itinerary => itinerary.activities.length > 0);

		// If no itineraries are found, return a 404 response
		if (filteredItineraries.length === 0) {
			return res.status(404).json({message: 'No itineraries found matching your search criteria'});
		}

		// Return the filtered itineraries
		res.status(200).json(filteredItineraries);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error searching for itineraries', error});
	}
}

// get all upcoming itineraries
const getUpcomingItineraries = async (req, res) => {
	try {
		const currentDate = new Date(); // Get the current date
		

		// Find itineraries and populate activities
		const itineraries = await ItineraryModel.find()
			.populate({
				path: 'activities', // Populate the activities field
				match: {date: {$gte: currentDate}} // Only include activities with dates in the future
			});
		

		// Filter out itineraries that have no upcoming activities
		const upcomingItineraries = itineraries.filter(itinerary => itinerary.activities.length > 0);
		

		// If no upcoming itineraries are found, return a 404 response
		if (upcomingItineraries.length === 0) {
			return res.status(404).json({message: 'No upcoming itineraries found'});
		}

		// Return the filtered upcoming itineraries
		res.status(200).json(upcomingItineraries);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		console.error('Error fetching upcoming itineraries:', error);
		res.status(500).json({message: 'Error fetching upcoming itineraries', error});
	}
}

//sort all itineraries based on price or ratings
const sortItineraries = async (req, res) => {
	try {
		const {sortBy} = req.query; // Extract the sort criteria (price or rating) from the query string
		const currentDate = new Date(); // Get the current date

		// Find all itineraries and populate their activities
		const itineraries = await ItineraryModel.find()
			.populate({
				path: 'activities', // Populate the activities field
				match: {date: {$gte: currentDate}} // Only include activities with upcoming dates
			});

		// Filter out itineraries that have no upcoming activities
		let upcomingItineraries = itineraries.filter(itinerary => itinerary.activities.length > 0);

		// Sort by price if requested
		if (sortBy === 'price') {
			upcomingItineraries = upcomingItineraries.sort((a, b) => a.price - b.price);
		}

		// Sort by average rating of activities if requested
		if (sortBy === 'rating') {
			upcomingItineraries = upcomingItineraries.sort((a, b) => {
				const avgRatingA = a.activities.reduce((sum, activity) => sum + activity.rating, 0) / a.activities.length;
				const avgRatingB = b.activities.reduce((sum, activity) => sum + activity.rating, 0) / b.activities.length;
				return avgRatingB - avgRatingA; // Sort in descending order (higher ratings first)
			});
		}

		// If no itineraries found, send a 404 response
		if (upcomingItineraries.length === 0) {
			return res.status(404).json({message: 'No upcoming itineraries found'});
		}

		// Return the sorted itineraries
		res.status(200).json(upcomingItineraries);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error sorting itineraries', error});
	}

}

// Filter all available/upcoming itineraries based on budget, date, preferences and language
const filterItineraries = async (req, res) => {
	try {
		const {price, date, language, preferences} = req.query; // Extract filter parameters from the query string
		const currentDate = new Date(); // Get the current date

		// Build the query for filtering itineraries based on language, preferences, and price
		let itineraryQuery = {};

		// Filter by language if provided
		if (language) {
			itineraryQuery.language = language // Case-insensitive partial match for language
		}

		// Filter by preferences if provided
		if (preferences) {
			itineraryQuery.preferences = preferences // Case-insensitive partial match for preferences
		}

		// Filter by price if provided
		if (price) {
			itineraryQuery.price = {$lte: Number(price)};
		}

		// Find itineraries based on the itinerary query (language, preferences, price)
		let itineraries = await ItineraryModel.find(itineraryQuery)
			.populate({
				path: 'activities', // Populate the activities field
				match: {date: {$gte: currentDate}} // Only include activities with upcoming dates
			});

		// If date filter is provided, filter itineraries where activities have matching upcoming dates
		if (date) {
			const filteredItineraries = itineraries.filter(itinerary =>
				itinerary.activities.some(activity => {
					const activityDate = new Date(activity.date);
					return activityDate.toISOString().split('T')[0] === date; // Match specific date (YYYY-MM-DD format)
				})
			);

			itineraries = filteredItineraries; // Update itineraries list with date-filtered results
		}

		// Filter out itineraries that have no upcoming activities after the filters
		const upcomingItineraries = itineraries.filter(itinerary => itinerary.activities.length > 0);

		// If no itineraries are found, return a 404 response
		if (upcomingItineraries.length === 0) {
			return res.status(404).json({message: 'No itineraries found matching your filters'});
		}

		// Return the filtered itineraries
		res.status(200).json(upcomingItineraries);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error filtering itineraries', error});
	}

}

// Get all created itineraries
const getAllCreatedItineraries = async (req, res) => {
	try {
		const itineraries = await ItineraryModel.find({createdBy: req.params.id});
		res.status(201).json({itineraries})
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getComments = async (req, res) => {
	try {
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}
		const comments = await CommentModel.find({_id: {$in: itinerary.comments}});
		res.status(200).json(comments);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// create a comment for a specific itinerary
const addComment = async (req, res) => {
	const {user, text, stars} = req.body;
	try {
		const user2 = await UserModel.findById(user);
		if (!user2) {
			return res.status(404).json({message: 'User not found'});
		}
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}
		//check user completed itinerary before commenting
		if (!((user2.itineraryBookings.includes(req.params.id)) && (itinerary.date < new Date()))) {
			return res.status(400).json({message: 'User must complete the itinerary before commenting'});
		}
		const newComment = new CommentModel({user, text, stars, date: new Date()});
		await newComment.save();
		const itineraryWithComment = await ItineraryModel.findByIdAndUpdate(
			req.params.id,
			{
				$push: {comments: newComment._id}
			},
			{new: true}
		).populate('comments');
		res.status(201).json(itineraryWithComment);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// get all activities for a specific itinerary
const getActivities = async (req, res) => {
	try {
		const itinerary = await ItineraryModel.findById(req.params.id);
		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}
		const activities = await ActivityModel.find({_id: {$in: itinerary.activities}});
		res.status(200).json(activities);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addItinerary,
	getAllItineraries,
	getItinerary,
	updateItinerary,
	deleteItinerary,
	SearchForItinerary,
	getUpcomingItineraries,
	sortItineraries,
	filterItineraries,
	getAllCreatedItineraries,
	getComments,
	addComment,
	getActivities
};