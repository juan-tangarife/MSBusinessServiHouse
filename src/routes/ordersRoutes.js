const express = require('express');
const router = express.Router();
const { createOrder, allOrders, deleteOrder, updateOrder, getOrdersByDispatcherId, getOrdersByStorageId  } = require('../controller/orderController.js');

router.post('/create', createOrder);
router.get('/getAll', allOrders);
router.delete('/delete/:id', deleteOrder);
router.put('/update/:id', updateOrder);
router.get('/getOrdersByDispatcherId/:dispatcher_id', getOrdersByDispatcherId);
router.get('/getOrdersByStorageId/:storage_id', getOrdersByStorageId);

module.exports = router;