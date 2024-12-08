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
	addSavedActivity,
	getSavedActivities,
	removeSavedActivity,
	addSavedItinerary,
	getSavedItineraries,
	removeSavedItinerary,
	addProductToWishlist,
	getProductWishlist,
	removeProductFromWishlist,
	addProductToCart,
	getCart,
	removeProductFromCart,
	requestDelete,
	requestOtp,
	verifyOtpAndResetPassword,
	getUserAnalytics,
	getSalesAnalytics
} = require('../Controllers/UserControllers');
const {multipleFieldsUpload, upload} = require("../Middleware/upload");

// Add user
router.post('/', multipleFieldsUpload, addUser);

// Get all users
router.get('/', getUsers);

// Get Recent Users
router.get('/analytics', getUserAnalytics);

// Get Sales Analytics
router.post('/sales/:id', getSalesAnalytics);

// Get specific username
router.get('/username', getUsername);

// Get Unapproved Users
router.get('/unapproved', getUnapprovedUsers);

// Get User Documents
router.get('/documents/:id', getUserDocuments);

// Get Approved Users
router.get('/approved', getApprovedUsers);

// Request Delete
router.put('/requestDelete/:id', requestDelete);

// Get Users to Delete
router.get('/toDelete', getUsersToDelete);

// Get specific user
router.get('/:id', getUser);

// Update user
router.put('/:id', upload.fields([{name: 'profilePicture', maxCount: 1}, {name: 'backDrop', maxCount: 1}]), updateUser);

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

// Add Saved Activity
router.post('/saved-activity/:id', addSavedActivity);

// Get Saved Activities
router.get('/saved-activities/:id', getSavedActivities);

// Remove Saved Activity
router.delete('/saved-activity/:id', removeSavedActivity);

// Add Saved Itinerary
router.post('/saved-itinerary/:id', addSavedItinerary);

// Get Saved Itineraries
router.get('/saved-itineraries/:id', getSavedItineraries);

// Remove Saved Itinerary
router.delete('/saved-itinerary/:id', removeSavedItinerary);

// Add Product to Wishlist
router.post('/product-wishlist/:id', addProductToWishlist);

// Get Product Wishlist
router.get('/product-wishlist/:id', getProductWishlist);

// Remove Product from Wishlist
router.delete('/product-wishlist/:id', removeProductFromWishlist);

// Add Product to Cart
router.post('/product-cart/:id', addProductToCart);

// Get Cart
router.get('/product-cart/:id', getCart);

// Remove Product from Cart
router.delete('/product-cart/:id', removeProductFromCart);

// Get all comments for a specific user
router.get('/:id/comments', getComments);

// Add a comment to a specific user
router.post('/:id/comments', addComment);

// Login
router.post('/login', login);

// Request OTP
router.post('/request-otp', requestOtp);

// Verify OTP and Reset Password
router.post('/verify-otp', verifyOtpAndResetPassword);

module.exports = router;