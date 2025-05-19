const express = require('express');
const router = express.Router();

const {createDispatcher, getDispatchers, getDispatcherById, updateDispatcher, deleteDispatcher, getStockByDispatcher} = require('../controller/dispatcherController.js');

router.post('/create', createDispatcher);
router.get('/get', getDispatchers);
router.get('/get/:id', getDispatcherById);
router.put('/update/:id', updateDispatcher);
router.delete('/delete/:id', deleteDispatcher);
router.get('/getStock/:id', getStockByDispatcher);

module.exports = router;