const express = require('express');
const router = express.Router();

const {
	registerTourist,
	registerGeneric,
	readTourGuideProfile

} = require('../controllers/UserControllers');

// Register as a tourist
router.post('/register/tourist', registerTourist );

// Register as a tour guide/advertiser/seller
router.post('/register/generic', registerGeneric )
// Read tour guide profile
router.get('/profile/:id', readTourGuideProfile);


module.exports = router;