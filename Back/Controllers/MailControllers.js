const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (req, res) => {
	const { email, subject, message, htmlContent } = req.body;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: email,
		subject,
		text: message, // Plain text fallback
		html: htmlContent, // HTML content for better formatting
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error });
	}
};

module.exports = { sendMail };