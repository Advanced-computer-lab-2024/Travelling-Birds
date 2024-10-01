const Tag = require('../models/Tag');

// Add a new tag
const addTag = async (req, res) => {
	const {name} = req.body;
	try {
		const newTag = new Tag({name});
		await newTag.save();
		res.status(201).json({message: 'Tag added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getTags = async (req, res) => {
	try {
		const tags = await Tag.find();
		res.status(201).json(tags)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const updateTag = async (req, res) => {
	try {
		await Tag.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
		res.status(201).json({msg: "Tag updated successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const deleteTag = async (req, res) => {
	try {
		await Tag.findByIdAndDelete(req.params.id);
		res.status(201).json({msg: "Tag deleted successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {addTag, getTags, updateTag, deleteTag};