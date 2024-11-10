const Transportation = require('../Models/Transportation');

// Add transportation
const addTransportation = async (req, res) => {
    const {name} = req.body;
    try {
        const newTransportation = new Transportation({name});
        await newTransportation.save();
        res.status(201).json(newTransportation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get all transportations
const getAllTransportations = async (req, res) => {
    try {
        const transportations = await Transportation.find();
        res.status(200).json(transportations)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get specific transportation
const getTransportation = async (req, res) => {
    try {
        const transportation = await Transportation.findById(req.params.id);
        if (!transportation) {
            return res.status(404).json({message: 'Transportation not found'});
        }
        res.status(200).json(transportation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Update transportation
const updateTransportation = async (req, res) => {
    try {
        const transportation = await Transportation.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(201).json(transportation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Delete transportation
const deleteTransportation = async (req, res) => {
    try {
        await Transportation.findByIdAndDelete(req.params.id);
        res.status(201).json({msg: "Transportation deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    addTransportation,
    getAllTransportations,
    getTransportation,
    updateTransportation,
    deleteTransportation
}