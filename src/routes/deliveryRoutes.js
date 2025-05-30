const express = require('express');
const router = express.Router();

const { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery, getDeliveryByUserId } = require('../controller/deliveryController.js');

router.post('/create', createDelivery);
router.get('/get', getDeliveries);
router.get('/get/:id', getDeliveryById);
router.put('/update/:id', updateDelivery);
router.delete('/delete/:id', deleteDelivery);
router.delete('/delete', deleteDelivery);
router.get('/getUserId/:user_id', getDeliveryByUserId)

module.exports = router;