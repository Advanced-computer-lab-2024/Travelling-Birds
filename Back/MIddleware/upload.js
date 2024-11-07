const multer = require('multer');
const fs = require('fs');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const multipleFieldsUpload = upload.fields([
	{ name: 'identityCard', maxCount: 1 },
	{ name: 'certificates', maxCount: 10 }, // Adjust maxCount as needed
	{ name: 'taxRegCard', maxCount: 1 },
]);

module.exports = {
	multipleFieldsUpload,
	upload
};