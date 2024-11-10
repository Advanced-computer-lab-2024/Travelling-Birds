const express = require('express');

const {sendMail} = require('../Controllers/MailControllers.js');

const router = express.Router();

// Send an email
router.post('/', sendMail);

module.exports = router;