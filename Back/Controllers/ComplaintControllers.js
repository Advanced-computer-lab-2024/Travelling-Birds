const Complaint = require('../models/Complaint');
const UserModel = require("../Models/User");


// Create Complaint
const addComplaint = async (req, res) => {
	const currentDate = new Date();
	const {title, body, createdBy} = req.body;
	try {
		const newComplaint = new Complaint({title, date: currentDate, body, status: 'pending', reply: '', createdBy});
		await newComplaint.save();
		res.status(201).json(newComplaint);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all Complaint
const getAllComplaints = async (req, res) => {
	try {
		const Complaints = await Complaint.find();
		const updatedComplaints = await Promise.all(Complaints.map(async (complaint) => {
			const user = await UserModel.findById(complaint.createdBy).select('firstName lastName');
			complaint._doc.createdByName = user? `${user.firstName} ${user.lastName}` : 'N/A';
			return complaint;
		}));
		res.status(200).json(updatedComplaints);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get Complaint by ID
const getComplaintById = async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id);
		res.status(200).json(complaint);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}


// Update Complaint
const updateComplaint = async (req, res) => {
	try {
		const complaint = await Complaint.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
		res.status(201).json(complaint);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Delete Complaint
const deleteComplaint = async (req, res) => {
	try {
		await Complaint.findByIdAndDelete(req.params.id);
		res.status(201).json({msg: "Complaint deleted successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const filterComplaint = async (req, res) => {
	try {
		const {status} = req.query; // Extract tag from the query parameters

		if (!status) {
			return res.status(400).json({message: 'Status is required to filter museums.'});
		}

		const complaints = await Complaint.find({status: status});

		if (status.length === 0) {
			return res.status(404).json({message: 'No complaints found with the given status.'});
		}

		return res.status(200).json(complaints);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while filtering complaints.', error});
	}
}

const sortComplaint = async (req, res) => {
	try {
		const Complaints = await Complaint.find().sort({date: 1});
		res.status(200).json(Complaints);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getAllCreatedComplaints = async (req, res) => {
	try {
		const complaints = await Complaint.find({createdBy: req.params.id});
		res.status(200).json(complaints)
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}


module.exports = {
	addComplaint,
	getAllComplaints,
	getComplaintById,
	updateComplaint,
	deleteComplaint,
	filterComplaint,
	sortComplaint,
	getAllCreatedComplaints
};