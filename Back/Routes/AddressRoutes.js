const express = require('express');
const router = express.Router();

const{
    addAddress,
    deleteAddress,
    updateAddress,
    getUserAddresses,
}= require('../Controllers/AddressControllers.js');

router.post('/:id', addAddress);

router.get('/:id', getUserAddresses);

router.put('/:id', updateAddress);

router.delete('/:id', deleteAddress);

module.exports = router;