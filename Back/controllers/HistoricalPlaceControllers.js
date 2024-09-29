const HistoricalPlaceModel = require('../models/HistoricalPlace');




// get all upcoming historical places
const getAllHistoricalPlaces = async (req, res) => { 
    try {
        const historicalPlaces = await HistoricalPlaceModel.find({ upcoming: true });  
        if (!historicalPlaces) {
            return res.status(404).json({ message: 'No upcoming historical places found' });
        }
        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get a single historical place with name or category or tag
const getHistoricalPlace = async (req, res) => {
    try {
        const { name, category, tag } = req.query;
        let query = {};

        if (name) query.name = name;
        if (category) query.category = category;
        if (tag) query.tag = tag;

        const historicalPlace = await HistoricalPlaceModel.findOne(query);

        if (!historicalPlace) {
            return res.status(404).json({ message: 'Historical place not found' });
        }

        res.status(200).json(historicalPlace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


//filter historical places by tag
const filterHistoricalPlaces = async (req, res) => {
    try {
        const { tag } = req.query;
        let query = {};

        if (tag) query.tag = tag;

        const historicalPlaces = await HistoricalPlaceModel.find(query);

        if (!historicalPlaces) {
            return res.status(404).json({ message: 'No historical places found' });
        }

        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = {
    getAllHistoricalPlaces,
    getHistoricalPlace,
    filterHistoricalPlaces
}