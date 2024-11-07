const ActivityModel = require('../Models/Activity.js');
const UserModel = require('../Models/User.js');
const CommentModel = require('../Models/Comments.js');

// Add Activity
const addActivity = async (req, res) => {
    const { title, description, date, time, location, price, priceRange, category, tags, specialDiscount, rating, bookingOpen,comments=[], createdBy,features ,contact} = req.body;

    try {
        // Prepare image data if a file is provided
        let image = null;
        if (req.file) {
            image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const newActivity = new ActivityModel({
	        title,
	        description,
            date,
            time,
            location,
            price,
            priceRange,
            category,
            tags,
            specialDiscount,
            rating,
            bookingOpen,
            image,
	        comments,
            createdBy,
	        features,
	        contact,
	        reviewsCount: comments.length
        });
        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all activities
const getAllActivities = async (req, res) => {
	try {
		const activities = await ActivityModel.find();
		res.status(200).json(activities)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific activity
const getActivity = async (req, res) => {
	try {
		const activity = await ActivityModel.findById(req.params.id);
		if (!activity) {
			return res.status(404).json({message: 'Activity not found'});
		}
		res.status(200).json(activity);
	} catch (error) {
		res.status(400).json({message: error.message});
	}
}

// update an existing Activity
const updateActivity = async (req, res) => {
    const { title, description, date, time, location, price, priceRange , category, tags, rating, specialDiscount, bookingOpen, comments, createdBy , features , contact } = req.body;

    try {
        const updatedFields = {
			title,
			description,
            date,
            time,
            location,
            price,
			priceRange,
            category,
            tags,
            rating,
            specialDiscount,
            bookingOpen,
	        comments,
            createdBy,
            features,
			contact,
        };

        // Update image data if a new file is uploaded
        if (req.file) {
            updatedFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const activity = await ActivityModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete an existing activity
const deleteActivity = async (req, res) => {
	try {
		const {id} = req.params

		await ActivityModel.findByIdAndDelete(id);
		res.status(200).json({message: "activity deleted successfully"});
	} catch (error) {
		res.status(404).json({error: "Activity is not Found(Already deleted)"})
	}
}


// search for a specific Activity by its category or tag
const SearchForActivity = async (req, res) => {
	try {
		const {category, tags} = req.query; // Extract category and tags from query parameters

		if (!category && !tags) {
			return res.status(400).json({message: 'Category or tags are required to search for activities.'});
		}

		// Create a search query object
		const searchQuery = {};

		if (category) {
			// Search by exact match of category
			searchQuery.category = category;
		}

		if (tags) {
			// Use $in to match any of the provided tags
			searchQuery.tags = {$in: tags.split(',')};
		}

		// Find activities matching the search criteria
		const activities = await ActivityModel.find(searchQuery);

		if (activities.length === 0) {
			return res.status(404).json({message: 'No activities found matching the search criteria.'});
		}

		return res.status(200).json(activities);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while searching for activities.', error});
	}
}

// get all upcoming activities
const getUpcomingActivities = async (req, res) => {
	try {
		// Get the current date and time
	    const currentDate = new Date();
		
		// Find activities with a date greater than or equal to the current date
		const upcomingActivities = await ActivityModel.find({date: {$gte: currentDate}});

		// If no upcoming activities are found, send a 404 response
		if (upcomingActivities.length === 0) {
			return res.status(404).json({message: 'No upcoming activities found'});
		}

		
		res.status(200).json(upcomingActivities);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error fetching upcoming activities', error});
	}

}

// Filter all upcoming activities based on budget or date or category or ratings
const filterUpcomingActivities = async (req, res) => {
	try {
		const {budget, date, category, rating} = req.query; // Extract filter parameters

		// Get the current date and time if no date is provided
		const parsedDate = date ? new Date(date) : new Date();

		// Build the query object
		let query = {
			date: {$gte: parsedDate} // Only activities on or after the current date
		};

		// Filter by budget (price)
		if (budget) {
			query.price = {$lte: Number(budget)}; // Only activities with price <= budget
		}
		

		// Filter by category (case-insensitive partial match)
		if (category) {
			query.category = category; // partial match and case-insensitive
		}

		// Filter by rating
		if (rating) {
			query.rating = {$gte: Number(rating)}; // Only activities with rating >= specified rating
		}


		// Fetch matching activities from the database
		const filteredActivities = await ActivityModel.find(query);

		// If no activities found, send a 404 response
		if (filteredActivities.length === 0) {
			return res.status(404).json({message: 'No upcoming activities found matching your filters'});
		}

		// Send back the filtered activities
		res.status(200).json(filteredActivities);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error filtering activities', error});
	}

}

// Sort upcoming activities based on price or ratings
const sortActivities = async (req, res) => {
	try {
		// Extract the sort parameter from the query string (price or rating)
		const {sortBy} = req.query;

		

		// Build the base query to find only upcoming activities
		let query = {
		
		};

		// Determine the sort criteria based on the sortBy parameter
		let sortCriteria = {};

		// If the user wants to sort by price or rating
		if (sortBy === 'price') {
			sortCriteria.price = 1; // 1 for ascending order (cheapest first)
		} else if (sortBy === 'rating') {
			sortCriteria.rating = -1; // -1 for descending order (highest rated first)
		} 

		// Fetch the upcoming activities from the database and apply the sort criteria
		const sortedActivities = await ActivityModel.find(query).sort(sortCriteria);

		// If no activities are found, return a 404 error
		if (sortedActivities.length === 0) {
			return res.status(404).json({message: 'No upcoming activities found to sort'});
		}

		// Send back the sorted activities
		res.status(200).json(sortedActivities);
	} catch (error) {
		// Handle errors and send a 500 status if something goes wrong
		res.status(500).json({message: 'Error sorting activities', error});
	}

}

// Get all created activities
const getAllCreatedActivities = async (req, res) => {
	try {
		const activities = await ActivityModel.find({createdBy: req.params.id});
		res.status(200).json(activities)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// get comments of a specific activity
const getComments = async (req, res) => {
	try {
		const activity = await ActivityModel.findById(req.params.id);
		if (!activity) {
			return res.status(404).json({message: 'Activity not found'});
		}
		console.log(activity.comments);
		const comments = await CommentModel.find({_id: {$in: activity.comments}});
		res.status(200).json(comments);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// create a comment for a specific activity
const addComment = async (req, res) => {
	const {user, text, stars} = req.body;
	try {
		const newComment = new CommentModel({user, text, stars, date: new Date()});
		await newComment.save();
		const activity = await ActivityModel.findByIdAndUpdate(req.params.id, {$push: {comments: newComment._id}, $inc: {reviewsCount: 1}}, {new: true})
		res.status(201).json(activity);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getActivitiesAdmin = async (req, res) => {
	try {
		const activities = await ActivityModel.find().select('title date location price priceRange rating bookingOpen createdBy');
		const updatedActivities = await Promise.all(activities.map(async (activity) => {
			const user = await UserModel.findById(activity.createdBy).select('firstName lastName');
			activity._doc.createdByName = user? `${user.firstName} ${user.lastName}` : 'N/A';
			return activity;
		}));
		res.status(200).json(updatedActivities);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addActivity,
	getAllActivities,
	getActivity,
	updateActivity,
	deleteActivity,
	SearchForActivity,
	getUpcomingActivities,
	filterUpcomingActivities,
	sortActivities,
	getAllCreatedActivities,
	getComments,
	addComment,
	getActivitiesAdmin
}

