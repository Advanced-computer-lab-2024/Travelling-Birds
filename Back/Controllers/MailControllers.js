const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (req, res) => {
	const {email, subject, message} = req.body;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		}
	});

	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: email,
		subject: subject,
		text: message
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({message: 'Email sent successfully'});
	} catch (error) {
		console.log('GMAIL_USER:', process.env.GMAIL_USER);
        console.log('GMAIL_PASS length:', process.env.GMAIL_PASS?.length);
		console.error('Error sending email:', error);
		res.status(500).json({message: 'Failed to send email', error});
	}
};

module.exports = {sendMail};