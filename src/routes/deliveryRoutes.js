const express = require('express');
const router = express.Router();

const { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery } = require('../controller/deliveryController.js');

router.post('/create', createDelivery);
router.get('/get', getDeliveries);
router.get('/get/:id', getDeliveryById);
router.put('/update/:id', updateDelivery);
router.delete('/delete/:id', deleteDelivery);
router.delete('/delete', deleteDelivery);

module.exports = router;