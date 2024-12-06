const express = require('express');
const router = express.Router();

const{
    addAddress,
    deleteAddress,
    updateAddress,
    getUserAddresses,
    getDefaultAddress
}= require('../Controllers/AddressControllers.js');

router.post('/:id', addAddress);

router.get('/:id', getUserAddresses);

router.put('/:id', updateAddress);

router.delete('/:id', deleteAddress);

router.get('/:id/default', getDefaultAddress);

module.exports = router;