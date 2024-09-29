const IntineraryModel = require('../models/Intinerary.js');

// get all upcoming intineraries
const getUpcomingIntineraries = async (req, res) => {
    try {
        const intineraries = await IntineraryModel.find({ date: { $gte: new Date() } });

        if (!intineraries) {
            return res.status(404).json({ message: 'No upcoming intineraries found' });
        }

        res.status(200).json(intineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get a single intinerary with name or category or tag
const getIntinerary = async (req, res) => {
    try {
        const { name, category, tag } = req.query;
        let query = {};

        if (name) query.name = name;
        if (category) query.category = category;
        if (tag) query.tag = tag;

        const intinerary = await IntineraryModel.findOne(query);

        if (!intinerary) {
            return res.status(404).json({ message: 'Intinerary not found' });
        }

        res.status(200).json(intinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

//sort all upcoming itineraries based on price or rartings
const sortIntineraries = async (req, res) => {
    try {
        const { price, ratings } = req.query;
        let query = {};

        if (price) query.price = price;
        if (ratings) query.ratings = ratings;

        const intineraries = await IntineraryModel.find(query);

        if (!intineraries) {
            return res.status(404).json({ message: 'No intineraries found' });
        }

        res.status(200).json(intineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Filter all available/upcoming itineraries based on budget, date, preferences and language
const filterIntineraries = async (req, res) => {
    try {
        const { budget, date, preferences, language } = req.query;
        let query = {};

        if (budget) query.price = { $lte: budget };
        if (date) query.date = { $gte: new Date(date) };
        if (preferences) query.preferences = preferences;
        if (language) query.language = language;

        const intineraries = await IntineraryModel.find(query);

        if (!intineraries) {
            return res.status(404).json({ message: 'No intineraries found' });
        }

        res.status(200).json(intineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    getUpcomingIntineraries,
    getIntinerary,
    sortIntineraries,
    filterIntineraries

};