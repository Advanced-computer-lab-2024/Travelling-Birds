const cron = require('node-cron');
const User = require('../Models/User');
const UUID = require('uuid').v4;

const generatePromoCode = () => {
	const promoCode = "BIRTHDAY-" + UUID().substring(0, 6).toUpperCase();

	const body = {
		promoCode,
		discount: 15,
		startDate: new Date(),
		// Set the end date to 30 days from now
		endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		isActive: true
	}

	fetch('http://localhost:8000/api/promotions', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(body)
	}).catch(error => console.error('Error creating promo code:', error));


	return promoCode;
};

const sendPromoCodeEmail = (email, promoCode) => {
	const subject = "Happy Birthday! Here is your promo code";
	const message = `Happy Birthday! Use this promo code to get a discount: ${promoCode}`;

	fetch('http://localhost:8000/api/mail', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({email, subject, message})
	}).then(r => r);
};

const scheduleBirthdayPromo = () => {
	const runTask = async () => {
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		try {
			const users = await User.find({
				dob: {$exists: true},
				$expr: {
					$and: [
						{$eq: [{$month: '$dob'}, month]},
						{$eq: [{$dayOfMonth: '$dob'}, day]}
					]
				}
			});

			for (const user of users) {
				console.log(`Sending promo code to ${user.email}`);
				const promoCode = generatePromoCode();
				sendPromoCodeEmail(user.email, promoCode);
			}
		} catch (error) {
			console.error('Error scheduling birthday promo:', error);
		}
	};

	// Schedule the task to run every day at midnight
	cron.schedule('0 0 * * *', runTask);

	// Run the task immediately for testing
	runTask().then(() => console.log('Scheduled birthday promo'));
};

module.exports = {scheduleBirthdayPromo};