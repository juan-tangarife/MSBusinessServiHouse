const express = require('express');
const router = express.Router();

const { createOrder } = require('../controller/orderController.js');

router.post('', createOrder);

module.exports = router;