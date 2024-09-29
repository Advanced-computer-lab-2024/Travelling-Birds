const ActivityModel = require('../Models/Activity.js');


// get all upcoming activities
const getUpcomingActivities = async (req, res) => {
    try {
        const activities = await ActivityModel.find({ date: { $gte: new Date() } });

        if (!activities) {
            return res.status(404).json({ message: 'No upcoming activities found' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get a single activity with name or category or tag
const getActivity = async (req, res) => {
    try {
        const { name, category, tag } = req.query;
        let query = {};

        if (name) query.name = name;
        if (category) query.category = category;
        if (tag) query.tag = tag;

        const activity = await ActivityModel.findOne(query);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

} 


// Filter activities based on budget or date or category or ratings
const filterActivities = async (req, res) => {
    try {
        const { budget, date, category, ratings } = req.query;
        let query = {};

        if (budget) query.price = { $lte: budget };
        if (date) query.date = { $gte: new Date(date) };
        if (category) query.category = category;
        if (ratings) query.ratings = { $gte: ratings };

        const activities = await ActivityModel.find(query);

        if (!activities) {
            return res.status(404).json({ message: 'No activities found' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// Sort upcoming activities based on price or ratings
const sortActivities = async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortCriteria = {};

        if (sortBy === 'price') {
            sortCriteria.price = 1; // Ascending order
        } else if (sortBy === 'ratings') {
            sortCriteria.ratings = -1; // Descending order
        } else {
            return res.status(400).json({ message: 'Invalid sort criteria' });
        }

        const activities = await ActivityModel.find({ date: { $gte: new Date() } }).sort(sortCriteria);

        if (!activities) {
            return res.status(404).json({ message: 'No upcoming activities found' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = {
    getUpcomingActivities ,
    getActivity,
    filterActivities,
    sortActivities
}

