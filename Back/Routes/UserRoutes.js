const express = require('express');
const router = express.Router();

const {
	addUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	login,
	getUnapprovedUsers,
	getApprovedUsers,
	getUserDocuments,
	getUsersToDelete,
	getUsername,
	addActivityBooking,
	getActivityBookings,
	removeActivityBooking,
	getItineraryBookings,
	addItineraryBooking,
	removeItineraryBooking,
	addProductPurchase,
	getProductPurchases,
	removeProductPurchase,
	getComments,
	addComment,
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

// Get User Documents
router.get('/documents/:id', getUserDocuments);

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

// Get Itinerary Bookings
router.get('/itinerary-bookings/:id', getItineraryBookings);

// Add Itinerary Booking
router.post('/itinerary-booking/:id', addItineraryBooking);

// Remove Itinerary Booking
router.delete('/itinerary-booking/:id', removeItineraryBooking);

// Add Product Purchase
router.post('/product-purchase/:id', addProductPurchase);

// Get Product Purchases
router.get('/product-purchases/:id', getProductPurchases);

// Remove Product Purchase	
router.delete('/product-purchase/:id', removeProductPurchase);

// Get all comments for a specific user
router.get('/:id/comments', getComments);

// Add a comment to a specific user
router.post('/:id/comments', addComment);



// Login
router.post('/login', login);

module.exports = router;