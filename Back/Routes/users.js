const express = require('express');
const router = express.Router();

const {
	addUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	registerTourist,
	registerGeneric,
	readTourGuideProfile,
	updateTourGuideProfile,
	updateTouristProfile,
	updateSellerProfile,
	addAdmin,
	addTourismGovernor,
	deleteUserByAdmin
} = require('../controllers/UserControllers');

// Add user
router.post('/', addUser);

// Get all users
router.get('/', getUsers);

// Get specific user
router.get('/:id', getUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Register tourist
router.post('/register-tourist', registerTourist);

// Register generic user
router.post('/register-generic', registerGeneric);

// Read tour guide profile
router.get('/tour-guide/:id', readTourGuideProfile);

// Update tour guide profile
router.put('/tour-guide/:id', updateTourGuideProfile);

// Update tourist profile
router.put('/tourist/:id', updateTouristProfile);

//Update Seller Profile
router.put('/seller/:id', updateSellerProfile);

//begin test
// Add an Admin
router.post('/add-admin', addAdmin);

// Add a Tourism Governor
router.post('/add-tourism-governor', addTourismGovernor);

// Delete user by Admin
router.delete('/admin/delete-user/:username', deleteUserByAdmin);
//end test

module.exports = router;