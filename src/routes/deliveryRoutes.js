const express = require('express');
const router = express.Router();

const { createDelivery } = require('../controller/deliveryController.js');

router.post('', createDelivery);

module.exports = router;