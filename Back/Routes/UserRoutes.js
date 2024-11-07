const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');

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
	getUsersToDelete
} = require('../Controllers/UserControllers');

// Add user
router.post('/',upload.single('profilePicture'), addUser);

// Get all users
router.get('/', getUsers);

// Get Unapproved Users
router.get('/unapproved', getUnapprovedUsers);

// Get Approved Users
router.get('/approved', getApprovedUsers);

// Get Users to Delete
router.get('/toDelete', getUsersToDelete);

// Get specific user
router.get('/:id', getUser);

// Update user
router.put('/:id',upload.single('profilePicture'), updateUser);

// Delete user
router.delete('/:id', deleteUser);

// // Register tourist
// router.post('/register-tourist',upload.single('profilePicture'), registerTourist);
//
// // Register generic user
// router.post('/register-generic',upload.single('profilePicture'), registerGeneric);
//
// // Read tour guide profile
// router.get('/tour-guide/:id', readTourGuideProfile);
//
// // Update tour guide profile
// router.put('/tour-guide/:id',upload.single('profilePicture'), updateTourGuideProfile);
//
// // Update tourist profile
// router.put('/tourist/:id',upload.single('profilePicture'), updateTouristProfile);
//
// //Update Seller Profile
// router.put('/seller/:id',upload.single('profilePicture'), updateSellerProfile);
//
// // Add an Admin
// router.post('/add-admin',upload.single('profilePicture'), addAdmin);
//
// // Add a Tourism Governor
// router.post('/add-tourism-governor',upload.single('profilePicture'), addTourismGovernor);
//
// // Delete user by Admin
// router.delete('/admin/delete-user/:username', deleteUserByAdmin);

// Login
router.post('/login', login);

module.exports = router;