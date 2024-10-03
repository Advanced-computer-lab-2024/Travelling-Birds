const express = require('express');
const router = express.Router();

const {
	registerTourist,
	registerGeneric,
	readTourGuideProfile,
	updateTourGuideProfile,
	updateTouristProfile

} = require('../controllers/UserControllers');

// Register as a tourist
router.post('/tourist', registerTourist );
// Register as a tour guide/advertiser/seller
router.post('/generic', registerGeneric )
// Read tour guide profile
router.get('/generic/:id', readTourGuideProfile);
// Update tour guide profile
router.put('/generic/:id', updateTourGuideProfile);
// Update tourist profile
router.put('/tourist/:id', updateTouristProfile);

module.exports = router;