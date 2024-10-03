const express = require('express');
const router = express.Router();

const {
	registerTourist,
	registerGeneric,
	readTourGuideProfile,
	updateTourGuideProfile,
	updateSellerProfile

} = require('../controllers/UserControllers');

// Register as a tourist
router.post('/register/tourist', registerTourist );
// Register as a tour guide/advertiser/seller
router.post('/register/generic', registerGeneric )
// Read tour guide profile
router.get('/profile/:id', readTourGuideProfile);
// Update tour guide profile
router.put('/profile/:id', updateTourGuideProfile);
//Update Seller Profile
router.put('/putSeller/:id', updateSellerProfile);

module.exports = router;