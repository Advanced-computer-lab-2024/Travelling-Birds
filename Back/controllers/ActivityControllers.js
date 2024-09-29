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

// Sort upcoming activities based on price or ratings



module.exports = {
    getUpcomingActivities ,
    getActivity 
}

