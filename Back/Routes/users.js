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
	updateTouristProfile

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


module.exports = router;