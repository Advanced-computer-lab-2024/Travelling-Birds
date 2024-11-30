const Promotion = require('../Models/Promotion');

// Add promotion
const addPromotion = async (req, res) => {
	const {promoCode, discount, startDate, endDate, isActive} = req.body;

	try {
		const newPromotion = new Promotion({
			promoCode, discount, startDate, endDate, isActive
		});
		await newPromotion.save({new: true});
		res.status(201).json(newPromotion);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get promotions
const getAllPromotions = async (req, res) => {
	try {
		const promotions = await Promotion.find();
		res.status(200).json(promotions);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific promotion
const getPromotion = async (req, res) => {
	try {
		const promotion = await Promotion.findById(req.params.id);
		if (!promotion) {
			return res.status(404).json({message: 'Promotion not found'});
		}
		res.status(200).json(promotion);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update promotion
const updatePromotion = async (req, res) => {
	const {promoCode, discount, startDate, endDate, isActive} = req.body;
	try {
		const updatedFields = {
			promoCode,
			discount,
			startDate,
			endDate,
			isActive
		};
		const promotion = await Promotion.findByIdAndUpdate(req.params.id, updatedFields, {new: true});
		if (!promotion) {
			return res.status(404).json({message: 'Promotion not found'});
		}
		res.status(200).json(promotion);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Delete promotion
const deletePromotion = async (req, res) => {
	try {
		const promotion = await Promotion.findByIdAndDelete(req.params.id);
		if (!promotion) {
			return res.status(404).json({message: 'Promotion not found'});
		}
		res.status(200).json({message: 'Promotion deleted successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Check promotion
const checkPromotion = async (req, res) => {
	const {promoCode} = req.params;
	try {
		const promotion = await Promotion.findOne({promoCode});
		if (!promotion) {
			return res.status(404).json({message: 'Promotion not found'});
		}
		res.status(200).json(promotion);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addPromotion,
	getAllPromotions,
	getPromotion,
	updatePromotion,
	deletePromotion,
	checkPromotion
};