const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  // Configure your email transporter (e.g., using Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services or configure custom SMTP settings
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error details
    res.status(500).send({ success: false, message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;