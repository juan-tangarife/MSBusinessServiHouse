const express = require('express');
const router = express.Router();
const { createOrder } = require('../controller/orderController.js');

router.post('/create', createOrder);

module.exports = router;