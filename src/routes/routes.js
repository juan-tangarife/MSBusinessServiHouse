const express = require('express');
const router = express.Router();

const deliveryRoutes = require('./deliveryRoutes.js');
const locationRoutes = require('./locationRoutes.js');
const orderRoutes = require('./ordersRoutes.js');

router.use('/deliveries', deliveryRoutes);
router.use('/locations', locationRoutes);
router.use('/orders', orderRoutes);

module.exports = router;