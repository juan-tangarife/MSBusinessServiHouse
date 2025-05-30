const express = require('express');
const router = express.Router();

const {createDispatcher, getDispatchers, getDispatcherById, updateDispatcher, deleteDispatcher, getStockByDispatcher, getDispatcherByUserId} = require('../controller/dispatcherController.js');

router.post('', createDispatcher);
router.get('/get', getDispatchers);
router.get('/get/:id', getDispatcherById);
router.put('/update/:id', updateDispatcher);
router.delete('/delete/:id', deleteDispatcher);
router.delete('/delete', deleteDispatcher);
router.get('/getStock/:id', getStockByDispatcher);
router.get('/getByUserId/:user_id', getDispatcherByUserId)

module.exports = router;