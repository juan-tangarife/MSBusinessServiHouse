const express = require('express');
const router = express.Router();
const { getAllStockTransactions } = require('../controller/stockTransactionController.js');

router.get('/get', getAllStockTransactions);

module.exports = router;