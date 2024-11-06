const multer = require('multer');
const fs = require('fs');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;