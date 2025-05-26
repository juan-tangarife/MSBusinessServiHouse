const express = require('express');
const router = express.Router();

const {createManager, getManagers, getManagerById, updateManager, deleteManager, getStorageByManagerId, getManagerByUserId, updateManagerUserId} = require('../controller/managerController.js');

router.post('/create', createManager);
router.get('/get', getManagers);
router.get('/get/:id', getManagerById);
router.put('/update/:id', updateManager);
router.delete('/delete/:id', deleteManager);
router.get('/getStorageByManagerId/:id', getStorageByManagerId); 
router.get('/getManagerByUserId/:user_id', getManagerByUserId);
router.put('/updateUserId/:id', updateManagerUserId);


module.exports = router;