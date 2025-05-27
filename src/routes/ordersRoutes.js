const express = require('express');
const router = express.Router();
const { createOrder, allOrders, readOrder, deleteOrder, updateOrder, getOrdersByDispatcherId, getOrdersByStorageId, getOrderWithDelivery, getOrderStorage,getOrdersByDeliveryId } = require('../controller/orderController.js');

router.post('/create', createOrder);
router.get('/get/:order_number', readOrder);
router.get('/getAll', allOrders);
router.delete('/delete/:id', deleteOrder);
router.put('/update/:id', updateOrder);
router.get('/getOrdersByDispatcherId/:dispatcher_id', getOrdersByDispatcherId);
router.get('/getOrdersByStorageId/:storage_id', getOrdersByStorageId);
router.get('/getOrderWithDelivery/:id', getOrderWithDelivery);
router.get('/getOrderStorage/:id', getOrderStorage);
router.get('/getOrderByDeliveryId/:delivery_id', getOrdersByDeliveryId);

module.exports = router;