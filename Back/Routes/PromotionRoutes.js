const express = require('express');
const router = express.Router();

const {
	addPromotion,
	getAllPromotions,
	getPromotion,
	updatePromotion,
	deletePromotion,
	checkPromotion
} = require('../Controllers/PromotionControllers.js');

router.post('/', addPromotion);
router.get('/', getAllPromotions);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);
router.get('/check/:promoCode', checkPromotion);

module.exports = router;