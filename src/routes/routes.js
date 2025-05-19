const express = require('express');
const router = express.Router();

const deliveryRoutes = require('./deliveryRoutes.js');
const locationRoutes = require('./locationRoutes.js');
const orderRoutes = require('./ordersRoutes.js');
const dispatcherRoutes = require('./dispatcherRoutes.js');
const providerRoutes = require('./providerRoutes.js');
const managerRoutes = require('./managerRoutes.js');


router.use('/delivery', deliveryRoutes);
router.use('/locations', locationRoutes);
router.use('/orders', orderRoutes);
router.use('/dispatcher', dispatcherRoutes);
router.use('/provider', providerRoutes);
router.use('/manager', managerRoutes);

module.exports = router;