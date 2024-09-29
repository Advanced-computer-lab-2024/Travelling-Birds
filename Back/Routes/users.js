const express = require('express');
const router = express.Router();

const {
	registerTourist,
	registerGeneric

} = require('../controllers/UserControllers');

// Register as a tourist
router.post('/register/tourist', registerTourist );

// Register as a tour guide/advertiser/seller
router.post('/register/generic', registerGeneric )


module.exports = router;