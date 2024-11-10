const express = require('express');
const router = express.Router();
const {
    addTransportation,
    getAllTransportations,
    getTransportation,
    updateTransportation,
    deleteTransportation
} = require('../Controllers/TransportationControllers.js');

// Add transportation
router.post('/', addTransportation);

// Get all transportations
router.get('/', getAllTransportations);

// Get specific transportation
router.get('/:id', getTransportation);

// Update transportation
router.put('/:id', updateTransportation);

// Delete transportation
router.delete('/:id', deleteTransportation);

module.exports = router;

