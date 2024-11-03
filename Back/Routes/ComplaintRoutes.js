const express = require('express');
const router = express.Router();

const {
	addComplaint,
	getAllComplaints,
	updateComplaint,
	deleteComplaint,
	filterComplaint,
	sortComplaint,
	getAllCreatedComplaints
} = require('../Controllers/ComplaintControllers.js');

// Add Complaint
router.post('/', addComplaint);

// Get all Complaints
router.get('/', getAllComplaints);

// Filter Complaints
router.get('/filter', filterComplaint);

// Sort Complaints
router.get('/sort', sortComplaint);

// Get all Created Complaints
router.get('/user/:id', getAllCreatedComplaints);

// Update Complaint
router.put('/:id', updateComplaint);

// Delete Complaint
router.delete('/:id', deleteComplaint);



module.exports = router;