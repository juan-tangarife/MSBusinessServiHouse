const express = require('express');
const router = express.Router();
const { createOrder, allOrders } = require('../controller/orderController.js');


router.post('/create', createOrder);
router.get('/getAllOrders', allOrders)

module.exports = router;