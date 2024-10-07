const Tag = require('../models/Tag');

// Add tag
const addTag = async (req, res) => {
	const {name} = req.body;
	try {
		const newTag = new Tag({name});
		await newTag.save();
		res.status(201).json(newTag);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all tags
const getAllTags = async (req, res) => {
	try {
		const tags = await Tag.find();
		res.status(200).json(tags)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific tag
const getTag = async (req, res) => {
	try {
		const tag = await Tag.findById(req.params.id);
		if (!tag) {
			return res.status(404).json({message: 'Tag not found'});
		}
		res.status(200).json(tag);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update tag
const updateTag = async (req, res) => {
	try {
		await Tag.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
		res.status(201).json({msg: "Tag updated successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Delete tag
const deleteTag = async (req, res) => {
	try {
		await Tag.findByIdAndDelete(req.params.id);
		res.status(201).json({msg: "Tag deleted successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addTag,
	getAllTags,
	getTag,
	updateTag,
	deleteTag
};