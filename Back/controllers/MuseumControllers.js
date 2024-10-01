const MuseumModel = require('../models/Museum');



//create museum
const addMuseum = async (req, res) => {
    const {name, description, pictures, location, openingHours,ticketPrices,tags} = req.body;
    try {
        const newMuseum = new MuseumModel(
            {name,
                description,
                pictures,
                location,
                openingHours,
                ticketPrices,
                tags
            });
        await newMuseum.save();
        res.status(201).json({message: 'Museum added successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get all  museums
const getAllMuseums = async (req, res) => {
    try{
        const museums =  MuseumModel.find();
        res.status(201).json({museums})
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}

// Update Museum
const updateMuseum = async (req, res) => {
    const {name, description, pictures, location, openingHours,ticketPrices,tags} = req.body;
    const tempMuseum = await MuseumModel.find({name});
    if (!tempMuseum) {
        res.status(500).json({msg: "No Museum found with this name"});
    }
    else {
        try {
            const updatedMuseum = MuseumModel.findOneAndUpdate(
                {name},
                {description, pictures, location, openingHours,ticketPrices,tags},
                {new: true});
            await updatedMuseum.save();
            res.status(201).json({msg: "Museum updated successfully"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

// Delete Museum
const deleteMuseum = async (req, res) => {
    const {name} = req.body;
    const tempMuseum = await MuseumModel.find({name});
    if (!tempMuseum) {
        res.status(500).json({msg: "No Museum found with this name"});
    }
    else {
        try {
            await MuseumModel.deleteOne({name});
            res.status(201).json({msg: "Museum deleted successfully"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}
// search for a specific Museum by it's name or category or tag
const SearchForMuseums = async (req, res) => {
    try {
        const { name, category, tag } = req.query;
        let query = {};

        if (name) query.name = name;
        if (category) query.category = category;
        if (tag) query.tag = tag;

        const museum = await MuseumModel.findOne(query);

        if (!museum) {
            return res.status(404).json({ message: 'Museum not found' });
        }

        res.status(200).json(museum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// get all upcoming museums
const getUpcomingMuseums = async (req, res) => {
    try {
        const museums = await MuseumModel.find({ date: { $gte: new Date() } });

        if (!museums) {
            return res.status(404).json({ message: 'No upcoming museums found' });
        }

        res.status(200).json(museums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//filter museums by tag
const filterMuseums = async (req, res) => {
    try {
        const { tag } = req.query;
        let query = {};

        if (tag) query.tag = tag;

        const museums = await MuseumModel.find(query);

        if (!museums) {
            return res.status(404).json({ message: 'No museums found' });
        }

        res.status(200).json(museums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// Get all created museums
const getAllCreatedMuseums = async (req, res) => {
    //no reference to logged-in user
    try{
        const museums =  MuseumModel.find();
        res.status(201).json({museums})
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    addMuseum,
    getAllMuseums,
    updateMuseum,
    SearchForMuseums,
    getUpcomingMuseums,
    filterMuseums,
    getAllCreatedMuseums
}