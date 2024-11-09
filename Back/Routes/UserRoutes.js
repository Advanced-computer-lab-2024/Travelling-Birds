const express = require('express');
const router = express.Router();

const {
	addUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	// registerTourist,
	// registerGeneric,
	// readTourGuideProfile,
	// updateTourGuideProfile,
	// updateTouristProfile,
	// updateSellerProfile,
	// addAdmin,
	// addTourismGovernor,
	// deleteUserByAdmin,
	login,
	getUnapprovedUsers,
	getApprovedUsers,
	getUsersToDelete,
	getUsername,
	addActivityBooking,
	getActivityBookings,
	removeActivityBooking

} = require('../Controllers/UserControllers');
const {multipleFieldsUpload,upload} = require("../Middleware/upload");

// Add user
router.post('/',multipleFieldsUpload, addUser);

// Get all users
router.get('/', getUsers);

// Get specific username
router.get('/username', getUsername);

// Get Unapproved Users
router.get('/unapproved', getUnapprovedUsers);

// Get Approved Users
router.get('/approved', getApprovedUsers);

// Get Users to Delete
router.get('/toDelete', getUsersToDelete);

// Get specific user
router.get('/:id', getUser);

// Update user
router.put('/:id', upload.single('profilePicture'), updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Add Activity Booking
router.post('/activity-booking/:id', addActivityBooking);

// Get Activity Bookings
router.get('/activity-bookings/:id', getActivityBookings);

// Remove Activity Booking
router.delete('/activity-booking/:id', removeActivityBooking);



// Login
router.post('/login', login);

module.exports = router;