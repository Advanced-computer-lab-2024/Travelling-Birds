const express = require('express');
const router = express.Router();

const {addProduct, updateProduct} = require('../controllers/ProductControllers.js');

router.post('/', addProduct);
router.put('/:id', updateProduct);

module.exports = router;