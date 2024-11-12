const Comments = require('../Models/Comment');
// Create Comment
const addComment = async (req, res) => {
	const {user, text, stars} = req.body;
	try {
		const newComment = new Comments({user, text, stars, date: new Date()});
		await newComment.save();
		res.status(201).json(newComment);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
// Get all Comments
const getAllComments = async (req, res) => {
	try {
		const Comments = await Comments.find();
		res.status(200).json(Comments)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}