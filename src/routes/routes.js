const express = require('express');
const router = express.Router();

const deliveryRoutes = require('./deliveryRoutes.js');
const locationRoutes = require('./locationRoutes.js');
const orderRoutes = require('./ordersRoutes.js');
const dispatcherRoutes = require('./dispatcherRoutes.js');

router.use('/deliveries', deliveryRoutes);
router.use('/locations', locationRoutes);
router.use('/orders', orderRoutes);
router.use('/dispatchers', dispatcherRoutes);
module.exports = router;